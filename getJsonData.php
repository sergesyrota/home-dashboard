<?php

ini_set('display_errors', 1);
if (empty($_GET['field'])) {
    echo json_encode([]);
    exit();
}

require_once('include/rs485.php');
$rs = new rs485;

switch ($_GET['field']) {
    case 'SumpPit':
        echo json_encode(['waterDepth' => (int)$rs->command('SumpPump', 'getDistance'), 'unit' => 'cm']);
        break;
    case 'WaterMeterGal':
        echo json_encode(['totalGallons' => ($rs->command('WtrMn', 'getCount') * 0.00528344), 'unit' => 'gal']);
        break;
    case 'HouseTemps':
        parse_str($rs->command('Bench', 'getSens1'), $leah);
        parse_str($rs->command('Bench', 'getSens2'), $parents);
        echo json_encode(['leah' => $leah, 'parents' => $parents]);
        break;
    default:
        echo json_encode([]);
}