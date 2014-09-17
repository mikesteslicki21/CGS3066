<!DOCTYPE html>
<html>
	<head>
		<title>CGS3066: Project 4 - Form processing: Results</title>
	</head>
	<body>
		<h1>hey it's a form - RESULTS</h1>
<?php

// Capture all the variables from the POST data.
$movieTitle = $_POST['title'];
$movieURL = $_POST['url'];
$movieGenres = $_POST['genres'];
$starRating = $_POST['starRating'];
$detailedReview = $_POST['detailedReview'];

// If you want, uncomment this: dump out the given data
//var_dump($_POST);


// Trim the strings - i.e. remove spaces at the beginning & ending.
$movieTitle = trim($movieTitle);
$movieURL = trim($movieURL);
$detailedReview = trim($detailedReview);

// Convert the star rating from a string to a number.
$starRating = intval($starRating);

// If you want, uncomment this: dump out the sanitized data (should probably see this)
//var_dump($movieTitle);
//var_dump($movieURL);
//var_dump($movieGenres);
//var_dump($starRating);
//var_dump($detailedReview);


// Keep track of whether any fields are invalid.
$aFieldIsInvalid = false;

// Check if the movie title is invalid.
if ((strlen($movieTitle) == 0) || (strlen($movieTitle) > 50))
{
	print("<p><b>Title is invalid.</b> Please go back and try again.</p>\n");
	$aFieldIsInvalid = true;
}
// Else echo it back.
else
{
	print("<p><b>Title</b>: ".$movieTitle."</p>\n");
}

// Check if the movie URL is invalid.
if ((strlen($movieURL) == 0)
        || (strlen($movieURL) > 100)
        || (strpos($movieURL, 'imdb') === false))
{
	print("<p><b>URL is invalid.</b> Please go back and try again.</p>\n");
	$aFieldIsInvalid = true;
}
// Else echo it back.
else
{
	print("<p><b>URL</b>: ".$movieURL."</p>\n");
}

// Check if the star rating is invalid.
if (($starRating < 1) || ($starRating > 5))
{
	print("<p>Star rating is invalid.</b> Please go back and try not to hack this form.</p>\n");
	$aFieldIsInvalid = true;
}
// Else echo it back.
else
{
	print("<p><b>Star rating</b>: ".$starRating." Stars.</p>\n");
}

// Output the list of genres, which cannot be incorrect.
// Simply do something different if there are no genres selected.
if (empty($movieGenres))
{
	print("<p><b>Genres</b>: (none)</p>\n");
}
else
{
	print("<p><b>Genres</b>: ".implode(', ', $movieGenres)."</p>\n");
}
// (Or replace this whole structure with this one line)
//	print("<p><b>Genres</b>: ".((empty($movieGenres))?('(none)'):(implode(', ', $movieGenres)))."</p>\n");

// Check if the detailed review is invalid.
if (strlen($detailedReview) == 0)     // also, look up 'php empty'
{
	print("<p><b>Detailed review is invalid.</b> Please go back and try again.</p>\n");
	$aFieldIsInvalid = true;
}
// Else - success!
else
{
	print("<p><b>Detailed review</b>:</p>\n");
	print("<p>".$detailedReview."</p>");
}

// Check if any fields were invalid, in order to print the overall success/failure message.
if ($aFieldIsInavlid)
{
	print("<p><b>OVERALL</b>: Success!</p>\n");
}
else
{
	print("<p><b>OVERALL</b>: Not success!</p>\n");
}

?>
	</body>
</html>