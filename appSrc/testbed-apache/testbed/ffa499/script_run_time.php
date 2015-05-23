<head>
</head>

<body>
	<script  type="text/javascript">


	function jsleep(s){
		s=s*1000;
		var a=true;
		var n=new Date();
		var w;
		var sMS=n.getTime();
		while(a){
			w=new Date();
			wMS=w.getTime();
			if(wMS-sMS>s) a=false;
		}
	}
	// how to use
	function callSleep(s){
		jsleep(s);
		var imgEle = document.createElement("img");
		imgEle.setAttribute('src','./Sunset.jpg');
		document.body.appendChild(imgEle);
	}
<?php
 if(!isset($_REQUEST['second']) || !is_numeric($_REQUEST['second'])){
        $second = 20;
    }else {
        $second = $_REQUEST['second'];
    }
	
	echo 'callSleep('.$second.');';
?>

	</script>

</body>
