<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vehicle;
use App\Models\Activity;
use Carbon\Carbon;

class CheckExpiries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fleet:check-expiries';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for expiring insurance and road tax (30 and 7 day alerts)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking fleet expiries...');
        
        $today = Carbon::today();
        $thirtyDays = $today->copy()->addDays(30);
        $sevenDays = $today->copy()->addDays(7);

        $vehicles = Vehicle::all();
        $count = 0;

        foreach ($vehicles as $vehicle) {
            // 1. Check Insurance Expiry
            if ($vehicle->insuranceExpiry) {
                $expiry = Carbon::parse($vehicle->insuranceExpiry);
                
                if ($expiry->isSameDay($sevenDays)) {
                    $this->createAlert($vehicle, 'Insurance', 'Urgent (7 days)');
                    $count++;
                } elseif ($expiry->isSameDay($thirtyDays)) {
                    $this->createAlert($vehicle, 'Insurance', 'Upcoming (30 days)');
                    $count++;
                }
            }

            // 2. Check Road Tax Expiry
            if ($vehicle->roadTaxExpiry) {
                $expiry = Carbon::parse($vehicle->roadTaxExpiry);
                
                if ($expiry->isSameDay($sevenDays)) {
                    $this->createAlert($vehicle, 'Road Tax', 'Urgent (7 days)');
                    $count++;
                } elseif ($expiry->isSameDay($thirtyDays)) {
                    $this->createAlert($vehicle, 'Road Tax', 'Upcoming (30 days)');
                    $count++;
                }
            }

            // 3. Check Maintenance Date
            if ($vehicle->next_service_date) {
                $expiry = Carbon::parse($vehicle->next_service_date);
                
                if ($expiry->isSameDay($sevenDays)) {
                    $this->createAlert($vehicle, 'Maintenance Service', 'Urgent (7 days)');
                    $count++;
                } elseif ($expiry->isSameDay($thirtyDays)) {
                    $this->createAlert($vehicle, 'Maintenance Service', 'Upcoming (30 days)');
                    $count++;
                }
            }

            // 4. Check Maintenance Odometer
            if ($vehicle->next_service_odometer && $vehicle->odometer) {
                $diff = $vehicle->next_service_odometer - $vehicle->odometer;
                
                if ($diff <= 500 && $diff > 0) {
                    $this->createAlert($vehicle, 'Maintenance Odometer', 'Urgent (less than 500km remaining)');
                    $count++;
                } elseif ($diff <= 1000 && $diff > 500) {
                    $this->createAlert($vehicle, 'Maintenance Odometer', 'Upcoming (less than 1000km remaining)');
                    $count++;
                }
            }
        }

        $this->info("Check complete. {$count} alerts generated.");
    }

    private function createAlert($vehicle, $type, $urgency)
    {
        Activity::create([
            'type' => 'alert',
            'message' => "{$urgency}: {$type} for {$vehicle->regNo} is expiring soon.",
            'user' => 'System',
        ]);
        
        $this->warn("Alert created for {$vehicle->regNo} ($type - $urgency)");
    }
}
