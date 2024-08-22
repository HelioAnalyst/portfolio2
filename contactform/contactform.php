<?php
// Include PHPMailer classes into the global namespace
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader (make sure you have installed PHPMailer via Composer)
require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get form data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Validation
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format."]);
        exit;
    }

    // Sanitize inputs
    $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();                                      // Send using SMTP
        $mail->Host       = 'smtp.ionos.co.uk';               // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                             // Enable SMTP authentication
        $mail->Username   = 'contact@heliotheanalyst.co.uk';  // SMTP username
        $mail->Password   = '15O*$xzHXXGHuYO#Lv7I9b3q7tLRL0';            // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;      // Enable SSL encryption
        $mail->Port       = 465;                              // TCP port to connect to

        //Recipients
        $mail->setFrom('contact@heliotheanalyst.co.uk', 'Mailer');
        $mail->addAddress('heliotheanalyst@gmail.com');       // Add a recipient

        // Content
        $mail->isHTML(false);                                 // Set email format to plain text
        $mail->Subject = 'Contact Form: ' . $subject;
        $mail->Body    = "Name: $name\n";
        $mail->Body   .= "Email: $email\n";
        $mail->Body   .= "Subject: $subject\n\n";
        $mail->Body   .= "Message:\n$message\n";

        // Send the email
        $mail->send();
        echo json_encode(["status" => "success", "message" => "Mail Sent. Thank you $name, we will contact you shortly."]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Error: Unable to send email. Mailer Error: {$mail->ErrorInfo}"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Error: Invalid request method."]);
}
