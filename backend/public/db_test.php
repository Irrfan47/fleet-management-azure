<?php
$host = '127.0.0.1';
$db   = 'fleet_management';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    echo "SUCCESS: Database connection established!";
} catch (PDOException $e) {
    echo "FAILURE: " . $e->getMessage();
}
