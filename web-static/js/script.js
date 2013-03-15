

/**** ../../web-static/src/js/.gitignore ****/


/**** ../../web-static/src/js/game/00-GameObject.js ****/
var GameObject = function(img,width,height)
{
	if(typeof(img) == "undefined"){
		return;
	}
	
	this.img = document.createElement('image');
	this.img.src = img;
	
	this.offsetX = width/2;
	this.offsetY = height/2;
	
	this.x = 512;
	this.y = 300;
	
	this.drawX = this.x - this.offsetX;
	this.drawY = this.y - this.offsetY;
	
	this.life = 1;
	
};
GameObject.prototype.Update = function(deltaTime)
{
	this.drawX = this.x - this.offsetX;
	this.drawY = this.y - this.offsetY;
	
	if(this.life <=0)
	{
		this.Die();
	}
};
GameObject.prototype.Draw = function(graphics,deltaTime)
{
	graphics.drawImage(this.img,this.drawX,this.drawY);
};

GameObject.prototype.Die = function()
{
	delete this;
};

/**** ../../web-static/src/js/game/Ennemy.js ****/
var Ennemy = function()
{
	
}

Ennemy.prototype = new GameObject();


/**** ../../web-static/src/js/game/Game.js ****/
var Game = function()
{
	var _this = this;
		
	requestAnimFrame(
			function loop() {
				_this.UpdateTime();
				requestAnimFrame(loop);
			}					
		);

	this.LastTime = Date.now();
	
	this.ennemiesLittle = new Array();
	this.ennemiesMiddle = new Array();
	this.ennemeisBig = new Array();
	
	this.player = new Player("../spaceext-static/image/ShooterSD.png",100,94,1);
	
	this.canvas = document.getElementById("canvas");
	this.graphics = canvas.getContext("2d");
	
}

Game.prototype.Update = function(deltaTime)
{
	this.player.Update(deltaTime);
}

Game.prototype.Draw = function(deltaTime)
{
	this.graphics.save();
	this.graphics.clearRect(0,0,this.canvas.width,this.canvas.height);


	this.player.Draw(this.graphics,deltaTime);
	//DrawEnnemies
	//DrawMissiles

	this.graphics.restore();
}

Game.prototype.UpdateTime = function()
{
	var deltaTime = Date.now() - this.LastTime;
	deltaTime /= 1000;
	this.LastTime = Date.now();
	
	this.Update(deltaTime);
	this.Draw(deltaTime);
}

/**** ../../web-static/src/js/game/HoriDrone.js ****/
var HoriDrone = function(img,width,height,left)
{
	GameObject.call(this,img,width,height);
	
	this.x = left?-100:100;
	this.y = 0;
	
}

HoriDrone.prototype = new GameObject();

HoriDrone.prototype.Update = function(deltaTime)
{
	GameObject.prototype.Update.call(this,deltaTime);
};

HoriDrone.prototype.Draw = function(graphics,deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics,deltaTime);
}

/**** ../../web-static/src/js/game/Player.js ****/
var Player = function(img,width,height,type,fireRate)//Need all the things in the DB
{
	var _this = this;
	
	GameObject.call(this,img,width,height);

	this.keyList = {};
	
	this.diag = Math.sqrt(2)/2;
	this.speed = 200;
	
	this.drones = new Array(10);
	
	this.timeFire = 1/fireRate;
	this.canFire = true;
	this.timer = 0;
	
	for(i = 0; i < 10 ; i++ )
	{
		this.drones[i] = new RadialDrone("/spaceext-static/img/thing.png",10,10,80,360/10 * i);
	}
	
	this.LengthDrones = new Array(2);
	
	this.drones[0] = new HoriDrone("/spaceext-static/img/thing.png",10,10,true);
	this.drones[1] = new HoriDrone("/spaceext-static/img/thing.png",10,10,false);
	
	$(document).keyup(function(e){
		_this.onKeyUp(e.which);
	});
	
	$(document).keydown(function(e){
		_this.onKeyDown(e.which);
	});
};

Player.prototype = new GameObject();

Player.prototype.Update = function(deltaTime)
{
	var X = 0;
	var Y = 0;
	
	if(this.keyList[32])
	{
		if(this.canFire)
		{
			
		}
	}
	// Q
	if(this.keyList[113] || this.keyList[81])
	{
		this.revertDirection = true;
		X -= 1;
	}
	// S
	if(this.keyList[115] || this.keyList[83])
	{
		Y += 1;
	}
	// D
	if(this.keyList[100] || this.keyList[68])
	{
		X += 1;
	}
	// Z
	if(this.keyList[122] || this.keyList[90])
	{
		Y -= 1;
	}
	
	if(X != 0 && Y != 0)
	{
		X *= this.diag;
		Y *= this.diag;
	}
	
	X *= this.speed * deltaTime;
	Y *= this.speed * deltaTime;
	
	this.x += X;
	this.y += Y;
	
	if(this.x <= this.offsetX)
		this.x = this.offsetX;
	else if(this.x >= 1024-this.offsetX)
		this.x = 1024-this.offsetX;
	
	if(this.y <= this.offsetY)
		this.y = this.offsetY;
	else if(this.y >= 600-this.offsetY)
		this.y = 600-this.offsetY;
	
	for(i in this.drones)
	{
		if(this.drones[i] != null)
			this.drones[i].Update(deltaTime);
	}
	for(i in this.LengthDrones)
	{
		if(this.LengthDrones[i] != null)
			this.LengthDrones[i].Update(deltaTime);
	}
	
	GameObject.prototype.Update.call(this,deltaTime);
}
Player.prototype.Draw = function(graphics, deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics,deltaTime);
	graphics.save();
	graphics.translate(this.x,this.y);
	for(i in this.drones)
	{
		if(this.drones[i] != null)
			this.drones[i].Draw(graphics,deltaTime);
	}
	for(i in this.LengthDrones)
	{
		if(this.LengthDrones[i] != null)
			this.LengthDrones[i].Draw(graphics,deltaTime);
	}
	graphics.restore();
};

