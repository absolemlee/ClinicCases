<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['cc_session_id'])) {
    header("HTTP/1.0 401 Not Authorized");
} else {
    echo "OK";
}
