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
    case 'WateringSystems':
        $systems = [
            'fern' => [
                'device' => 'Sprinkler1',
                'command' => 'statusValve:0'
            ],
            'raisedFlower' => [
                'device' => 'Sprinkler2',
                'command' => 'statusValve:0'
            ],
        ];
        $data = [];
        foreach ($systems as $name=>$address) {
            $data[$name] = getWateringSystemData($rs, $address['device'], $address['command']);
        }
        echo json_encode($data);
        break;
    default:
        echo json_encode([]);
}

function getWateringSystemData($rs, $device, $command) {
    $data = $rs->command($device, $command);
    $res = ['status' => 'CLOSED'];
    if (preg_match('%(OPENED); (\d+)s left%', $data, $matches)) {
        $res = [
            'status' => $matches[1],
            'timeLeft' => $matches[2],
        ];
    }
    return $res;
}