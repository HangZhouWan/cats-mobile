// JavaScript Document
window.onload = function(){
	BtnHandle();
	
}
// 解决事件绑定兼容性问题
var EventUtil = {
	addHandler : function(elem,type,handler){
		if(elem.addEventListener){
			elem.addEventListener(type,handler,false);
		}
		else if(elem.attachEvent){
			elem.attachEvent("on"+type,handler);
		}
		else{
			elem["on"+type] = null;
		}
	},
	removeHandler : function(elem,type,handler){
		if(elem.removeEventListener){
			elem.removeEventListener(type,handler,false);
		}
		else if(elem.detachEvent){
			elem.detachEvent("on"+type,handler);
		}
		else{
			elem["on"+type] = null;
		}
	}
}
		

var Map = new Array();
var posList = [0,9,3];
var countTime = null; 
var gameTime = null;

function BtnHandle(){
	var btn = document.querySelector("button");
	EventUtil.addHandler(btn,"click",readyToStart);
}
//倒计时 结束之后清空屏幕，创造表格；
function readyToStart(){
	var counter = document.getElementById("counter").innerHTML.trim();
	var list = null;
	var timeCount = setInterval(function(){
		counter --
		document.getElementById("counter").innerHTML = counter;
		if(counter == -1){
			clearInterval(timeCount);
			document.getElementById("container").innerHTML = "";
			var progress = document.createElement("div");
			renderTable();
			countTime = setInterval(posOut,400); //产生随机数 绘制猫猫
			gameTime = setInterval(gameProgress,200); //游戏计时
		}
	},1000);
	
}
//表格绘制
function renderTable(){
	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	console.log(width,height);
	var cellWidth = 100,cellHight = 100;
	var cols = Math.round((width-200)/cellWidth);
	var rows = Math.round((height-200)/cellHight);
	var tbody = document.createElement("tbody");
	var table = document.createElement("table");
	table.style.cssText = "margin-top:100px;border-spacing:10px;margin-left:auto;margin-right:auto";
	for(var i = 0;i<rows;i++){
		var tr = document.createElement("tr");
		tbody.appendChild(tr);
		for(var j = 0 ;j<cols;j++){
			var td = document.createElement("td");
			td.style.cssText = 'width:100px;height:100px;position:relative;overflow:hidden';
			tr.appendChild(td);
		}
	}
	table.appendChild(tbody);
	document.getElementById("container").appendChild(table);
	// 为表格单元格添加Id 
	(function tableID(){
		var td = table.getElementsByTagName("td"),len = td.length;
		for(var i = 0;i<len;i++){
			td[i].id = i;
			Map.push(i);
		}
	})();
}


function posOut(){
	var randomNum = Math.round(Math.random()*(Map.length-1));
	var condition = posList.indexOf(randomNum);
	if(condition==-1){
		posList.push(randomNum);
	}
	var pos = posList.shift();
	var td = document.getElementsByTagName("td");
	var hole = document.createElement("div");
	var cat = document.createElement("img");
	hole.style.cssText = "position:absolute;height:1px;width:10px; border-radius:100px/30px;bottom:0;background-color:black;opacity:1;"; 
	if(td[pos].firstChild==null){
		td[pos].appendChild(hole);
		hole.growUp = setInterval(holeGrowUp,10);
	}
	//猫洞产生
	function holeGrowUp(){
			var width = parseInt(hole.style.width);
			var height = parseInt(hole.style.height);
			width = width+3;
			height = height+1;
			hole.style.width = width+"px";
			hole.style.height = height+"px";
			if(width == 100){
				clearInterval(hole.growUp);
				creatCat();
			}
	}
	//猫洞结束调用猫猫上升函数
	function creatCat(){
		cat.style.cssText = "position:absolute;bottom:-80px;left:20px;cursor:pointer;" 
		cat.src = "cat.png";
		td[pos].appendChild(cat);
		var flag = false;
		EventUtil.addHandler(cat,"click",Interval);//点击之后 猫猫下降；
		EventUtil.addHandler(cat,"click",win);// 绑定中奖函数；
		cat.grow = setInterval(growUpCat,2)
	}
	function growUpCat(){
		var bottom =parseInt(cat.style.bottom);
		bottom = bottom+1;
		cat.style.bottom = bottom+"px";
		if(bottom == 2){
			clearInterval(cat.grow);
			setTimeout(Interval,500);		
		}
	}
	//等待0.5s 执行猫猫下降函数
	function Interval(){
		clearInterval(cat.grow);
		if(cat.down){
			clearInterval(cat.down);
		}
		cat.down = setInterval(catsDown,2);
	}
	function catsDown(){
		var bottom =parseInt(cat.style.bottom);
		bottom = bottom -1;
		cat.style.bottom = bottom+"px";
		if(bottom == -100){
			clearInterval(cat.down);
			hole.down = setInterval(holesDown,10);
		}
	}
	//猫猫隐藏，执行猫洞收缩函数
	function holesDown(){
		var opacity = parseFloat(hole.style.opacity);
		var width = parseInt(hole.style.width);
		var height = parseInt(hole.style.height);
			width = width-3;
			height = height-1;
			opacity = (opacity*100 - 3)/100
			hole.style.width = width+"px";
			hole.style.height = height+"px";
			hole.style.opacity = opacity;
			console.log(opacity);
			if(width ==1){
				clearInterval(hole.down);
				td[pos].innerHTML = "";
				posList.splice(pos,1);
			}
	}
	//中奖函数 产生随机数1~100 若小于等于10，则中奖，绘制红包
	function win(){
		EventUtil.removeHandler(cat,"click",win); //移除绑定点击事件，每个猫猫只能点击一次；
		var rand = Math.round(Math.random()*100);
		console.log(rand);
		if(rand<10){
			var posX = (document.documentElement.clientWidth/2)-35;
			var posY = document.documentElement.clientHeight/2;
			console.log(posX,posY);
			var Coupon = document.createElement("img");
			Coupon.src = "Coupon.png";
			Coupon.style.cssText = "position:absolute;top:"+posY+"px;left:"+posX+"px;height:70px;width:70px;cursor:pointer;";
			clearInterval(gameTime);
			clearInterval(countTime);
			function openCoupon(){
				Coupon.removeEventListener("click",openCoupon,false);
				Coupon.grow = setInterval(CouponCome,5)
			}
			var CouponWidth = parseInt(Coupon.style.width);
			var CouponHeight = parseInt(Coupon.style.height);
			var left = parseInt(Coupon.style.left);
			function CouponCome(){
				left = left - 0.5;
				CouponWidth = CouponWidth+1;
				CouponHeight = CouponHeight+1;
				Coupon.style.width = CouponWidth+"px";
				Coupon.style.height = CouponHeight+"px";
				Coupon.style.left = left+"px";
				if(CouponWidth==150){
					clearInterval(Coupon.grow);
				}
			}
			EventUtil.addHandler(Coupon,"click",openCoupon);//红包点击打开
			document.body.appendChild(Coupon);
			console.log(CouponWidth,CouponHeight);
			
		}
			
    }

	
}
//游戏时间控制和进度条显示
function gameProgress(){
	var time = parseInt(document.getElementsByClassName("progress-bar")[0].style.width);
	time = time-1 ;
	document.getElementsByClassName("progress-bar")[0].innerHTML = time;
	document.getElementsByClassName("progress-bar")[0].style.width = time+"%";
	if(time == 0){
		clearInterval(countTime);
		clearInterval(gameTime);
	}
}


	


		


