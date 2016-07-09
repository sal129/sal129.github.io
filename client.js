var xhr = new XMLHttpRequest();
	var init;
	var stopped1 = 1;
	var stopped2 = 1;
	var stopped3 = 1;
	var stopped4 = 1;
	var admin = 0;
	var currenttimeout;
	var running = 1;
	function animate1() {$("#message span").eq(0 + admin).animate({left: -$("#message span").eq(0 + admin).width() * 1.1}, 10000, function() {$("#message span").eq(0 + admin).css("left", 0); if(!stopped1){animate1();}});}
	function animate2() {$("#message span").eq(1 + admin).animate({left: -$("#message span").eq(1 + admin).width() * 1.1}, 10000, function() {$("#message span").eq(1 + admin).css("left", 0); if(!stopped2){animate2();}});}
	function animate3() {$("#message span").eq(2 + admin).animate({left: -$("#message span").eq(2 + admin).width() * 1.1}, 10000, function() {$("#message span").eq(2 + admin).css("left", 0); if(!stopped3){animate3();}});}
	function animate0() {$("#message span").eq(0).animate({left: -$("#message span").eq(0).width() * 1.1}, 15000)}
	function animateh() {$("#notice div").animate({left: -$("#notice div").width() * 1.8}, 10000, function() {$("#notice div").css("left", 0); animateh();});}
	function stop1() {$("#message span").eq(0 + admin).stop(); stopped1 = 1; $("#message span").eq(0).css("left", 0);}
	function stop2() {$("#message span").eq(1 + admin).stop(); stopped2 = 1; $("#message span").eq(1).css("left", 0);}
	function stop3() {$("#message span").eq(2 + admin).stop(); stopped3 = 1; $("#message span").eq(2).css("left", 0);}
	function stop4() {$("#message span").eq(3 + admin).stop(); stopped4 = 1; $("#message span").eq(3).css("left", 0);}
	xhr.onreadystatechange = function(event){
		if (xhr.readyState == 4){
			init = JSON.parse(xhr.responseText);
			console.log(typeof(init));
			console.log(init);
			$("#message1 span").html(init[2].content);
			$("#message2 span").html(init[1].content);
			$("#message3 span").html(init[0].content);
			if ($("#message span").eq(0).width() > $("#message1 p").width()){
				stopped1 = 0;
				animate1();
			}
			if ($("#message span").eq(1).width() > $("#message2 p").width()){
				stopped2 = 0;
				animate2();
			}
			if ($("#message span").eq(2).width() > $("#message3 p").width()){
				stopped3 = 0;
				animate3();
			}
			$("#message1 div p").html(init[2].nickname);
			$("#message2 div p").html(init[1].nickname);
			$("#message3 div p").html(init[0].nickname);
			$("#message1 img").attr("src", init[2].headimgurl);
			$("#message2 img").attr("src", init[1].headimgurl);
			$("#message3 img").attr("src", init[0].headimgurl);
		}
	}
	xhr.open("GET", "https://wall.cgcgbcbc.com/api/messages?num=3", true);
	xhr.send(null);
	var socket = io.connect('https://wall.cgcgbcbc.com');
	function pushmessage() {
		var newMsg = $('<div id="message4"></div>');
		newMsg.append($('<img src="' + "./loading.gif" +'" alt="">'));
		newMsg.append($('<p class="marquee"><span>' + arguments[0].content +'</span></p>'));
		newMsg.append($('<div><p>' + arguments[0].nickname +'</p></div>'));
		$("#message").append(newMsg);
		$("#message4 img").attr("src", arguments[0].headimgurl);
		$("#message").animate({opacity: 0}, 0.01);
		stop1();
		stop2();
		stop3();
		stop4();		
		$("#message1").remove();
		$("#message2").attr("id", "message1");
		$("#message3").attr("id", "message2");
		$("#message4").attr("id", "message3");
		$("#message").animate({opacity: 1}, 500);
		if ($("#message span").eq(0 + admin).width() > $("#message1 p").width()){
			stopped1 = 0;
			animate1();
		}
		if ($("#message span").eq(1 + admin).width() > $("#message2 p").width()){
			stopped2 = 0;
			animate2();
		}
		if ($("#message span").eq(2 + admin).width() > $("#message3 p").width()){
			stopped3 = 0;
			animate3();
		}
		if (admin)
		{
			$("#message1").css("opacity", "0");
		}
	}
	function pullnotice(data) {
		$("#message").animate({opacity: 0}, 0.01);
		$("#message0").remove();
		$("#message1").css("opacity", "1");
		$("#message").animate({opacity: 1}, 500);
		admin = 0;
	}
	function pushnotice(data) {
		admin = 1;
		clearTimeout(currenttimeout);
		$("#message0").remove();
		var newNotice = $('<div id="message0"></div>');
		newNotice.append($('<img src="' + "./potrait.jpg" +'" alt="">'));
		newNotice.append($('<p class="marquee"><span>' + arguments[0].content +'</span></p>'));
		newNotice.append($('<div><p>' + "管理员公告" +'</p></div>'));
		$("#message").prepend(newNotice);
		$("#message0").css("zIndex", 2);
		$("#message0").css("width", "100%");
		$("#message0").css("height", "22.5%");
		$("#message0").css("margin", "2% auto");
		$("#message0").css("backgroundColor", "rgba(130, 104, 109, 0.4)");
		$("#message0 span").css("color", "rgb(130, 0, 0)");
		$("#message1").css("opacity", "0");
		$("#message0").css("position", "absolute");
		if ($("#message0 span").width() > $("#message1 p").width()){
			animate0();
		}
		currenttimeout = setTimeout("pullnotice()", 10000);
	}
	$("#control").click(function(event) {
		if (running)
		{
			running = 0;
			$("#notice div").html("我们的微信墙暂时关闭，请稍安勿躁，等待微信墙开放，不能说话的时候，我们可以玩一点捕捉爱的小游戏，这样公告字数就能凑得差不多了，嘻嘻嘻。");
		}
		else
		{
			running = 1;
			$("#notice div").html("请回复“上墙”+自己想说的话发送到10086，另外这是一个很炫酷的微信墙公告呢，我非常非常喜欢这个公告呢，虽然我并不知道自己在做什么鬼，嘻嘻。");
		}
	});
	socket.on("new message", function(data) {if(running) {pushmessage(data);}});
	socket.on("admin", function(data) {if(running) {pushnotice(data);}});
	animateh();