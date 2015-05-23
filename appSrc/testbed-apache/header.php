<?php
    print "<p>".$_SERVER[REQUEST_URI]."</p>";
  foreach ($_SERVER as $name => $value ) {
     if(substr($name,0,4)=="HTTP"||substr($name , 0, 6) =="SCRIPT" ){
        print "<p>".$name."=>".$value."</p>";
     }

   }
  foreach ($_COOKIE as $name => $value ){
     print "<p> ".$name."=>".$value."</p>"; 
  }



?>
