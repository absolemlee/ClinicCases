<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Mostrar el ID de sesión y su contenido para depuración
header("Content-Type: text/plain");

echo "Session ID: " . session_id() . "\n";
echo "Session data:\n";
print_r($_SESSION);
