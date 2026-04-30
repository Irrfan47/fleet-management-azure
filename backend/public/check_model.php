<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

use App\Models\User;

$user = new User();
if (method_exists($user, 'createToken')) {
    echo "SUCCESS: createToken method exists on User model.";
} else {
    echo "FAILURE: createToken method is MISSING on User model!";
}
