<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle;
use App\Models\Driver;
use App\Models\Booking;
use App\Models\Maintenance;
use App\Models\InsurancePolicy;
use App\Models\Accident;
use App\Models\Fine;
use App\Models\Disposal;
use App\Models\Activity;
use Carbon\Carbon;

class FleetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vehicles
        $v1 = Vehicle::create([
            'regNo' => 'WPK 1234', 'type' => 'SUV', 'brand' => 'Toyota', 'model' => 'Fortuner', 'engine' => '2.8L Diesel', 'purchaseDate' => Carbon::now()->subDays(800), 'status' => 'available', 'location' => 'HQ Garage', 'department' => 'Operations', 'insuranceExpiry' => Carbon::now()->addDays(45), 'roadTaxExpiry' => Carbon::now()->addDays(90), 'class' => 'department', 'odometer' => 45230
        ]);
        $v2 = Vehicle::create([
            'regNo' => 'WXY 5678', 'type' => 'Sedan', 'brand' => 'Honda', 'model' => 'Accord', 'engine' => '2.0L Petrol', 'purchaseDate' => Carbon::now()->subDays(400), 'status' => 'in_use', 'location' => 'Branch A', 'department' => 'EXCO', 'insuranceExpiry' => Carbon::now()->addDays(5), 'roadTaxExpiry' => Carbon::now()->addDays(25), 'class' => 'exco', 'odometer' => 22100
        ]);
        $v3 = Vehicle::create([
            'regNo' => 'WAB 9012', 'type' => 'Van', 'brand' => 'Toyota', 'model' => 'Hiace', 'engine' => '2.5L Diesel', 'purchaseDate' => Carbon::now()->subDays(1200), 'status' => 'maintenance', 'location' => 'Workshop', 'department' => 'Logistics', 'insuranceExpiry' => Carbon::now()->addDays(120), 'roadTaxExpiry' => Carbon::now()->addDays(200), 'class' => 'department', 'odometer' => 89400
        ]);
        $v4 = Vehicle::create([
            'regNo' => 'WCD 3456', 'type' => 'Pickup', 'brand' => 'Isuzu', 'model' => 'D-Max', 'engine' => '3.0L Diesel', 'purchaseDate' => Carbon::now()->subDays(600), 'status' => 'available', 'location' => 'HQ Garage', 'department' => 'Engineering', 'insuranceExpiry' => Carbon::now()->addDays(200), 'roadTaxExpiry' => Carbon::now()->addDays(28), 'class' => 'department', 'odometer' => 31000
        ]);
        $v5 = Vehicle::create([
            'regNo' => 'WEF 7890', 'type' => 'Sedan', 'brand' => 'Mercedes', 'model' => 'E-Class', 'engine' => '2.0L Hybrid', 'purchaseDate' => Carbon::now()->subDays(200), 'status' => 'in_use', 'location' => 'EXCO Wing', 'department' => 'EXCO', 'insuranceExpiry' => Carbon::now()->addDays(350), 'roadTaxExpiry' => Carbon::now()->addDays(350), 'class' => 'exco', 'odometer' => 8900
        ]);
        $v6 = Vehicle::create([
            'regNo' => 'WGH 1122', 'type' => 'SUV', 'brand' => 'BMW', 'model' => 'X3', 'engine' => '2.0L Petrol', 'purchaseDate' => Carbon::now()->subDays(1500), 'status' => 'disposed', 'location' => '—', 'department' => 'Finance', 'insuranceExpiry' => Carbon::now()->subDays(30), 'roadTaxExpiry' => Carbon::now()->subDays(30), 'class' => 'department', 'odometer' => 145000
        ]);

        // Drivers
        $d1 = Driver::create(['name' => 'Ahmad Faizal', 'licenseNo' => 'D1234567', 'department' => 'Operations', 'status' => 'active', 'fineCount' => 1, 'accidentCount' => 0, 'phone' => '+60123456789', 'email' => 'ahmad@fleet.com', 'licenseExpiry' => Carbon::now()->addYears(2)]);
        $d2 = Driver::create(['name' => 'Siti Aminah', 'licenseNo' => 'D2345678', 'department' => 'EXCO', 'status' => 'active', 'fineCount' => 0, 'accidentCount' => 0, 'phone' => '+60123456788', 'email' => 'siti@fleet.com', 'licenseExpiry' => Carbon::now()->addYears(3)]);
        $d3 = Driver::create(['name' => 'Raj Kumar', 'licenseNo' => 'D3456789', 'department' => 'Logistics', 'status' => 'suspended', 'fineCount' => 4, 'accidentCount' => 2, 'phone' => '+60123456787', 'email' => 'raj@fleet.com', 'licenseExpiry' => Carbon::now()->addYears(1)]);
        $d4 = Driver::create(['name' => 'Lim Wei Sheng', 'licenseNo' => 'D4567890', 'department' => 'Engineering', 'status' => 'active', 'fineCount' => 0, 'accidentCount' => 1, 'phone' => '+60123456786', 'email' => 'lim@fleet.com', 'licenseExpiry' => Carbon::now()->addYears(2)]);
        $d5 = Driver::create(['name' => 'Nurul Izzah', 'licenseNo' => 'D5678901', 'department' => 'HR', 'status' => 'active', 'fineCount' => 2, 'accidentCount' => 0, 'phone' => '+60123456785', 'email' => 'nurul@fleet.com', 'licenseExpiry' => Carbon::now()->addYears(4)]);

        // Bookings
        Booking::create(['vehicleId' => $v2->id, 'driverId' => $d2->id, 'purpose' => 'Site visit', 'destination' => 'Putrajaya', 'startDate' => Carbon::now(), 'endDate' => Carbon::now()->addDay(), 'status' => 'checked_in', 'odometerStart' => 22050, 'checkInAt' => Carbon::now()]);
        Booking::create(['vehicleId' => $v5->id, 'driverId' => $d2->id, 'purpose' => 'Official meeting', 'destination' => 'KLCC', 'startDate' => Carbon::now()->addDays(2), 'endDate' => Carbon::now()->addDays(2), 'status' => 'approved']);
        Booking::create(['vehicleId' => $v1->id, 'driverId' => $d1->id, 'purpose' => 'Equipment transport', 'destination' => 'Shah Alam', 'startDate' => Carbon::now()->subDays(3), 'endDate' => Carbon::now()->subDays(2), 'status' => 'completed', 'odometerStart' => 45100, 'odometerEnd' => 45230, 'checkInAt' => Carbon::now()->subDays(3), 'checkOutAt' => Carbon::now()->subDays(2)]);
        Booking::create(['vehicleId' => $v4->id, 'driverId' => $d4->id, 'purpose' => 'Field inspection', 'destination' => 'Klang', 'startDate' => Carbon::now()->addDay(), 'endDate' => Carbon::now()->addDay(), 'status' => 'pending']);

        // Maintenance
        Maintenance::create(['vehicleId' => $v3->id, 'type' => 'service', 'scheduledDate' => Carbon::now(), 'odometerAt' => 89400, 'nextServiceOdometer' => 99400, 'vendor' => 'Toyota Service Center', 'status' => 'in_progress', 'cost' => 1200]);
        Maintenance::create(['vehicleId' => $v1->id, 'type' => 'service', 'scheduledDate' => Carbon::now()->addDays(14), 'odometerAt' => 45230, 'nextServiceOdometer' => 55230, 'vendor' => 'Toyota Service Center', 'status' => 'scheduled']);
        Maintenance::create(['vehicleId' => $v2->id, 'type' => 'inspection', 'scheduledDate' => Carbon::now()->subDays(20), 'completedDate' => Carbon::now()->subDays(20), 'odometerAt' => 21500, 'vendor' => 'Honda Workshop', 'status' => 'completed', 'cost' => 450]);

        // Insurance
        InsurancePolicy::create(['vehicleId' => $v2->id, 'type' => 'insurance', 'policyNo' => 'POL-2024-001', 'provider' => 'Allianz', 'startDate' => Carbon::now()->subDays(360), 'expiryDate' => Carbon::now()->addDays(5), 'premium' => 2400]);
        InsurancePolicy::create(['vehicleId' => $v1->id, 'type' => 'insurance', 'policyNo' => 'POL-2024-002', 'provider' => 'AXA', 'startDate' => Carbon::now()->subDays(320), 'expiryDate' => Carbon::now()->addDays(45), 'premium' => 3200]);
        InsurancePolicy::create(['vehicleId' => $v4->id, 'type' => 'road_tax', 'policyNo' => 'RT-2024-003', 'provider' => 'JPJ', 'startDate' => Carbon::now()->subDays(337), 'expiryDate' => Carbon::now()->addDays(28), 'premium' => 480]);

        // Accidents
        Accident::create(['vehicleId' => $v3->id, 'driverId' => $d3->id, 'date' => Carbon::now()->subDays(30), 'location' => 'Federal Highway KM12', 'description' => 'Rear-ended at traffic light', 'claimStatus' => 'in_review', 'claimProgress' => 60, 'estimatedCost' => 8500]);
        Accident::create(['vehicleId' => $v4->id, 'driverId' => $d4->id, 'date' => Carbon::now()->subDays(90), 'location' => 'Subang Jaya', 'description' => 'Minor scratch on side panel', 'claimStatus' => 'completed', 'claimProgress' => 100, 'estimatedCost' => 1200]);

        // Fines
        Fine::create(['driverId' => $d1->id, 'vehicleId' => $v1->id, 'offence' => 'Speeding 20km/h over limit', 'amount' => 300, 'date' => Carbon::now()->subDays(15), 'status' => 'unpaid', 'ticketNo' => 'JPJ-2024-0001']);
        Fine::create(['driverId' => $d3->id, 'vehicleId' => $v3->id, 'offence' => 'Illegal parking', 'amount' => 100, 'date' => Carbon::now()->subDays(45), 'status' => 'paid', 'ticketNo' => 'DBKL-2024-0089']);

        // Disposals
        Disposal::create(['vehicleId' => $v6->id, 'reason' => 'End of useful life, high mileage', 'method' => 'auction', 'evaluationValue' => 25000, 'finalValue' => 27500, 'status' => 'executed', 'approvedBy' => 'John Director', 'executedAt' => Carbon::now()->subDays(10)]);

        // Activities
        Activity::create(['type' => 'booking', 'message' => 'New booking created for WCD 3456', 'user' => 'Lim Wei Sheng']);
        Activity::create(['type' => 'maintenance', 'message' => 'Maintenance started on WAB 9012', 'user' => 'System']);
        Activity::create(['type' => 'fine', 'message' => 'Traffic fine logged against Ahmad Faizal', 'user' => 'Admin']);
        Activity::create(['type' => 'insurance', 'message' => 'Insurance expiring soon: WXY 5678', 'user' => 'System']);
        Activity::create(['type' => 'disposal', 'message' => 'Vehicle WGH 1122 successfully disposed', 'user' => 'Admin']);
    }
}
