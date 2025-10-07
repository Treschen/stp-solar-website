<?php
/**
 * STP Solar Admin Authentication
 * Server-side authentication for admin portal
 */

session_start();

// Admin credentials (in production, store these in environment variables or database)
$ADMIN_CREDENTIALS = [
    'username' => 'stpadmin',
    'password' => 'Solar2024!'
];

// Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

// Login function
function login($username, $password) {
    global $ADMIN_CREDENTIALS;
    
    if ($username === $ADMIN_CREDENTIALS['username'] && $password === $ADMIN_CREDENTIALS['password']) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        $_SESSION['login_time'] = time();
        return true;
    }
    return false;
}

// Logout function
function logout() {
    session_destroy();
    session_start();
}

// Check session timeout (30 minutes)
function checkSessionTimeout() {
    if (isset($_SESSION['login_time'])) {
        $timeout = 30 * 60; // 30 minutes
        if (time() - $_SESSION['login_time'] > $timeout) {
            logout();
            return false;
        }
    }
    return true;
}

// Handle login request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    
    if ($_POST['action'] === 'login') {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        
        if (login($username, $password)) {
            echo json_encode(['success' => true, 'message' => 'Login successful']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
        exit;
    }
    
    if ($_POST['action'] === 'logout') {
        logout();
        echo json_encode(['success' => true, 'message' => 'Logged out']);
        exit;
    }
    
    if ($_POST['action'] === 'check') {
        if (isLoggedIn() && checkSessionTimeout()) {
            echo json_encode(['success' => true, 'logged_in' => true]);
        } else {
            echo json_encode(['success' => true, 'logged_in' => false]);
        }
        exit;
    }
}

// Redirect to login if not authenticated
if (!isLoggedIn() || !checkSessionTimeout()) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['ajax'])) {
        // Redirect to login page or show login form
        http_response_code(401);
        include 'admin-login.html';
        exit;
    }
}
?>
