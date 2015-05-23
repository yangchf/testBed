<html>
<head>
<script type="text/javascript">
function getCookie(c_name)
{
    return unescape(document.cookie.substring(0,document.cookie.length));
}

function setCookie(c_name,value,expiredays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate()+expiredays);
document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : "; expires="+exdate.toGMTString());
}

function checkCookie()
{
alert(document.cookie);
setCookie('username',"bbbbb",365);
}
</script>
</head>
<body onLoad="checkCookie()">



<?php
    print "<p>".$_SERVER[REQUEST_URI]."</p>";
  foreach ($_SERVER as $name => $value ) {
        print "<p>".$name."=>".$value."</p>";

   }
   print "<br>---------------------<br>";
   print_r($_COOKIE);
  foreach ($_COOKIE as $name => $value ){
     print "<p>".$name."=>".$value."</p>"; 
  }



?>
</body>
</html>
