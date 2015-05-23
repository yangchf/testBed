<?php
    print "<p>".$_SERVER[REQUEST_URI]."</p>";
  foreach ($_SERVER as $name => $value ) {
        print "<p>".$name."=>".$value."</p>";

   }
   print_r($GLOBALS);
   print "<br>---------------------<br>";
   print_r($_COOKIE);
  foreach ($_COOKIE as $name => $value ){
     print "<p>".$name."=>".$value."</p>"; 
  }



?>
