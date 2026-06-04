<?php
declare(strict_types=1);

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit;
}

$contentType = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
$isMultipart = str_contains($contentType, 'multipart/form-data');

$data = [];
if ($isMultipart) {
    $data = $_POST;
} else {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true) ?: [];
}

$name = trim((string)($data['name'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$product = trim((string)($data['product'] ?? ''));
$message = trim((string)($data['message'] ?? ''));

if ($name === '' || $phone === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Name, phone, email, and message are required.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address.'
    ]);
    exit;
}

// Optional client artwork/reference upload so admin can align output with expectations.
$storedFile = null;
if (isset($_FILES['design_file']) && is_array($_FILES['design_file']) && ($_FILES['design_file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    $file = $_FILES['design_file'];
    $errorCode = (int)($file['error'] ?? UPLOAD_ERR_OK);
    if ($errorCode !== UPLOAD_ERR_OK) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'File upload failed. Please try again.'
        ]);
        exit;
    }

    $maxBytes = 10 * 1024 * 1024;
    $size = (int)($file['size'] ?? 0);
    if ($size <= 0 || $size > $maxBytes) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Uploaded file must be between 1 byte and 10MB.'
        ]);
        exit;
    }

    $originalName = (string)($file['name'] ?? 'upload');
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $allowed = ['pdf', 'ai', 'psd', 'png', 'jpg', 'jpeg', 'svg', 'zip', 'doc', 'docx'];
    if (!in_array($extension, $allowed, true)) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Unsupported file type.'
        ]);
        exit;
    }

    $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . 'uploads';
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0775, true) && !is_dir($uploadDir)) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Could not prepare upload directory.'
        ]);
        exit;
    }

    $safeName = preg_replace('/[^A-Za-z0-9._-]/', '_', basename($originalName)) ?: ('upload.' . $extension);
    $finalName = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '_' . $safeName;
    $targetPath = $uploadDir . DIRECTORY_SEPARATOR . $finalName;
    if (!move_uploaded_file((string)$file['tmp_name'], $targetPath)) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Could not store uploaded file.'
        ]);
        exit;
    }

    $storedFile = 'backend/uploads/' . $finalName;
}

$logPath = __DIR__ . DIRECTORY_SEPARATOR . 'quote_requests.jsonl';
$logEntry = [
    'submitted_at' => date('c'),
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'product' => $product,
    'message' => $message,
    'design_file' => $storedFile
];
@file_put_contents($logPath, json_encode($logEntry, JSON_UNESCAPED_SLASHES) . PHP_EOL, FILE_APPEND);

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => $storedFile
        ? 'Quote request received. Design file uploaded successfully.'
        : 'Quote request received successfully.',
    'design_file' => $storedFile
]);
