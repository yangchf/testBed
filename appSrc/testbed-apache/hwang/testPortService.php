<?php

require_once("NuSoap/nusoap.php");
$username="gomez";
$password="gomez";

$client = new soapclientp('https://204.236.233.170/servlet/PortTestService?wsdl',true);
$client->soap_defencoding = 'utf-8';
$client->decode_utf8 = false;
$client->response_timeout = 900;
if(!is_object($client))
			return "not an object";
		$parameters=array(
				    'username' => $username,
				    'password' => $password,
//				    'host' => "www.gomez.com",
//				    'options' => ""
		);
$res= $client->call('standardSSHTestHelp',$parameters);
if ($err=$client->getError()) {
		    echo  "error is ".$client->getError();
}
		

	
echo '<p/>';
echo 'Request:';
echo '<pre>',htmlspecialchars($client->request,ENT_QUOTES),'</pre>';
//echo '<pre>',$client->request,'</pre>';
echo 'Response:';
echo '<pre>',htmlspecialchars($client->response,ENT_QUOTES ),'</pre>'; 




?>
