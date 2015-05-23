<?php
  foreach ($_SERVER as $name => $value ) {
     if(substr($name,0,11)=="HTTP_COOKIE" ){
        print "<p>".$name."=>".$value."</p>";
     }

   }
  foreach ($_COOKIE as $name => $value ){
     print "<p>".$name."=>".$value."</p>"; 
  }



?>
