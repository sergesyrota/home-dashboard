<?php

ini_set('display_errors', 1);

define('STATUS_OK', 0);
define('STATUS_ERROR', 1);

if (empty($_GET['action'])) {
    echo json_encode(['status' => STATUS_ERROR, 'error' => 'Action not specified']);
    exit();
}

require_once('include/rs485.php');
$rs = new rs485;

switch ($_GET['action']) {
    case 'CloseWaterMain':
        sendCommand($rs, 'WtrMn', 'valveClose');
        break;
    case 'OpenWaterMain':
        sendCommand($rs, 'WtrMn', 'valveOpen');
        break;
    case 'rawCommand':
        sendCommand($rs, $_GET['device'], $_GET['command']);
        break;
    default:
        echo json_encode(['status' => STATUS_ERROR, 'error' => 'Action not recognized']);
}

function sendCommand($rs485, $address, $command) {
    try {
        $res = $rs485->command($address, $command);
        if ($res != 'OK') {
            // Exception to be caught few lines below
            throw new Exception($res);
        }
        echo json_encode(['status' => STATUS_OK]);
    } catch (Exception $e) {
        echo json_encode(['status' => STATUS_ERROR, 'error' => 'Command error: ' . $e->getMessage()]);
        die();
    }
}