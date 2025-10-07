<?php
// webhook-proxy.php - Proxy to handle CORS for N8N webhook
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the JSON data from the request
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Log the request for debugging
error_log('Webhook proxy received: ' . $input);

// Forward to N8N webhook
$webhook_url = 'https://n8n01.stpsolar.co.za/webhook/solar-quote';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $webhook_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($input)
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

if ($curl_error) {
    error_log('CURL Error: ' . $curl_error);
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to webhook', 'details' => $curl_error]);
    exit();
}

if ($http_code >= 200 && $http_code < 300) {
    // Success
    echo $response ?: json_encode(['success' => true, 'message' => 'Quote request sent successfully']);
} else {
    // Error
    error_log('Webhook returned HTTP ' . $http_code . ': ' . $response);
    http_response_code($http_code);
    echo $response ?: json_encode(['error' => 'Webhook request failed', 'code' => $http_code]);
}
?>
