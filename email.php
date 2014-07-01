<?php
$blockText = $_POST['blockText'];
$blockEmail = $_POST['blockEmail'];
$blockTitle = $_POST['blockTitle'];
$to = $blockEmail;
$subject = $blockTitle;
$message = $blockText;
$from = "noreply@deborahkim.net";
$headers = "From: Justin Wolfe" . $from;
mail($to,$subject,$message,$headers);
echo "Mail Sent.";
$myFile = "backupText.txt";
$fh = fopen($myFile, 'a') or die("can't open file");
$stringSpace = "\r\n\r\n";
fwrite($fh, $stringSpace);
fwrite($fh, $blockTitle);
fwrite($fh, $stringSpace);
fwrite($fh, $blockText);
fclose($fh);
echo "File backup.";
?>