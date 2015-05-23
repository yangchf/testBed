<?php
    $err_no = 0;
    foreach( $_FILES as $fileID => $fileProfile){
      if($fileProfile["size"] < 1024 * 1000 * 10 ){
             if ($fileProfile["error"] != 0){
                 $err_no++; 
                 echo $fileID. " Return Code: " . $fileProfile["error"] . "<br />";
             }else {
                 echo "fileID: " . $fileID . "<br />";
                 echo "Upload: " . $fileProfile["name"] . "<br />";
                 echo "Type: " . $fileProfile["type"] . "<br />";
                 echo "Size: " . $fileProfile["size"]. "  (".($fileProfile["size"] / 1024) . " Kb)<br />";
                 if (file_exists("upload/" . $fileProfile["name"])){
                      if (!unlink("upload/" . $fileProfile["name"])){
                          exit("delete file failed"); 
                      }

                 }
                 if(move_uploaded_file($fileProfile["tmp_name"],"upload/" . $fileProfile["name"])){
                     echo "Stored in: " . "./upload/" . $fileProfile["name"]. "<br /><br /><br />";
                 }else {
                     $err_no++; 
                     echo "there is something wrong.<br />";
                 }
             }
      } else {
            $err_no++; 
            echo "the upload file ". $fileProfile["name"] ." is too big , please select the files less than 10M <br />"; 
      }
   }
   if($err_no == 0){
        echo " uploaded files successfully ! <br />";
   }else{
        echo " failed to upload files ! <br />";
   }
?>
