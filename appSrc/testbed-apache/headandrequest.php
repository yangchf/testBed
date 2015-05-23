<HTML><HEAD><TITLE>Welcome </TITLE>
<META http-equiv=Content-Type content="text/html; charset=UTF-8"></HEAD>
<BODY >
<TABLE style="PADDING-TOP: 3px;margin:12px 5% 12px 10%" cellSpacing=0 cellPadding=0 width=700 border=1>
  <tr >
         <td align=center colspan=2>Result Page </td>
  </tr> 
  <tr>
         <td align=center ><H3 color="blue">Header Name</b></H3><td align=center ><H3 color="blue">Header Value</H3></td>
  </tr>


<?php





  foreach ($_SERVER as $name => $value ) {
     if(substr($name,0,4)=="HTTP"||substr($name , 0, 6) =="SCRIPT" ){
       print("<tr><td align=center>".htmlentities($name)."</td>"."<td align=center>".htmlentities($value)."</td></tr>");        
     }

   }
  if(is_array($_COOKIE)&&count($_COOKIE)>0){
  print ('<tr><td align=center ><H3 color="blue">Cookie Name</b></H3><td align=center ><H3 color="blue">Cookie Value</H3></td></tr>');
  foreach ($_COOKIE as $name => $value ){
      print("<tr><td align=center>".htmlentities($name)."</td>"."<td align=center>".htmlentities($value)."</td></tr>");     

  }
  }
  if(is_array($_REQUEST)&&count($_REQUEST)>0){
  print ('<tr><td align=center ><H3 color="blue">equest Name</b></H3><td align=center ><H3 color="blue">Request Value</H3></td></tr>');
  foreach ($_REQUEST as $name => $value){
      print("<tr><td align=center>".htmlentities($name)."</td>"."<td align=center>".htmlentities($value)."</td></tr>");
  }
  }

   if(is_array($_POST)&&count($_POST)>0){
  print ('<tr><td align=center ><H3 color="blue">Post Request Name</b></H3><td align=center ><H3 color="blue">Post Request Value</H3></td></tr>');
  foreach ($_POST as $name => $value){
      print("<tr><td align=center>".htmlentities($name)."</td>"."<td align=center>".htmlentities($value)."</td></tr>"); 
  }
  }
   if(is_array($_GET)&&count($_GET)>0){
  print ('<tr><td align=center ><H3 color="blue">Get Request Name</b></H3><td align=center ><H3 color="blue">Get Request Value</H3></td></tr>');
  foreach ($_GET as $name => $value){
      print("<tr><td align=center>".htmlentities($name)."</td>"."<td align=center>".htmlentities($value)."</td></tr>");
  }
  }



?>
</TABLE>
</BODY>
</HTML>
