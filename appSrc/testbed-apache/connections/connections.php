<!DOCTYPE html>
<html>
<head>
  <title>Test Parallel connections</title>
  <script type="text/javascript" src="jquery.js"></script>
  <script type="text/javascript">
    var counter = 0;
    var secsPerImage = 2.3;

    function finish() {
      $("#result").html("Your browser seems to use " + counter +
                               " simultaneous connections to this server.");
      $("img").hide().removeAttr("src");
    }

    $(document).ready(function() {
      for (var i = 0; i < 20; i++) {
        var img = document.createElement("img");
        var imgPath = "http://www.spasche.net/files/parallel_connections/slow_image.php?&skipcache=" + Math.random();
        img.setAttribute("src", imgPath);
        $(img).load(function() {
          counter++;
        });
        $("body").append(img);
      }
      setTimeout(finish, secsPerImage * 1.5 * 1000);
    });
  </script>
  <style type="text/css">
    img {
      border: medium dashed olive;
    }
    #result {
      margin: 1em;
      padding: 1em;
      border: thick solid navy;
      font-size: x-large;
      text-align: center;
    }
  </style>
</head>
<body>
<div id="result">
Loading, please wait...
</div>
</body>
</html>