Player.prototype.onKeyDown = function(k)
{
	console.log("space : " + k);
	this.keyList[k] = true;
};
Player.prototype.onKeyUp = function(k)
{
	this.keyList[k] = false;
};

/**** ../../web-static/src/js/game/RadialDrone.js ****/
var RadialDrone = function(img,width,height,distance,startAngle)
{
	GameObject.call(this,img,width,height);
	
	this.distance = distance;
	this.radialSpeed = 3;
	
	this.angle = startAngle;
	
	this.x = Math.cos(this.angle);
	this.y = Math.sin(this.angle);
	
	this.alive = true;
	
	this.timerRevive = 0;
	this.TimeToRevive = 5;
}

RadialDrone.prototype = new GameObject();

RadialDrone.prototype.Update = function(deltaTime)
{
	if(this.alive)
	{
		this.angle += this.radialSpeed*deltaTime;
		
		this.x = Math.cos(this.angle)*this.distance;
		this.y = Math.sin(this.angle)*this.distance;

		GameObject.prototype.Update.call(this,deltaTime);
	}
	else
	{
		this.timerRevive += deltaTime;
		if(this.timerRevive >= this.TimeToRevive)
		{
			this.timerRevive = 0;
			this.alive = true;
		}
	}
}
RadialDrone.prototype.Draw = function(graphics,deltaTime)
{
	if(this.alive)
	{
		GameObject.prototype.Draw.call(this,graphics,deltaTime);
	}
}

/**** ../../web-static/src/js/main.js ****/
var game;

function start()
{
	game = new Game();
}

/**** ../../web-static/src/js/utils.js ****/
window.requestAnimFrame = (function() {
	  return window.requestAnimationFrame ||
	         window.webkitRequestAnimationFrame ||
	         window.mozRequestAnimationFrame ||
	         window.oRequestAnimationFrame ||
	         window.msRequestAnimationFrame ||
	         function(callback, element) {
	           window.setTimeout(callback, 1000/60);
	         };
})();

function encrypt(){
	var form = document.getElementById("connect-form");
	form.password.value = Aes.Ctr.encrypt(form.password.value, '09ed931e1782289f8f9a42f837a46fa0', 256);
	return true;
}
$.coursWeb = {
	api: function(action, data, callback){
		var dataToSend = {
			action: action,
			data: data
		};
		$.ajax({
			url: 'api.php',
			type: 'POST',
			data: {d: Aes.Ctr.encrypt(JSON.stringify(dataToSend), '09ed931e1782289f8f9a42f837a46fa0', 256)},
			error: function(xhr, msg, msg2){
				alert(msg2);
			},
			success: function(data){
				var clearData = Aes.Ctr.decrypt(data, '09ed931e1782289f8f9a42f837a46fa0', 256);
				var result = JSON.parse(clearData);
				if(result.error){
					alert(result.error);
				}else if(typeof(callback) == "function"){
					callback(result);
				}
			}
		});
	}
};


$.getTimeMillis = function(){
	return new Date().getTime();
};
$.getTimeFloat = function(){
	return $.getTimeMillis() / 1000;
};
var localTime = Math.floor(new Date().getTime() / 1000);
$.getTime = function(){
	var timeElapsed = Math.floor($.getTimeFloat()) - localTime;
	return serverTime + timeElapsed;
};
$.getElmRegion = function(elm){
	var pos = elm.offset();
	var rootPos = gameManager.root.offset();
	var posX = pos.left - rootPos.left;
	var posY = pos.top - rootPos.top;
	var w = elm.width();
	var h = elm.height();
	return {
		posX: posX,
		posY: posY,
		width: w,
		height: h
	};
};

$.ease = function(from, to, func, options){
	var isObject = true;
	if(typeof from != "object"){
		from = {v: from};
		to = {v: to};
		isObject = false;
	}
	var o = {};
	if(options){
		for(i in options){
			o[i] = options[i];
		}
	}
	o.step = function(f){
		if(isObject){
			var res = {};
			for(i in from){
				res[i] = f * (to[i] - from[i]) + from[i];
			}
			func(res);
		}else{
			func(f * (to.v - from.v) + from.v);
		}
	};
	var listener = $({f:0});
	if(options && options.delay){
		listener.delay(options.delay).animate({f:1}, o);
	}else{
		listener.animate({f:1}, o);
	}
	return listener;
};

$.shuffle = function(list){
	var i, j, t;
	for (i = 1; i < list.length; i++) {
		j = Math.floor(Math.random() * (1 + i));
		if (j != i) {
			t = list[i];
			list[i] = list[j];
			list[j] = t;
		}
	}
};