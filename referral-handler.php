<?php
// STP Solar Referral Form Handler
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration
$to_email = "info@stpsolar.co.za"; // Replace with your actual email
$from_email = "noreply@stpsolar.co.za"; // Replace with your domain email
$subject_prefix = "STP Solar Referral Request";

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
        // Extract form data
        $referrer_name = sanitize_input($_POST['referrer-name'] ?? '');
        $referrer_email = sanitize_input($_POST['referrer-email'] ?? '');
        $referrer_phone = sanitize_input($_POST['referrer-phone'] ?? '');
        $referrer_relationship = sanitize_input($_POST['referrer-relationship'] ?? '');
        $referred_name = sanitize_input($_POST['referred-name'] ?? '');
        $referred_email = sanitize_input($_POST['referred-email'] ?? '');
        $referred_phone = sanitize_input($_POST['referred-phone'] ?? '');
        $referred_location = sanitize_input($_POST['referred-location'] ?? '');
        $referral_notes = sanitize_input($_POST['referral-notes'] ?? '');
        $terms_agreement = isset($_POST['terms-agreement']) ? 'Yes' : 'No';
        
        // Validation
        $errors = [];
        
        if (empty($referrer_name) || strlen($referrer_name) < 2) {
            $errors[] = "Referrer name is required and must be at least 2 characters";
        }
        
        if (empty($referrer_email) || !validate_email($referrer_email)) {
            $errors[] = "Valid referrer email address is required";
        }
        
        if (empty($referrer_phone) || strlen($referrer_phone) < 10) {
            $errors[] = "Valid referrer phone number is required";
        }
        
        if (empty($referrer_relationship)) {
            $errors[] = "Relationship to referred person is required";
        }
        
        if (empty($referred_name) || strlen($referred_name) < 2) {
            $errors[] = "Referred person's name is required and must be at least 2 characters";
        }
        
        if (empty($referred_email) || !validate_email($referred_email)) {
            $errors[] = "Valid referred person's email address is required";
        }
        
        if (empty($referred_phone) || strlen($referred_phone) < 10) {
            $errors[] = "Valid referred person's phone number is required";
        }
        
        if (empty($referred_location) || strlen($referred_location) < 2) {
            $errors[] = "Referred person's location is required";
        }
        
        if (!isset($_POST['terms-agreement'])) {
            $errors[] = "You must agree to the terms and conditions";
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
        $email_subject = $subject_prefix . " - " . $referrer_name . " refers " . $referred_name;
        
        $email_message = "
        <html>
        <head>
            <title>STP Solar Referral Request</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: #f39c12; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #2c3e50; }
                .value { margin-left: 10px; }
                .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
                .referral-info { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; }
                .referrer-info { background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h2>🤝 STP Solar Referral Request</h2>
            </div>
            
            <div class='content'>
                <div class='referrer-info'>
                    <h3>Referrer Information</h3>
                    <div class='field'>
                        <span class='label'>Name:</span>
                        <span class='value'>" . htmlspecialchars($referrer_name) . "</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Email:</span>
                        <span class='value'>" . htmlspecialchars($referrer_email) . "</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Phone:</span>
                        <span class='value'>" . htmlspecialchars($referrer_phone) . "</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Relationship:</span>
                        <span class='value'>" . htmlspecialchars($referrer_relationship) . "</span>
                    </div>
                </div>
                
                <div class='referral-info'>
                    <h3>Referred Person Information</h3>
                    <div class='field'>
                        <span class='label'>Name:</span>
                        <span class='value'>" . htmlspecialchars($referred_name) . "</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Email:</span>
                        <span class='value'>" . htmlspecialchars($referred_email) . "</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Phone:</span>
                        <span class='value'>" . htmlspecialchars($referred_phone) . "</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Location:</span>
                        <span class='value'>" . htmlspecialchars($referred_location) . "</span>
                    </div>
                </div>
                
                <h3>Additional Information</h3>
                <div class='field'>
                    <span class='label'>Notes:</span>
                    <div class='value'>" . nl2br(htmlspecialchars($referral_notes)) . "</div>
                </div>
                
                <div class='field'>
                    <span class='label'>Terms Agreement:</span>
                    <span class='value'>" . htmlspecialchars($terms_agreement) . "</span>
                </div>
                
                <hr style='margin: 20px 0; border: 1px solid #eee;'>
                
                <h3>Referral Fee Structure</h3>
                <p>Based on the system value, the referrer is entitled to:</p>
                <ul>
                    <li><strong>R30,000 - R80,000:</strong> R500 referral fee</li>
                    <li><strong>R80,001 - R150,000:</strong> R1,000 referral fee</li>
                    <li><strong>R150,001 - R250,000:</strong> R1,500 referral fee</li>
                    <li><strong>R250,001 - R500,000:</strong> R2,500 referral fee</li>
                    <li><strong>Above R500,000:</strong> R5,000 referral fee</li>
                </ul>
                
                <div style='background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;'>
                    <p><strong>Next Steps:</strong></p>
                    <ol>
                        <li>Contact the referred person to schedule a consultation</li>
                        <li>Ensure they mention " . htmlspecialchars($referrer_name) . " as their referrer</li>
                        <li>Process the referral fee within 30 days of installation completion</li>
                    </ol>
                </div>
            </div>
            
            <div class='footer'>
                <p>This referral request was submitted from the STP Solar website on " . date('Y-m-d H:i:s') . "</p>
                <p>Please contact the referred person within 24 hours for best customer experience.</p>
            </div>
        </body>
        </html>";
        
        // Send email
        $email_sent = send_email($to_email, $email_subject, $email_message, $from_email);
        
        if ($email_sent) {
            // Log the submission (optional)
            $log_entry = date('Y-m-d H:i:s') . " - Referral request from: " . $referrer_name . " (" . $referrer_email . ") referring: " . $referred_name . " (" . $referred_email . ")\n";
            file_put_contents('referral_requests.log', $log_entry, FILE_APPEND | LOCK_EX);
            
            echo json_encode([
                'success' => true,
                'message' => 'Thank you! Your referral has been submitted successfully. We\'ll contact both you and the referred person within 24 hours.'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Sorry, there was an error sending your referral request. Please try again or call us directly.'
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
