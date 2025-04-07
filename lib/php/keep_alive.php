<?php
// Start the session if needed
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Just respond OK regardless of session state
echo "OK";
?>
