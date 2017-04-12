<?php
$path = $_SERVER['DOCUMENT_ROOT'];
$tmp = explode("/", $path);
array_pop($tmp);
$path_up = implode('/', $tmp);
echo $path_up."/core/builder.php";
if($_POST['build']) {
	exec("php ".$path_up."/core/builder.php -g 2>&1", $output);
}
?>
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>Build PL</title>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
</head>

<body>
<div class="row">
  <div class="col-sm-4"></div>
  <div class="col-sm-4 well">
    <h1 class="text-center">Build PatternLab</h1>
    <form method="post" action="" name="builder">
      <input type="hidden" name="build" value="1">
      <div class="col-xs-12 text-center">
        <input class="btn btn-lg btn-primary text-left" type="submit" value="Build">
        <a class="btn btn-lg btn-default text-left" href="http://<?php echo $_SERVER['SERVER_NAME']; ?>">View Site</a>
      </div>
      <div class="col-xs-12" style="margin-top:25px;">
        <p class="alert alert-info"> Build output: http://<?php echo $_SERVER['SERVER_NAME']; ?></p>
        <?php if ($output) {
			echo '<pre>Status: '.$output[0].'<br>'.$output[1].'<br>'.$output[2].'</pre>';
		}
		?>
      </div>
    </form>
  </div>
  <div class="col-sm-4"></div>
</div>
</body>
</html>