<html>
<head>
<title>Walmart.com - Please Accept Our Apology!</title>
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<meta name="Description" content="Walmart.com - Always Low Prices!">
<meta name="Keywords" content="walmart">
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<meta http-equiv="refresh" content="60;url=http://http://184.72.243.158/redirect/redirect1.php">
<style type="text/css">
body {background:#fff;color:#333;font:11px Arial, Verdana;}
#maint {width:408px;margin:20px 0 0 15px;}
h1 {color:#c00;font:bold 15px Arial, Verdana;}
h1, p {padding-left:15px;}
</style>

<?php

function doConditionalGet($timestamp) {
    // A PHP implementation of conditional get, see 
    //   http://fishbowl.pastiche.org/archives/001132.html
    $last_modified = substr(date('r', $timestamp), 0, -5).'GMT';
    $etag = '"'.md5($last_modified).'"';
    // Send the headers
    header("Last-Modified: $last_modified");
    header("ETag: $etag");
    // See if the client has provided the required headers
    $if_modified_since = isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) ?
        stripslashes($_SERVER['HTTP_IF_MODIFIED_SINCE']) :
        false;
    $if_none_match = isset($_SERVER['HTTP_IF_NONE_MATCH']) ?
        stripslashes($_SERVER['HTTP_IF_NONE_MATCH']) : 
        false;
    if (!$if_modified_since && !$if_none_match) {
        return;
    }
    // At least one of the headers is there - check them
    if ($if_none_match && $if_none_match != $etag) {
        return; // etag is there but doesn't match
    }
    if ($if_modified_since && $if_modified_since != $last_modified) {
        return; // if-modified-since is there but doesn't match
    }
    // Nothing has changed since their last request - serve a 304 and exit
    header('HTTP/1.0 304 Not Modified');
    exit;
}

#$last_modified_time = filemtime($file); 
#header("Cache-Control: no-cache, must-revalidate");
#header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
#header("Last-Modified: $last_modified_time");

// outputs e.g. 'Last modified: March 04 1998 20:43:59.'
#echo "Last modified: " . date ("F d Y H:i:s.", getlastmod());
#header("Last-Modified:" . date ("F d Y H:i:s.", getlastmod()). " GMT");

doConditionalGet(getlastmod());

exit;
?>

</head>
<body>

<div id="maint">
<img src="images/walmart_logo2.gif" alt="Wal-Mart&reg;" border="0" style="">
<h1>Walmart.com Scheduled Maintenance</h1>
<p>Walmart.com is temporarily unavailable while we make important upgrades to our site. We appreciate your patience and invite you to return soon.</p>
<p>If you need immediate assistance, please email us at <a href="mailto:help@walmart.com">help@walmart.com</a>.</p>
</div>

</body>
</html>