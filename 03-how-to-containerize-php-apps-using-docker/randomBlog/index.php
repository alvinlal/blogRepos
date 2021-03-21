<?php

	use Dotenv\Dotenv;

	include 'vendor/autoload.php';

	// load env variables to $_ENV superglobal
	$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
	$dotenv->load();

	$host = $_ENV['DB_HOST'];
	$user = $_ENV['DB_USER'];
	$password = $_ENV['DB_PASSWORD'];
	$dbname = $_ENV['DB_NAME'];

	// Create dsn - data source name
	$dsn = "mysql:host=$host;dbname=$dbname";

	// Create a pdo object
	$pdo = new PDO($dsn, $user, $password);

	// PDO query
	$stmt = $pdo->query('SELECT * FROM posts ORDER BY rand() limit 1');

	// fetch blog post as object
	$post = $stmt->fetch(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>randomBlog</title>
</head>

<body>
    <div style="margin:auto"></div>
    <h1><?=$post['title']?></h1>
    <p><?=$post['body']?></p>
</body>

</html>