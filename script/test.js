var sc = null;//初始化游戏区域
var miu = 0.01;//设定摩擦系数
var rotating = 0;//标记球杆旋转事件
var theta = 0;//标记球杆旋转角度
var shooting = 0;//标记球杆发力事件
var placing = 0;//标记放置白球事件
var strength = 0;//标记球杆发力大小(0~20)
var strengthTO = null;//球杆发力计时器
var fallen = new Array();//重新开始游戏的时候清空
//todo: 添加辅助圆 计时器判定 帮助文档 完成snooker逻辑（结束游戏、重新开始、将彩球放回但不在原位、彩球不放回的bug） ppt

var fflag = 0;
var t_timer ;	//用于记时
var hasHitOnce = false;	//表示有没有打过一杆
var player = 1;     //判断谁在击球，1表示player1在击球，2表示player2在击球（最开始玩家1击球，但是初始化的时候貌似会调用一次判定函数，将2修改成1，所以赋值为2）
var p1_points = -4, p2_points = -4;  //记录玩家1、2的分数
var status = 0;     //0表示尚未进球，1表示刚进了一个红球，2表示刚进了一个彩球并且红球全部打光
var target = 1;     //1表示下一个应该击打红球，2~7表示下一个应该击打黄、绿、棕、蓝、粉、黑球，0表示下一个应该击打彩球（任一个）

var fallenThisRound = [0,0,0,0,0,0,0,0];    //表示这个回合有哪些球各几个掉袋了，数组1~7位分别表示红、黄、绿、棕、蓝、粉、黑球掉袋数量
var isWhiteFallen = 0;      //表示本回合中白球是否掉袋，0表示否，1表示是。
var firstHitBall = 0;       //表示本回合中第一个碰到的球,其值为该球分值

