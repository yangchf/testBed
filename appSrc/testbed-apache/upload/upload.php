<html>
<body>
<?php
    if(!isset($_REQUEST['count']) ){
        $count = 1;
    }else {
        $count = $_REQUEST['count'];
    }
    if(!is_numeric($count)){
        exit( 'please set the parameter "count" as number.'); 
    }else if ($count <=0 || $count >20 ){
        exit('please set the parameter "count" between 1 and 20.'); 
    }
?>
<form action="process_upload_file.php" method="post" enctype="multipart/form-data">
<?php
      for($index = 1; $index <= $count; $index++){
         echo '<label for="uploadFile'.$index.'">uploadFile'.$index.':</label><input name="uploadFile'.$index.'" type="file" id="uploadFileId'.$index.'"><br/>';    
        }
?> 
<br />
<input type="submit" name="submit" value="Submit" />
</form>

</body>
</html>
