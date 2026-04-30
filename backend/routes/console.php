<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Flowchart 2.3: Daily check for insurance and road tax expiries
Schedule::command('fleet:check-expiries')->dailyAt('08:00');
