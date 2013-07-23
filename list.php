<?php

// Read the json data from local storage
$string = file_get_contents("data-list.json");
// Decode the json data to be object that could be used here
$jsonData = json_decode($string, true);
$result = array();
$log = '';

// filter the $data compare with $obj
function filter($data, $obj) {
    function createFilterFunc($obj) {
        // Use it in this way to pass the $obj into this function
        // $data: {taskId: 1}, $obj: {taskId: 1}, then {taskId:1} in $obj
        // will be filt out.
        return function ($element) use ($obj) {
            $flag = true;
            foreach ($element as $key => $value) {
                foreach ($obj as $subKey => $subValue) {
                    if ($subKey == $key && $subValue != $value) {
                        $flag = false;
                        break;
                    }
                }
                if (!$flag) break;
            }
            return $flag;
        };
    }

    // array_filter is supported in php, the $data will be foreach and then
    // processed in the second parameter.
    return array_filter($data, createFilterFunc($obj));
}

$request_method = strtoupper($_SERVER['REQUEST_METHOD']);
if ($request_method == 'GET') {
    // Get the request url from client side
    $requestData = $_GET;
    // the keys of request object may different from the json data, so here use map
    // to defined them
    $map = $jsonData["map"];
    foreach ($requestData as $key => $value) {
        foreach ($map as $mapKey => $mapValue) {
            if ($mapKey == $key) {
                $log = $log.'['.$mapKey.'-->'.$value.']';
                $requestData[$mapValue] = $value;
            }
        }
    }

    $result = filter($jsonData["result"], $requestData);
} else if ($request_method == 'POST') {

}

$jsonData["result"] = $result;
//$responseStr['data'] = $result;
if ($log != '') $jsonData['log'] = $log;

// resposne the json format data
header('Content-Type: application/json');
echo json_encode($jsonData);

?>
