<?php
header("Content-Type: text/plain");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

echo "Session ID: " . session_id() . "\n";
echo "Cookies:\n";
print_r($_COOKIE);

echo "Session:\n";
print_r($_SESSION);

if (!isset($_SESSION['cc_session_id'])) {
    header("HTTP/1.0 401 Not Authorized");
    echo "\ncc_session_id not set.\n";
} else {
    echo "OK\n";
}
