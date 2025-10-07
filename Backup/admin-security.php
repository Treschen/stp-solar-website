<?php
/**
 * STP Solar Admin Security Configuration
 * Additional security measures for admin portal
 */

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Rate limiting (simple implementation)
function checkRateLimit($ip) {
    $rateLimitFile = 'admin_rate_limit.json';
    $maxAttempts = 5;
    $timeWindow = 300; // 5 minutes
    
    $rateLimitData = [];
    if (file_exists($rateLimitFile)) {
        $rateLimitData = json_decode(file_get_contents($rateLimitFile), true) ?: [];
    }
    
    $currentTime = time();
    $ipData = $rateLimitData[$ip] ?? ['attempts' => 0, 'last_attempt' => 0];
    
    // Reset attempts if time window has passed
    if ($currentTime - $ipData['last_attempt'] > $timeWindow) {
        $ipData['attempts'] = 0;
    }
    
    // Check if rate limit exceeded
    if ($ipData['attempts'] >= $maxAttempts) {
        return false;
    }
    
    // Update rate limit data
    $ipData['attempts']++;
    $ipData['last_attempt'] = $currentTime;
    $rateLimitData[$ip] = $ipData;
    
    file_put_contents($rateLimitFile, json_encode($rateLimitData));
    return true;
}

// IP whitelist (optional - uncomment to enable)
function isIPWhitelisted($ip) {
    $whitelist = [
        '127.0.0.1',
        '::1',
        // Add your office/home IP addresses here
        // '192.168.1.100',
        // '203.0.113.0/24',
    ];
    
    foreach ($whitelist as $allowedIP) {
        if (strpos($allowedIP, '/') !== false) {
            // CIDR notation support
            if (ipInRange($ip, $allowedIP)) {
                return true;
            }
        } else {
            if ($ip === $allowedIP) {
                return true;
            }
        }
    }
    
    return false;
}

// Check if IP is in CIDR range
function ipInRange($ip, $range) {
    list($subnet, $bits) = explode('/', $range);
    $ip = ip2long($ip);
    $subnet = ip2long($subnet);
    $mask = -1 << (32 - $bits);
    $subnet &= $mask;
    return ($ip & $mask) == $subnet;
}

// Get client IP address
function getClientIP() {
    $ipKeys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    foreach ($ipKeys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

// Log admin activities
function logAdminActivity($action, $details = '') {
    $logFile = 'admin_activity.log';
    $timestamp = date('Y-m-d H:i:s');
    $ip = getClientIP();
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    $username = $_SESSION['admin_username'] ?? 'Unknown';
    
    $logEntry = "[$timestamp] IP: $ip | User: $username | Action: $action | Details: $details | UA: $userAgent\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Clean old log files (run periodically)
function cleanOldLogs() {
    $logFiles = ['admin_activity.log', 'admin_rate_limit.json'];
    $maxAge = 30 * 24 * 60 * 60; // 30 days
    
    foreach ($logFiles as $file) {
        if (file_exists($file) && (time() - filemtime($file)) > $maxAge) {
            unlink($file);
        }
    }
}

// Initialize security
$clientIP = getClientIP();

// Check rate limiting
if (!checkRateLimit($clientIP)) {
    http_response_code(429);
    die('Too many login attempts. Please try again later.');
}

// IP whitelist check (uncomment to enable)
// if (!isIPWhitelisted($clientIP)) {
//     http_response_code(403);
//     die('Access denied from this IP address.');
// }

// Clean old logs (run occasionally)
if (rand(1, 100) === 1) {
    cleanOldLogs();
}
?>
