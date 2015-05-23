<HTML><HEAD><TITLE>Objects </TITLE>
<META http-equiv=Content-Type content="text/html; charset=UTF-8"></HEAD>

<BODY >

<?php

$randomnum = 0;
$times =0;
$count = $_REQUEST['count'];
echo '<p>count='.$count.'</p>';
if (isset($count) ){
    $times = $count ;
} else {
    $times = 50 ;
}
while( $i < $times){
    $randomnum = rand(1,500000);
    print("<img src=\"./sample.jpg?num=" . $randomnum . "\">");
    $i+=1;
}



?>
</BODY></HTML>

