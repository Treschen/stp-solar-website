<?php
// STP Solar Contact Form Handler
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration
$to_email = "info@stpsolar.co.za"; // Replace with your actual email
$from_email = "noreply@stpsolar.co.za"; // Replace with your domain email
$subject_prefix = "STP Solar Quote Request";

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to send email
function send_email($to, $subject, $message, $from) {
    $headers = "From: " . $from . "\r\n";
    $headers .= "Reply-To: " . $from . "\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    return mail($to, $subject, $message, $headers);
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get and sanitize form data
        $name = sanitize_input($_POST['name'] ?? '');
        $email = sanitize_input($_POST['email'] ?? '');
        $phone = sanitize_input($_POST['phone'] ?? '');
        $location = sanitize_input($_POST['location'] ?? '');
        $monthly_bill = sanitize_input($_POST['monthly-bill'] ?? '');
        $message = sanitize_input($_POST['message'] ?? '');
        $system_config = sanitize_input($_POST['system-config'] ?? '');
        
        // Validation
        $errors = [];
        
        if (empty($name) || strlen($name) < 2) {
            $errors[] = "Name is required and must be at least 2 characters";
        }
        
        if (empty($email) || !validate_email($email)) {
            $errors[] = "Valid email address is required";
        }
        
        if (empty($phone) || strlen($phone) < 10) {
            $errors[] = "Valid phone number is required";
        }
        
        if (!empty($errors)) {
            echo json_encode([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $errors
            ]);
            exit;
        }
        
        // Create email content
        $email_subject = $subject_prefix . " - " . $name;
        
        $email_message = "
        <html>
        <head>
            <title>STP Solar Quote Request</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #f39c12; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #2c3e50; }
                .value { margin-left: 10px; }
                .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h2>🌞 STP Solar Quote Request</h2>
            </div>
            
            <div class='content'>
                <h3>Contact Information</h3>
                <div class='field'>
                    <span class='label'>Name:</span>
                    <span class='value'>" . htmlspecialchars($name) . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Email:</span>
                    <span class='value'>" . htmlspecialchars($email) . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Phone:</span>
                    <span class='value'>" . htmlspecialchars($phone) . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Location:</span>
                    <span class='value'>" . htmlspecialchars($location) . "</span>
                </div>
                
                <h3>Solar Requirements</h3>
                <div class='field'>
                    <span class='label'>Monthly Electricity Bill:</span>
                    <span class='value'>R " . htmlspecialchars($monthly_bill) . "</span>
                </div>
                
                <h3>Additional Information</h3>
                <div class='field'>
                    <span class='label'>Message:</span>
                    <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
                </div>";
        
        // Add system configuration if provided
        if (!empty($system_config)) {
            $system_data = json_decode($system_config, true);
            if ($system_data) {
                $email_message .= "
                <h3>🌞 Requested Solar System</h3>
                <div class='field'>
                    <span class='label'>System Name:</span>
                    <span class='value'><strong>" . htmlspecialchars($system_data['name']) . "</strong></span>
                </div>
                <div class='field'>
                    <span class='label'>Inverter:</span>
                    <span class='value'>" . htmlspecialchars($system_data['inverter']) . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Battery:</span>
                    <span class='value'>" . htmlspecialchars($system_data['battery']) . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Solar Panels:</span>
                    <span class='value'>" . htmlspecialchars($system_data['panel']) . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Installation:</span>
                    <span class='value'>" . htmlspecialchars($system_data['installation']) . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Total Price:</span>
                    <span class='value'><strong style='color: #f39c12; font-size: 18px;'>" . htmlspecialchars($system_data['totalPrice']) . "</strong></span>
                </div>
                <hr style='margin: 20px 0; border: 1px solid #eee;'>
                <p><strong>This customer has already configured their preferred system and is ready for a detailed quote!</strong></p>";
            }
        }
        
        $email_message .= "
                <h3>System Recommendations</h3>
                <p>Based on the provided information, this customer would benefit from:</p>
                <ul>
                    <li>JA Solar or Canadian Solar panels (Tier 1 quality)</li>
                    <li>Sigenstor or Sunsynk inverters</li>
                    <li>Tesla Powerwall 3 for backup power (if requested)</li>
                    <li>Professional installation and maintenance</li>
                </ul>
            </div>
            
            <div class='footer'>
                <p>This quote request was submitted from the STP Solar website on " . date('Y-m-d H:i:s') . "</p>
                <p>Please respond within 24 hours for best customer experience.</p>
            </div>
        </body>
        </html>";
        
        // Send email
        $email_sent = send_email($to_email, $email_subject, $email_message, $from_email);
        
        if ($email_sent) {
            // Log the submission (optional)
            $log_entry = date('Y-m-d H:i:s') . " - Quote request from: " . $name . " (" . $email . ")\n";
            file_put_contents('quote_requests.log', $log_entry, FILE_APPEND | LOCK_EX);
            
            echo json_encode([
                'success' => true,
                'message' => 'Thank you! We\'ll contact you within 24 hours with your free solar quote.'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Sorry, there was an error sending your request. Please try again or call us directly.'
            ]);
        }
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'An error occurred. Please try again later.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
}
?>
