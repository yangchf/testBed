function isRegisterUserName(s)
{
alert("hahah");
var patrn=/^\d+/;
if (!patrn.exec(s)) return false;
return true;
}

if (isRegisterUserName("10099aa") == true){

   document.write("it is true");

} else {
   document.write("it is false");
}

