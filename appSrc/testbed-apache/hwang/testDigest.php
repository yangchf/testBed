<?php


$password = 'cccsb';
$timestamp=gmdate('Y-m-d\TH:i:s\Z');
$nonce=mt_rand();
echo "non:".$nonce."<br>";
$passdigest=base64_encode(pack('H*',sha1(pack('H*',$nonce).pack('a*',$timestamp).pack('a*',$password))));
$nonce=base64_encode(pack('H*',$nonce));
echo 'nonce:'.$nonce;
echo '<br>';
echo 'passdigest: '.$passdigest;
echo '<br>';
echo 'nonce : '.$nonce;
echo '<br>';
$nonce1 = md5(rand());
echo '111: '. $nonce1;
echo '<br>'.pack('a*',$timestamp);
echo '<br>'.pack('a*',$password);
echo '<br>'.pack('H*',$nonce).pack('a*',$timestamp).pack('a*',$password);



?>