function changePoints(add_points,self){//修改分数，负值表示当前玩家犯规，给对方加分并交换球权
    var sb1 = document.getElementById('sb1');   //获取计分板1元素
    var sb2 = document.getElementById('sb2');   //获取计分板2元素
    if(player == 1){        //当前是玩家1的情况下,给玩家1加分
        if (add_points > 0){
            p1_points += add_points;
            var output = p1_points + ' points';     //输出到计分板的内容
            sb1.innerHTML = output;                 //更改计分板内容
        }
        else if (add_points < 0){
            p2_points -= add_points;
            var output = p2_points + ' points';
            sb2.innerHTML = output;
            sb1.style.color = "white";
            sb2.style.color = "green";
            player = 2;
        }
        else if (add_points == 0){
            sb1.style.color = "white";
            sb2.style.color = "green";
            player = 2;
        }
    }
    else if(player == 2){   //当前是玩家2，给玩家2加分
        if (add_points > 0){
            p2_points += add_points;
            var output = p2_points + ' points';     //输出到计分板的内容
            sb2.innerHTML = output;                 //更改计分板内容
        }
        else if (add_points < 0){
            p1_points -= add_points;
            var output = p1_points + ' points';
            sb1.innerHTML = output;
            sb2.style.color = "white";
            sb1.style.color = "green";
            player = 1;
        }
        else if (add_points == 0){
            sb2.style.color = "white";
            sb1.style.color = "green";
            player = 1;
        }
        
    }
	
	if (add_points < 0){
            resetColorBall(self);
    }
 //要判断红球打完没
	var count = 0;
	for(var m = 7; m <= 21; m++){   //统计台上还有几个红球
	  if (fallen[m] == 0){count++;}
	}
	if(count > 0) {
	   resetColorBall(self);
	}
	else if (count == 0 && fflag == 0){
		target = 2;
		status = 2;
		fflag = 1;
	}
	count = 0;
	for(var m = 0; m <= 21; m++){   //统计台上还有几个红球
	  if (fallen[m] == 0 && m != 2){count++;}
	}
	if (count == 0){
		gameover();
	}
}   
function resetColorBall(self){
    for(var m = 2; m <= 7; m++){    //把落袋了的彩球放回去
        if (fallenThisRound[m] == 1){
            if (m == 2){//黄球掉袋，需要复原
                fallen[1] = 0;
                self.balls[1].style.display="inline";
                self.balls[1].style.left=199+'px';
                self.balls[1].style.top=329+'px';
                self.balls[1].vx=0;
                self.balls[1].vy=0;
            }
            if (m == 3){//绿球掉袋，需要复原
                fallen[4] = 0;
                self.balls[4].style.display="inline";
                self.balls[4].style.left=199+'px';
                self.balls[4].style.top=154+'px';
            }
            if (m == 4){//棕球掉袋，需要复原
                fallen[6] = 0;
                self.balls[6].style.display="inline";
                self.balls[6].style.left=199+'px';
                self.balls[6].style.top=237+'px';
            }
            if (m == 5){//蓝球掉袋，需要复原
                fallen[3] = 0;
                self.balls[3].style.display="inline";
                self.balls[3].style.left=469+'px';
                self.balls[3].style.top=237+'px';
            }
            if (m == 6){//粉球掉袋，需要复原
                fallen[5] = 0;
                self.balls[5].style.display="inline";
                self.balls[5].style.left=699+'px';
                self.balls[5].style.top=237+'px';
            }
            if (m == 7){//黑球掉袋，需要复原
                fallen[0] = 0;
                self.balls[0].style.display="inline";
                self.balls[0].style.left=882+'px';
                self.balls[0].style.top=237+'px';
            }
        }
    } 
}
function restart() {//后门函数restart和gameover
    window.location.reload();
}
function gameover() {
    getFlag("screen").style.display = "none";
    getFlag("info").style.display = "none";
    getFlag("gameover").style.visibility = "visible";
    getFlag("restart").style.visibility = "visible";
    getFlag("result").style.visibility = "visible";
    if (p1_points > p2_points)
    {
        getFlag("result").innerHTML = "player1 wins"
    }
    else if(p2_points > p1_points)
    {
        getFlag("result").innerHTML = "player2 wins"
    }
}
//above is newly added
for (var i = 0; i < 22; i++)
{
    fallen[i] = 0;
}
var getFlag=function (id) {
  return document.getElementById(id);   //获取元素引用
}
var extend=function(des, src) {
   for (p in src) {
     des[p]=src[p];
  }
  return des;
}
var clss=['black','yellow','white','blue','green','pink','coffee','red','red','red','red','red','red','red','red','red','red','red','red','red','red','red'];
var Ball=function (diameter,classn) {
    var ball=document.createElement("div");
    ball.className=classn;
    with(ball.style) {
      width=height=diameter + 'px'; position= 'absolute';
    }
    return ball;
}
var Screen=function (cid,config) {
    //先创建类的属性
    var self=this;
    if (!(self instanceof Screen)) {
        return new Screen(cid,config)
    }
    config=extend(Screen.Config, config)    //configj是extend类的实例    self.container=getFlag(cid);            //窗口对象
    self.container=getFlag(cid);
    self.ballsnum=config.ballsnum;
    self.diameter=26;                       //球的直径
    self.radius=self.diameter / 2;
    self.spring=config.spring;              //球相碰后的反弹力
    self.bounce=config.bounce;              //球碰到窗口边界后的反弹力
    self.gravity=config.gravity;            //球的重力
    self.balls=[];                          //把创建的球置于该数组变量
    self.timer=null;                       //调用函数产生的时间id
    self.L_bound=0;                       //container的边界
    self.R_bound=self.container.clientWidth;  //document.documentElement.clientWidth || document.body.clientWidth 兼容性
    self.T_bound=0;
    self.B_bound=self.container.clientHeight;
};
Screen.Config={                         //为属性赋初值
    ballsnum: 22,
    spring: 0.8,
    bounce: -0.89,
    gravity: 0
};
Screen.prototype={
    initialize:function () {
        var self=this;
        self.createBalls();
        self.timer=setInterval(function (){self.hitBalls()}, 15)
    },
    createBalls:function () {
        var self=this, 
            num=self.ballsnum;
        var frag=document.createDocumentFragment();    //创建文档碎片，避免多次刷新       
        for (i=0;i<num;i++) {
            var ball=new Ball(self.diameter,clss[i]);
            //var ball=new Ball(self.diameter,clss[ Math.floor(Math.random()* num )]);//这里是随机的10个小球的碰撞效果
            ball.diameter=self.diameter;
            ball.radius=self.radius;
            //ball.style.left=(Math.random()*self.R_bound)+'px';  //球的初始位置，
            //ball.style.top=(Math.random()*self.B_bound)+'px';
            // ball.vx=Math.random() * 116 - 3;//设定初始速度
            // ball.vy=Math.random() * 116 - 3;
            ball.vx = 0;
            ball.vy = 0;
            frag.appendChild(ball);
            self.balls[i]=ball;
        }
        self.balls[0].style.left=882+'px';
        self.balls[0].style.top=237+'px';
        self.balls[1].style.left=199+'px';
        self.balls[1].style.top=329+'px';
        self.balls[2].style.left=199+'px';
        self.balls[2].style.top=280+'px';
        self.balls[3].style.left=469+'px';
        self.balls[3].style.top=237+'px';
        self.balls[4].style.left=199+'px';
        self.balls[4].style.top=154+'px';
        self.balls[5].style.left=699+'px';
        self.balls[5].style.top=237+'px';
        self.balls[6].style.left=199+'px';
        self.balls[6].style.top=237+'px';
        self.balls[7].style.left=734+'px';
        self.balls[7].style.top=237+'px';
        self.balls[8].style.left=757+'px';
        self.balls[8].style.top=250+'px';
        self.balls[9].style.left=757+'px';
        self.balls[9].style.top=224+'px';
        self.balls[10].style.left=780+'px';
        self.balls[10].style.top=263+'px';
        self.balls[11].style.left=780+'px';
        self.balls[11].style.top=237+'px';
        self.balls[12].style.left=780+'px';
        self.balls[12].style.top=211+'px';
        self.balls[13].style.left=803+'px';
        self.balls[13].style.top=276+'px';
        self.balls[14].style.left=803+'px';
        self.balls[14].style.top=250+'px';
        self.balls[15].style.left=803+'px';
        self.balls[15].style.top=224+'px';
        self.balls[16].style.left=803+'px';
        self.balls[16].style.top=198+'px';
        self.balls[17].style.left=827+'px';
        self.balls[17].style.top=289+'px';
        self.balls[18].style.left=827+'px';
        self.balls[18].style.top=263+'px';
        self.balls[19].style.left=827+'px';
        self.balls[19].style.top=237+'px';
        self.balls[20].style.left=827+'px';
        self.balls[20].style.top=211+'px';
        self.balls[21].style.left=827+'px';
        self.balls[21].style.top=185+'px';
        // self.balls[2].vx=116 * Math.random();//设定初始速度
        // self.balls[2].vy=58 * Math.random();
        self.container.appendChild(frag);
    },
    hitBalls:function () {
            var self=this, 
            num=self.ballsnum,
            balls=self.balls;
        for (i=0;i<num-1;i++) {
            if (fallen[i])
            {
                continue;
            }
            var ball1=self.balls[i];
            ball1.x=ball1.offsetLeft+ball1.radius;      //小球圆心坐标
            ball1.y=ball1.offsetTop+ball1.radius;
            for (j=i+1;j<num;j++) {
                if (fallen[j])
                {
                    continue;
                }
                var ball2=self.balls[j];
                ball2.x=ball2.offsetLeft+ball2.radius;
                ball2.y=ball2.offsetTop+ball2.radius;
                dx=ball2.x-ball1.x;                      //两小球圆心距对应的两条直角边
                dy=ball2.y-ball1.y;
                var dist=Math.sqrt(dx*dx + dy*dy);       //两直角边求圆心距
                var misDist=ball1.radius+ball2.radius;   //圆心距最小值
                if(dist < misDist) {

                    //added
                    //获取白球第一个撞击的球
                    
                    if(firstHitBall == 0){      //白球还没有碰到过球
                        if(i == 2){
                            if(j == 0) firstHitBall = 7;    //黑
                            if(j == 1) firstHitBall = 2;    //黄
                            if(j == 3) firstHitBall = 5;    //蓝
                            if(j == 4) firstHitBall = 3;    //绿
                            if(j == 5) firstHitBall = 6;    //粉
                            if(j == 6) firstHitBall = 4;    //棕
                            if(j >= 7) firstHitBall = 1;    //红
                        }
                        else if(j == 2){
                            if(i == 0) firstHitBall = 7;    //黑
                            if(i == 1) firstHitBall = 2;    //黄
                            if(i == 3) firstHitBall = 5;    //蓝
                            if(i == 4) firstHitBall = 3;    //绿
                            if(i == 5) firstHitBall = 6;    //粉
                            if(i == 6) firstHitBall = 4;    //棕
                            if(i >= 7) firstHitBall = 1;    //红
                        }
                    }                    
                    //假设碰撞后球会按原方向继续做一定的运动，将其定义为运动A   
                    var angle=Math.atan2(dy,dx);
                    //当刚好相碰，即dist=misDist时，tx=ballb.x, ty=ballb.y
                    tx=ball1.x+Math.cos(angle) * misDist; 
                    ty=ball1.y+Math.sin(angle) * misDist;
                    //产生运动A后，tx > ballb.x, ty > ballb.y,所以用ax、ay记录的是运动A的值
                    ax=(tx-ball2.x) * self.spring;  
                    ay=(ty-ball2.y) * self.spring;
                    //一个球减去ax、ay，另一个加上它，则实现反弹
                    ball1.vx-=ax;                         
                    ball1.vy-=ay;
                    ball2.vx+=ax;
                    ball2.vy+=ay;
                    getFlag("ball").play();  
                }
            }
        }
        for (i = 0; i < num; i++) {
            if (fallen[i])
            {
                continue;
            }
            self.moveBalls(balls[i],i);
        }
        var totalv = 0;
        for (var j = 0; j < 22; j++)//求速度的平方和
        {
            totalv += balls[j].vx * balls[j].vx;
            totalv += balls[j].vy * balls[j].vy;
        }
        if (totalv == 0)        //表示全部球都停下了，也要开始结算
        {            
            //下方为新增的代码段 !!!
			//加回计时器
			if (hasHitOnce == true){
				$('#info').append("<div id='counter_2'></div>");
				$('#counter_2').countdown({
					image: 'images/digits.png',
					startTime: '00:30',
					format: 'mm:ss'
				}); 
				t_timer = setTimeout("resetTimer()",30000);
			}            
            if (isWhiteFallen == 1){//白球落袋
                
                changePoints(-4,self);
                resetColorBall(self);
                
            }
            else if (isWhiteFallen == 0) {//白球未落袋
                if (firstHitBall  == 0) {//说明没打到球，犯规
                    changePoints(-4,self);
                }
                else {  //打到球了
                    if(target == 1){                                        //目标击打球是红球
                        if (firstHitBall > 1){  //犯规
                            var cpoints = Math.max(4,firstHitBall);
                            changePoints(-cpoints,self);
                            resetColorBall(self);
                        }
                        else {
                            var add_points = 0;
                            var max_ball = 0; //记录落袋的最大分值的球
                            for(var m = 1; m <= 7; m++){
                                if (fallenThisRound[m] != 0){
                                    max_ball = m;
                                }
                            }
                            if (max_ball == 1){ //说明没有犯规
                                add_points = fallenThisRound[1];
                                target = 0;
                                status = 1;
                            }
                            else if (max_ball > 1){ //说明犯规了
                                add_points = Math.max(4,max_ball);
                                add_points = 0 - add_points;
                                //将打进的彩球复位
                                resetColorBall(self);
                            }
                            
                            changePoints(add_points,self);
                        }
                    }  
                    else if (target == 0){                              //打击目标是任意彩球
                        var add_points = 0;
                        var max_ball = 0; //记录落袋的最大分值的球
                        var fallNum = 0;    //记录总共有几个球落袋
                        for(var m = 1; m <= 7; m++){
                            if (fallenThisRound[m] != 0){
                                max_ball = m;
                                fallNum += fallenThisRound[m];
                            }
                        }
                        if (firstHitBall == 1){ //犯规,先击打了红球
                            var cpoints = Math.max(4,max_ball);
                            changePoints(-cpoints,self);
                            resetColorBall(self);
                            var rcount = 0;
                            for (var m = 7; m <= 21; m++){
                                if (fallen[m] == 0) {
                                    rcount++;
                                }
                            }
                            if (rcount > 0){
                                target = 1;     //场上还有红球，说明下一个应该击打的必然是红球
                                status = 0;    
                            }
                            else {
                                target = 2;
                                status = 2;
                            }
                           
                        }
                        else {
                            if (fallNum == 1 && max_ball > 1) { //击入一个彩球
                                //判断进的是不是打得那个球
                                if(firstHitBall == max_ball){
                                    add_points = max_ball;
                                }
                                else {
                                    var cpoints = Math.max(firstHitBall,max_ball,4);
                                    add_points = -cpoints;
                                }
                            }
                            else if (max_ball == 1 && fallNum == 1){    //说明犯规了,打入了红球
                                add_points = -4;
                                var rcount = 0;
                                for (var m = 7; m <= 21; m++){
                                    if (fallen[m] == 0) {
                                        rcount++;
                                    }
                                }
                                if (rcount > 0){
                                    target = 1;     //场上还有红球，说明下一个应该击打的必然是红球
                                    status = 0;    
                                }
                                else {
                                    target = 2;
                                    status = 2;
                                } 
                            }
                            else if (fallNum > 1){      //同时打入了几个球,犯规
                                var cpoints = Math.max(max_ball,4);
                                add_points = -cpoints;
                                resetColorBall(self);
                            }
                            else if (fallNum == 0 && max_ball == 0){//没有打进任何球
                                add_points = 0;
                            }
                            //要判断红球打完没
                            var count = 0;
                            for(var m = 7; m <= 21; m++){   //统计台上还有几个红球
                                if (fallen[m] == 0){count++;};
                            }
                            if (count > 0){ //台上还有红球，下一个也应该击打红球
                                target = 1;
                                status = 0;
                                resetColorBall(self);
                            }
                            else if (count == 0){
                                target = 2; //下一个应该击打黄球
                                status = 2;
                            }
                            changePoints(add_points,self);
                        }
                    }//在这里继续添加别的判定情况
                    else if (target >= 2){
						var add_points = 0;
                        var max_ball = 0; //记录落袋的最大分值的球
                        var fallNum = 0;    //记录总共有几个球落袋
                        for(var m = 1; m <= 7; m++){
                            if (fallenThisRound[m] != 0){
                                max_ball = m;
                                fallNum += fallenThisRound[m];
                            }
                        }
						if (firstHitBall == target && fallNum == 0) {changePoints(0,self);}
						else if (firstHitBall == target && fallNum == 1 && max_ball == target) {
							changePoints(target,self);
							if (target == 7){	//全部落袋了，游戏结束
								gameover();
							}
							else {
								target++;
							}
						}
						else {
							add_points = Math.max(4,max_ball,firstHitBall,target);
							changePoints(-add_points,self);
						}
					}                   
                }               
            }             
            //重置记录每一杆状况的变量
            for(var m = 0; m <= 7; m++){
                fallenThisRound[m] = 0;
            }
            isWhiteFallen = 0;
            firstHitBall = 0; 
            //above is newly added           
            clearInterval(self.timer);
            self.playerHit();
        }
    },
    moveBalls:function (ball, num) {
        var self=this;
        ball.vy+=self.gravity;
        var tempvx = ball.vx;
        var tempvy = ball.vy;
        if (ball.vx < 0.03 && ball.vx > -0.03)
        {
            ball.vx = 0;
        }
        if (ball.vy < 0.03 && ball.vy > -0.03)
        {
            ball.vy = 0;
        }
        var speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        if (speed)
        {
            ball.vx -= miu * ball.vx / speed;
            ball.vy -= miu * ball.vy / speed;
        }
        if (tempvx && !ball.vx)
        {
            ball.vy = 0;
        }
        if (tempvy && !ball.vy)
        {
            ball.vx = 0;
        }
        ball.style.left=(ball.offsetLeft+ball.vx)+'px';
        ball.style.top=(ball.offsetTop+ball.vy)+'px';
        //判断球与窗口边界相碰，把变量名简化一下
        var L=self.L_bound, R=self.R_bound, T=self.T_bound, B=self.B_bound, BC=self.bounce;  
        if (ball.offsetLeft < L) {
            ball.style.left=L;
            ball.vx*=BC;
            getFlag("wall").play(); 
        }
       else if (ball.offsetLeft + ball.diameter > R) {
            ball.style.left=(R-ball.diameter)+'px';
            ball.vx*=BC;
            getFlag("wall").play(); 
        }
       else if (ball.offsetTop < T) {
            ball.style.top=T;
            ball.vy*=BC;
            getFlag("wall").play(); 
        }
        if (ball.offsetTop + ball.diameter > B) {
            ball.style.top=(B-ball.diameter)+'px';
            ball.vy*=BC;
            getFlag("wall").play(); 
        }
        //以下为台球落入带中的判定函数
        if ((ball.offsetLeft + ball.radius) * (ball.offsetLeft + ball.radius) + (ball.offsetTop + ball.radius) * (ball.offsetTop + ball.radius) <= 900
            || (ball.offsetLeft + ball.radius - 962) * (ball.offsetLeft + ball.radius - 962) + (ball.offsetTop + ball.radius) * (ball.offsetTop + ball.radius) <= 900
            || (ball.offsetLeft + ball.radius) * (ball.offsetLeft + ball.radius) + (ball.offsetTop + ball.radius - 498) * (ball.offsetTop + ball.radius - 498) <= 900
            || (ball.offsetLeft + ball.radius - 962) * (ball.offsetLeft + ball.radius - 962) + (ball.offsetTop + ball.radius - 498) * (ball.offsetTop + ball.radius - 498) <= 900
            || (ball.offsetLeft + ball.radius - 481) * (ball.offsetLeft + ball.radius - 481) + (ball.offsetTop + ball.radius + 5) * (ball.offsetTop + ball.radius + 5) <= 900
            || (ball.offsetLeft + ball.radius - 481) * (ball.offsetLeft + ball.radius - 481) + (ball.offsetTop + ball.radius - 503) * (ball.offsetTop + ball.radius - 503) <= 900)
        {
            ball.vx = 0;
            ball.vy = 0;
            fallen[i] = 1;          
            if (i == 2){    //白球落袋
                isWhiteFallen = 1;
            }
            if (i == 0){ //黑球落袋
                fallenThisRound[7] += 1;
            }
            if (i == 1){//黄
                fallenThisRound[2] += 1;
            }
            if (i == 3){//蓝
                fallenThisRound[5] += 1;
            }
            if (i == 4){//绿
                fallenThisRound[3] += 1;
            }
            if (i == 5){//粉
                fallenThisRound[6] += 1;
            }
            if (i == 6){//棕
                fallenThisRound[4] += 1;
            }
            if (i >= 7){//红
                fallenThisRound[1] += 1;
            }           
            getFlag("in").play(); 
            ball.style.display = "none";
        }
    },
    playerHit:function() {
        //console.log("now it's time for you");
        //sc.balls[2].vx= 58 * Math.random();//设定初始速度
        //sc.balls[2].vy= 29 * Math.random();
        //sc.balls[2].style.left=30+'px';
        //sc.balls[2].style.top=429+'px';
        //sc.timer=setInterval(function (){sc.hitBalls()}, 30);
        if (sc.balls[2].style.display == 'none')
        {
            sc.balls[2].style.display = 'inline';
            sc.balls[2].style.opacity = 0.2;
            fallen[2] = 0;
            placing = 1;
        }
        else
        {
            rotating = 1;
        }
    }
}
window.onload=function() {
    document.getElementById("inner").innerHTML='';
    sc=new Screen('inner',{ballsnum: 22, spring: 0.89, bounce: -0.8, gravity: 0});
    sc.initialize();
    getFlag('start').onclick=function () {
        sc.balls[2].vx= 58 * Math.random();//设定初始速度
        sc.balls[2].vy= 29 * Math.random();
        if (sc.balls[2].style.display == 'none')
        {
            sc.balls[2].style.display = 'inline';
            sc.balls[2].style.left=30+'px';
            sc.balls[2].style.top=429+'px';
        }
        sc.timer=setInterval(function (){sc.hitBalls()}, 15);
    }
    getFlag('stop').onclick=function() {
       clearInterval(sc.timer);
    }
}
getFlag("screendad").onmousemove=function(event) {//计算并绘制球杆、辅助线的位置以及旋转方向
    if (rotating)
    {
        theta = Math.atan2(event.clientY - this.offsetTop - 43 - sc.balls[2].offsetTop, event.clientX - this.offsetLeft - 43 - sc.balls[2].offsetLeft);
        // console.log(event.screenX - this.offsetLeft - 30);
        // console.log(event.screenY - this.offsetTop - 91);
        // console.log(sc.balls[2].offsetLeft);
        // console.log(sc.balls[2].offsetTop);
        cue.style.transform = "rotate(" + (theta - 0.553 + 3.1415926) + "rad)";
        cue.style.left = 24.06 + sc.balls[2].offsetLeft + 'px';
        cue.style.top = 19.83 + sc.balls[2].offsetTop + 'px';
        guide.style.opacity = 1;
        guide.style.left = sc.balls[2].offsetLeft + 13 + 'px';
        guide.style.top = sc.balls[2].offsetTop + 13 + 'px';
        guide.style.transform = "rotate(" + theta + "rad)";
        var guidelength = 0;
        var guidex = 0;
        var guidey = 0;
        var flag = 0;
        while (1)
        {
            guidex = sc.balls[2].offsetLeft + guidelength * Math.cos(theta);
            guidey = sc.balls[2].offsetTop + guidelength * Math.sin(theta);
            if (guidex <= 0 || guidex >= 936 || guidey <= 0 || guidey >= 472)
            {
                break;
            }
            guidelength++;
        }
        guide.style.width = guidelength + 'px';
    }
}
function hitting() {
    if (strength < 40)
    {
        strength++;
    }
    cue.style.left = 24.06 + sc.balls[2].offsetLeft - 2.5 * strength * Math.cos(theta) + 'px';
    cue.style.top = 19.83 + sc.balls[2].offsetTop - 2.5 * strength * Math.sin(theta) + 'px';
}
getFlag("screendad").onmousedown=function(){
    if (rotating)
    {
        rotating = 0;
        shooting = 1;
        strength = 0;
        strengthTO = setInterval("hitting()", 15);
		$('#counter_2').remove();
		clearTimeout(t_timer);
		hasHitOnce = true;
    }
}
getFlag("screendad").onmouseup=function(){//发射球
    if (shooting)
    {
        clearInterval(strengthTO);
        cue.style.left = 24.06 + sc.balls[2].offsetLeft + 'px';
        cue.style.top = 19.83 + sc.balls[2].offsetTop + 'px';
        shooting = 0;
        sc.balls[2].vx= strength / (3.5) * Math.cos(theta);//设定初始速度
        sc.balls[2].vy= strength / (3.5) * Math.sin(theta);
        guide.style.opacity = 0;
        getFlag("shoot").play();   
        sc.timer=setInterval(function (){sc.hitBalls()}, 15);
    }
}
getFlag("screen").onmousemove=function(event){//白球落带后重新放置球
    if (placing){
        sc.balls[2].style.left = event.clientX - getFlag("screendad").offsetLeft - 43 + 'px';
        sc.balls[2].style.top = event.clientY - getFlag("screendad").offsetTop - 43 + 'px';
        // console.log(event.screenX);
        // console.log(event.screenY);
        // console.log(getFlag("screendad").offsetLeft);
        // console.log(getFlag("screendad").offsetTop);
        if ((sc.balls[2].offsetLeft - 199) * (sc.balls[2].offsetLeft - 199) + (sc.balls[2].offsetTop - 237) * (sc.balls[2].offsetTop - 237) <= 90 * 90 && sc.balls[2].offsetLeft < 199)
        {
            sc.balls[2].style.opacity = 0.7;
        }
        else
        {
            sc.balls[2].style.opacity = 0.2;
        }
    }
}
getFlag("screen").onclick=function(event){
    if (placing){
        if (sc.balls[2].style.opacity == 0.7)
        {
            placing = 0;
            sc.balls[2].style.opacity = 1;
            rotating = 1;
        }
    }
}
getFlag("startgame").onclick=function(){
    document.getElementById("inner").innerHTML='';
    getFlag("menu").style.display = "none";
    getFlag("screendad").style.visibility = "visible";
    getFlag("info").style.visibility = "visible";
    sc=new Screen('inner',{ballsnum: 22, spring: 0.89, bounce: -0.8, gravity: 0});
    sc.initialize();
	t_timer = setTimeout("resetTimer()",30000);
}
getFlag("startgame").onmouseenter=function(){
    this.style.color = "green";
    getFlag("menusound").play();
}
getFlag("startgame").onmouseleave=function(){
    this.style.color = "white";
}
getFlag("help").onmouseenter=function(){
    this.style.color = "green";
    getFlag("menusound").play();
}
getFlag("help").onmouseleave=function(){
    this.style.color = "white";
}
getFlag("help").onclick=function(){
    if ($("#helpcontent p").css('opacity') == 0)
    {
        $("#helpcontent p").animate({opacity: 1}, 1000);
    }
    else
    {
        $("#helpcontent p").animate({opacity: 0}, 1000);
    }
}
getFlag("restart").onmouseenter=function(){
    this.style.color = "orange";
    getFlag("menusound").play();
}
getFlag("restart").onmouseleave=function(){
    this.style.color = "white";
}
getFlag("restart").onclick=function(){
    restart();
}

function resetTimer(){
	changePoints(-4,sc);
	t_timer = setTimeout("resetTimer()",30000);
	$('#counter_2').remove();
	$('#info').append("<div id='counter_2'></div>");
	$('#counter_2').countdown({
	  image: 'images/digits.png',
	  startTime: '00:30',
	  format: 'mm:ss'
	});
}
$(function(){
    $('#counter_2').countdown({
	   image: 'images/digits.png',
	   startTime: '00:30',
	   //timerEnd: function(){ resetTimer(); },
	   format: 'mm:ss'
	});
});

//后门
function hideRed(){
	for(var m = 7; m <= 21; m++){
		sc.balls[m].style.display='none';
		fallen[m] = 1;
	}
}