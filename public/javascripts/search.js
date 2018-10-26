//查询数据库中对应的诗歌===================================================================================
function showpoem(str) {
	var xmlhttp;
	if(str == "") {
		document.getElementById("popForm").innerHTML = "";
		return;
	}
	if(window.XMLHttpRequest) {
		// IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp = new XMLHttpRequest();
	} else {
		// IE6, IE5 浏览器执行代码
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			
			var jsonObj = JSON.parse(xmlhttp.responseText)
			
			document.getElementById("popForm").innerHTML = "【诗名】"+jsonObj.data[0].poemname + '<br/>' 
			+"【朝代】" + jsonObj.data[0].dynasty+ '<br/>' 
			+"【诗人】"+jsonObj.data[0].poet + '<br/>'
			+"【内容】"+jsonObj.data[0].content;
			console.log(jsonObj.data[0].dynasty);
		}
	}
	xmlhttp.open("GET", "http://localhost:3000/select?id=" + str, true);
	xmlhttp.send();
}

