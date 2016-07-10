<?php
if (!in_array($_SERVER['QUERY_STRING'], ['up', 'down'])) {
    die('Incorrect rating: ' . $_SERVER['QUERY_STRING']);
} else {
    $answer = $_SERVER['QUERY_STRING'];
}
require_once('/home/sergey/internet-trouble/wifi/include.php');
$db = MyDb::getInstance();
$db->query("INSERT INTO rating (time, value) VALUES (NOW(), '$answer')");
echo "done";