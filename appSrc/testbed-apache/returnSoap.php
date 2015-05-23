<?php
header("Content-type: text/xml; charset=utf-8");
#header("Content-Type: text/plain");
$string='';


$string .= '<?xml version="1.0" encoding="utf-8" ?>';
$string .= '<response name="xml"><value msg="this is a xml format"/></response>';

/*$string .='<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
$string .='<SOAP:Header></SOAP:Header>';
$string .='<SOAP:Body>';
$string .='<SalesTax>4</SalesTax>';
$string .='</SOAP:Body>';
$string .='</SOAP:Envelope>';
*/
echo $string;
?>
