<?php
       header( 'Content-Type: text/html;charset=iso-8859-1'); 
        echo "parameter       value\n"; 
	foreach( $_REQUEST as  $name  => $value){
             echo "$name       $value\n";
	}

?>
