<?php
   echo "<p>Page one ,  IP address is ".$_SERVER['REMOTE_ADDR'].'</p>';
    
   $html = <<<EOT
     <form id="myform" action="secondPage.php" method="post"> 
          <input type="submit" name="name" value="Go to next page" />  
    </form>
EOT;
   echo $html;
?>
