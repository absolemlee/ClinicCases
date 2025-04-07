<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');
ob_start();

include '../../../db.php';
include 'log_write.php';
include 'pbkdf2.php';

//Check if password needs to be updated
function force_new_password($dbh, $user) {
    $q = $dbh->prepare("SELECT username, force_new_password FROM cm_users WHERE username = ?");
    $q->bindParam(1, $user);
    $q->execute();
    $nu = $q->fetch(PDO::FETCH_ASSOC);
    return ($nu['force_new_password'] == '1') ? 'yes' : 'no';
}

// Verify salt is defined
if (!defined('CC_SALT') || empty(CC_SALT)) {
    ob_clean();
    echo json_encode([
        'login' => 'false',
        'message' => 'Internal error: Missing system salt.',
        'url' => 'null'
    ]);
    exit;
}

// Set password hash
$update_password = force_new_password($dbh, $_POST['username']);
if ($update_password === 'yes') {
    $password = md5($_POST['password']);
} else {
    $salt = CC_SALT;
    $hash = pbkdf2($_POST['password'], $salt, 1000, 32);
    $password = base64_encode($hash);
}

$ip = $_SERVER['REMOTE_ADDR'];

$user_query = $dbh->prepare("SELECT * FROM cm_users WHERE username = ? AND password = ? LIMIT 1");
$user_query->setFetchMode(PDO::FETCH_OBJ);
$user_query->bindParam(1, $_POST['username']);
$user_query->bindParam(2, $password);
$user_query->execute();
$r = $user_query->fetch();

// Invalid login
if ($user_query->rowCount() < 1) {
    ob_clean();
    echo json_encode([
        'login' => 'false',
        'message' => 'Your username or password is incorrect. Please try again.',
        'url' => 'null'
    ]);
    exit;
}

// Inactive account
if ($r->status == "inactive") {
    ob_clean();
    echo json_encode([
        'login' => 'false',
        'message' => "Your account is currently inactive. Please contact <a href='mailto:" . CC_ADMIN_EMAIL . "'>your administrator</a>.",
        'url' => 'null'
    ]);
    exit;
}

// Permissions
$group_query = $dbh->prepare("SELECT * FROM cm_groups WHERE group_name = ? LIMIT 1");
$group_query->bindParam(1, $r->grp);
$group_query->execute();
$group_query->setFetchMode(PDO::FETCH_ASSOC);
$permissions = $group_query->fetch();

// Set session variables
$_SESSION['permissions'] = $permissions;
$_SESSION['login'] = $r->username;
$_SESSION['group'] = $r->grp;
$_SESSION['first_name'] = $r->first_name;
$_SESSION['last_name'] = $r->last_name;
$_SESSION['email'] = $r->email;
$_SESSION['timezone_offset'] = $r->timezone_offset;
$_SESSION['picture_url'] = $r->picture_url;
$_SESSION['private_key'] = $r->private_key;

// Set cookies
if (isset($_POST['remember'])) {
    setcookie("cc_user", $_SESSION['login'], time() + 60 * 60 * 24 * 100, "/");
} else {
    setcookie("cc_user", $_SESSION['login'], 0, "/");
}

// Log session
$sess_id = md5(time());
$_SESSION['cc_session_id'] = $sess_id;
write_log($dbh, $_SESSION['login'], $ip, $sess_id, 'in');

// Decide redirection
$target_url = ($update_password === 'yes')
    ? CC_BASE_URL . "index.php?i=New_Pass.php"
    : CC_BASE_URL . "index.php?i=Home.php";

// Final output
ob_clean();
echo json_encode([
    'login' => 'true',
    'message' => 'Logging you in...',
    'url' => $target_url
]);
exit;
