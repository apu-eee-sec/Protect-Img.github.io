<?php
session_start();

// Check if the user is logged in or has permission to view the image
// This is a simple example; you should implement proper authentication
if (!isset($_SESSION['user_authenticated']) || $_SESSION['user_authenticated'] !== true) {
    header("HTTP/1.0 403 Forbidden");
    exit;
}

// Define the path to your images directory (outside web root)
$imagesDir = '/path/to/protected/images/';

// Get the requested image filename from the query string
$filename = isset($_GET['file']) ? $_GET['file'] : '';

// Validate the filename to prevent directory traversal attacks
$filename = basename($filename);

// Define allowed image extensions
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

// Get the file extension
$extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

// Check if the extension is allowed
if (!in_array($extension, $allowedExtensions)) {
    header("HTTP/1.0 403 Forbidden");
    exit;
}

// Set the full path to the image file
$filepath = $imagesDir . $filename;

// Check if the file exists
if (!file_exists($filepath)) {
    header("HTTP/1.0 404 Not Found");
    exit;
}

// Set the appropriate content type header
$contentType = 'image/jpeg';
if ($extension === 'png') {
    $contentType = 'image/png';
} elseif ($extension === 'gif') {
    $contentType = 'image/gif';
}

header("Content-Type: $contentType");

// Output the image file
readfile($filepath);
