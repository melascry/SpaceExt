

/**** ../../web-static/src/js/.gitignore ****/


/**** ../../web-static/src/js/Test.js ****/
var Test = function()
{
	this.foo = 1;
	this.show = function()
	{
		console.log(this.foo);
	}
	
	
}


/**** ../../web-static/src/js/game/00-GameObject.js ****/
var GameObject = function(game,img,width,height)
{
	if(typeof(game) == "undefined"){
		return;
	}
	
	this.game = game;
	this.img = document.createElement('image');

	this.img.src = img;
	
	this.offsetX = -width/2;
	this.offsetY = -height/2;
	
	this.x = 512;
	this.y = 300;
	
	this.radius = Math.sqrt(width*width + height*height)/2;
	this.radiusSquarred = (width  * width + height * height )/ 4;
	//console.log("creation : " + img + " : " + this.radiusSquarred);
	this.life = 1;
	
	this.exists = true;
	this.visible = true;
	this.isUsed = false;
	
};
GameObject.prototype.Update = function(deltaTime)
{
	if(this.life <=0)
	{
		this.Die();
	}
};
GameObject.prototype.Draw = function(graphics,deltaTime)
{
	graphics.Check();
	graphics.drawImage(this.img,this.x + this.offsetX,this.y + this.offsetY);
};

GameObject.prototype.Die = function()
{
	delete this;
};

/**** ../../web-static/src/js/game/Ennemy.js ****/
var Ennemy = function(game,img,width,height)
{
	GameObject.call(this,game,img,width,height);
	
	this.timer = 0;
	
	this.FireTimer = 1;
}

Ennemy.prototype = new GameObject();

Ennemy.prototype.Update = function(deltaTime)
{
	this.timer += deltaTime;
	if(this.timer >= this.FireTimer)
	{
		var c = this.game.poolManager.GetLittleEnnemiesShot();
		c.x = this.x ;
		c.y = this.y ;
		var d = Distance(c.x,this.game.player.x,c.y,this.game.player.y);

		c.direction[0] = (this.game.player.x-c.x)/d;
		c.direction[1] = (this.game.player.y-c.y)/d;
		
		this.timer = 0;
	}
	this.y += 50*deltaTime;
	GameObject.prototype.Update.call(this,deltaTime);
}

Ennemy.prototype.Draw = function(graphics, deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics,deltaTime);
}

Ennemy.prototype.PopInWorld = function()
{
	this.x = Math.random() * 1000;
	this.y = 0;
}

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
	
	this.poolManager = new PoolManager(this,50,50);

	this.player = new Player(this,IMAGE_URL+"ShooterSD.png",100,94,1,20);
	
	this.canvas = document.getElementById("canvas");
	this.graphics = canvas.getContext("2d");
	
	this.graphics.Check = function()
	{
		var i = Date.now() - this.drawTime;
		if(i > 16)
		{
			throw(new CheckException("draw too long "));
		}
	}
	this.timerPopEnnemy = 1;
	this.timer = 0;
}

Game.prototype.Update = function(deltaTime)
{
	this.timer += deltaTime;
	if(this.timer >= this.timerPopEnnemy)
	{
		this.timer = 0;
		//console.log("getting ennemy");
		var ennemy = this.poolManager.GetLittleEnnemy();
		//console.log("getting ennemy");
		ennemy.PopInWorld();
		//console.log("Popping ennemy");
	}
	
	if(this.player.exists)
		this.player.Update(deltaTime);
	
	for ( var i in this.poolManager.LittleEnnemies)
	{
		if(this.poolManager.LittleEnnemies[i] != null)
		{
			if( this.poolManager.LittleEnnemies[i].isUsed)
			{
				this.poolManager.LittleEnnemies[i].Update(deltaTime);
				if(this.poolManager.LittleEnnemies[i].y > this.canvas.height)
					this.poolManager.LittleEnnemies[i].isUsed = false;
			}
		}
	}
	
	for(var i in this.poolManager.PlayerShoots)
	{
		if(this.poolManager.PlayerShoots[i] != null)
		{
			if( this.poolManager.PlayerShoots[i].isUsed)
			{
				this.poolManager.PlayerShoots[i].Update(deltaTime);
				if(this.poolManager.PlayerShoots[i].y <= 0)
					this.poolManager.PlayerShoots[i].isUsed = false;
				else
				{
					for ( var e in this.poolManager.LittleEnnemies)
					{
						if(this.poolManager.LittleEnnemies[e].isUsed)
						{
							var distance = (this.poolManager.LittleEnnemies[e].x-this.poolManager.PlayerShoots[i].x) * (this.poolManager.LittleEnnemies[e].x-this.poolManager.PlayerShoots[i].x)
							+ (this.poolManager.LittleEnnemies[e].y-this.poolManager.PlayerShoots[i].y) * (this.poolManager.LittleEnnemies[e].y-this.poolManager.PlayerShoots[i].y);
							if(distance <= this.poolManager.PlayerShoots[i].radiusSquarred + this.poolManager.LittleEnnemies[e].radiusSquarred)
							{
								//console.log(distance+ " : " + this.poolManager.PlayerShoots[i].radiusSquarred + " : " + this.poolManager.LittleEnnemies[e].radiusSquarred)
								this.poolManager.LittleEnnemies[e].isUsed = false;
								this.poolManager.PlayerShoots[i].isUsed = false;							
							}
						}
					}
				}
			}
		}
	}
	for( var i in this.poolManager.LittleEnnemiesShoots)
	{
		if(this.poolManager.LittleEnnemiesShoots[i] != null)
		{
			if( this.poolManager.LittleEnnemiesShoots[i].isUsed)
			{
				this.poolManager.LittleEnnemiesShoots[i].Update(deltaTime);
				if(this.poolManager.LittleEnnemiesShoots[i].x > this.canvas.width 
				|| this.poolManager.LittleEnnemiesShoots[i].x < 0+this.poolManager.LittleEnnemiesShoots[i].offsetX*2
				|| this.poolManager.LittleEnnemiesShoots[i].y < 0+this.poolManager.LittleEnnemiesShoots[i].offsetY*2
				|| this.poolManager.LittleEnnemiesShoots[i].y > this.canvas.height
				)
				{
					this.poolManager.LittleEnnemiesShoots[i].isUsed = false;
				}
				else 
				{
					var distance = SquarredDistance(this.player.x,this.poolManager.LittleEnnemiesShoots[i].x,this.player.y,this.poolManager.LittleEnnemiesShoots[i].y);
					if(distance <= this.poolManager.LittleEnnemiesShoots[i].radiusSquarred + this.player.droneRadiusSquarred)
					{
						//Test for all drones
						for(var e in this.player.drones)
						{
							var distanceD = SquarredDistance(this.player.drones[e].x,this.poolManager.LittleEnnemiesShoots[i].x,this.player.drones[e].y,this.poolManager.LittleEnnemiesShoots[i].y);
							if(distanceD <= this.poolManager.LittleEnnemiesShoots[i].radiusSquarred + this.player.drones[e].radiusSquarred)
							{
								console.log("touching a drone");
								this.poolManager.LittleEnnemiesShoots[i].isUsed = false;
								this.player.drones[e].alive = false;
							}
						}
						//console.log(distance+ " : " + this.poolManager.PlayerShoots[i].radiusSquarred + " : " + this.poolManager.LittleEnnemies[e].radiusSquarred)
						if(distance <= this.poolManager.LittleEnnemiesShoots[i].radiusSquarred + this.player.radiusSquarred)
						{
							this.player.exists = false;
							this.poolManager.LittleEnnemiesShoots[i].isUsed = false;
						}
					}
				}
			}			
		}
	}
	
}

Game.prototype.Draw = function(deltaTime)
{
	this.graphics.drawTime = Date.now();
	try
	{
		this.graphics.save();
		this.graphics.clearRect(0,0,this.canvas.width,this.canvas.height);
	
		if(this.player.visible)
			this.player.Draw(this.graphics,deltaTime);
		//DrawEnnemies
		for ( var i in this.poolManager.LittleEnnemies)
		{
			if(this.poolManager.LittleEnnemies[i] != null)
			{
				if( this.poolManager.LittleEnnemies[i].isUsed)
				{
					this.poolManager.LittleEnnemies[i].Draw(this.graphics,deltaTime);
				}
			}
		}
		//DrawMissiles
		for(var i in this.poolManager.PlayerShoots)
		{
			if(this.poolManager.PlayerShoots[i] != null)
			{
				if( this.poolManager.PlayerShoots[i].isUsed)
				{
					this.poolManager.PlayerShoots[i].Draw(this.graphics,deltaTime);
				}
			}
		}
		for( var i in this.poolManager.LittleEnnemiesShoots)
		{
			if(this.poolManager.LittleEnnemiesShoots[i] != null)
			{
				if( this.poolManager.LittleEnnemiesShoots[i].isUsed)
				{
					this.poolManager.LittleEnnemiesShoots[i].Draw(this.graphics,deltaTime);
				}
			}
		}
		
		this.graphics.restore();
	}
	catch(e)
	{
		console.log(e.text);
	}
}

Game.prototype.UpdateTime = function()
{
	var deltaTime = Math.min(50,Date.now() - this.LastTime);
	deltaTime /= 1000;
	this.LastTime = Date.now();
	
	this.Update(deltaTime);
	this.Draw(deltaTime);
}

var CheckException = function(text)
{
	this.text = text;
}

/**** ../../web-static/src/js/game/HoriDrone.js ****/
var HoriDrone = function(game,img,width,height,left)
{
	GameObject.call(this,game,img,width,height);
	
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
var Player = function(game,img,width,height,type,fireRate)//Need all the things in the DB
{
	var _this = this;

	GameObject.call(this,game,img,width,height);

	this.keyList = {};
	
	this.diag = Math.sqrt(2)/2;
	this.speed = 200;

	this.drones = new Array(10);
	
	this.timeFire = 1/fireRate;
	this.canFire = true;
	this.timer = 0;

	for(var i = 0; i < 10 ; i++ )
	{
		this.drones[i] = new RadialDrone(this,"/spaceext-static/img/thing.png",10,10,80,2*Math.PI/10 * i);
	}

	this.LengthDrones = new Array(2);
	
	this.LengthDrones[0] = new HoriDrone(this,"/spaceext-static/img/thing.png",10,10,true);
	this.LengthDrones[1] = new HoriDrone(this,"/spaceext-static/img/thing.png",10,10,false);
	
	$(document).keyup(function(e){
		return _this.onKeyUp(e.which);		
	});
		
	$(document).keydown(function(e){
		return _this.onKeyDown(e.which);
	});
	
	
	this.radius = 10;
	this.radiusSquarred = 100;
	
	this.droneRadius = this.radius + 80;
	this.droneRadiusSquarred = square(this.droneRadius);
	
};

Player.prototype = new GameObject();

Player.prototype.Update = function(deltaTime)
{
	if(this.exists)
	{
		var X = 0;
		var Y = 0;
		
		if(this.canFire)
		{
			if(this.keyList[32])
			{
				var s = this.game.poolManager.GetPlayerShot();
				s.x = this.x;
				s.y = this.y;
	
				for(var i in this.LengthDrones)
				{
					if(this.LengthDrones[i] != null)
					{
						var c = this.game.poolManager.GetPlayerShot();
						c.x = this.x + this.LengthDrones[i].x;
						c.y = this.y + this.LengthDrones[i].y;
					}
				}
				this.canFire = false;
			}
		}
		else
		{
			this.timer += deltaTime;
			if(this.timer >= this.timeFire)
			{
				this.timer = 0;
				this.canFire = true;
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
		
		if(this.x <= -this.offsetX)
			this.x = -this.offsetX;
		else if(this.x >= 1024+this.offsetX)
			this.x = 1024+this.offsetX;
		
		if(this.y <= -this.offsetY)
			this.y = -this.offsetY;
		else if(this.y >= 600+this.offsetY)
			this.y = 600+this.offsetY;
		
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
}
Player.prototype.Draw = function(graphics, deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics,deltaTime);
	
	graphics.save();
	graphics.translate(this.x,this.y);
	
	for(var i in this.drones)
	{
		if(this.drones[i] != null)
			this.drones[i].Draw(graphics,deltaTime);
	}
	for(var i in this.LengthDrones)
	{
		if(this.LengthDrones[i] != null)
			this.LengthDrones[i].Draw(graphics,deltaTime);
	}
	
	graphics.restore();
};

Player.prototype.onKeyDown = function(k)
{
	this.keyList[k] = true;
	return k != 32;
};
Player.prototype.onKeyUp = function(k)
{
	this.keyList[k] = false;
	return k != 32;
};

/**** ../../web-static/src/js/game/Pool/PoolManager.js ****/
var PoolManager = function(game,nbrLittleShip,nbrShot)
{
	this.game = game;
	this.LittleEnnemies = new Array();
	this.PlayerShoots = new Array();
	this.LittleEnnemiesShoots = new Array();
	
	for( var i = 0; i < nbrLittleShip; i++)
	{
		this.LittleEnnemies[i] = new Ennemy(this.game,IMAGE_URL+"Ennemy.png",21,22);
	}
	
	this.GetLittleEnnemy = function()
	{
		for(var i in this.LittleEnnemies)
		{
			//console.log("getting ennemy : " + this.LittleEnnemies[i].isUsed);
			if(!this.LittleEnnemies[i].isUsed)
			{
				//console.log("not used ennemy");
				this.LittleEnnemies[i].isUsed = true;
				return this.LittleEnnemies[i];
			}
		}
		
		this.LittleEnnemies[this.LittleEnnemies.length] = new Ennemy(this.game,IMAGE_URL+"Ennemy.png",21,22);
		//console.log("created pool entity");
		this.LittleEnnemies[this.LittleEnnemies.length-1].isUsed = true;
		console.log("Little length : " + this.LittleEnnemies.length);
		//console.log("pool entity is used");
		return this.LittleEnnemies[this.LittleEnnemies.length-1]; 
	}
	
	this.GetPlayerShot = function()
	{
		for( var i in this.PlayerShoots)
		{
			if(!this.PlayerShoots[i].isUsed)
			{
				this.PlayerShoots[i].isUsed = true;
				//console.log("Shot legngth : " + this.PlayerShoots.length);
				return this.PlayerShoots[i];
			}
		}
		
		this.PlayerShoots[this.PlayerShoots.length] = new PlayerShot(this.game,IMAGE_URL+"Thing.png",10,10);
		//console.log("created pool entity");
		this.PlayerShoots[this.PlayerShoots.length-1].isUsed = true;
		//console.log("pool entity is used");
		//console.log("Shot legngth : " + this.PlayerShoots.length);
		return this.PlayerShoots[this.PlayerShoots.length-1];
	}
	
	this.GetLittleEnnemiesShot = function()
	{
		for( var i in this.LittleEnnemiesShoots)
		{
			if(!this.LittleEnnemiesShoots[i].isUsed)
			{
				this.LittleEnnemiesShoots[i].isUsed = true;
				//console.log("Shot legngth : " + this.PlayerShoots.length);
				return this.LittleEnnemiesShoots[i];
			}
		}
		
		this.LittleEnnemiesShoots[this.LittleEnnemiesShoots.length] = new EnnemyShot(this.game,IMAGE_URL+"Thing.png",10,10);
		//console.log("created pool entity");
		this.LittleEnnemiesShoots[this.LittleEnnemiesShoots.length-1].isUsed = true;
		//console.log("pool entity is used");
		//console.log("Shot legngth : " + this.PlayerShoots.length);
		return this.LittleEnnemiesShoots[this.LittleEnnemiesShoots.length-1];
	}
}



/**** ../../web-static/src/js/game/RadialDrone.js ****/
var RadialDrone = function(game,img,width,height,distance,startAngle)
{
	GameObject.call(this,game,img,width,height);
	
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

/**** ../../web-static/src/js/game/Shot/00-Shot.js ****/
var Shot = function(game,img,width,height)
{
	GameObject.call(this,game,img,width,height);	
}

Shot.prototype = new GameObject();

Shot.prototype.Draw = function(graphics,deltaTime)
{
	graphics.save();
	GameObject.prototype.Draw.call(this,graphics, deltaTime);
	graphics.restore();
	
}

/**** ../../web-static/src/js/game/Shot/EnnemyShot.js ****/
var EnnemyShot = function(game,img,width,height)
{
	Shot.call(this,game,img,width,height);
	
	this.direction = new Array();
}
EnnemyShot.prototype = new Shot();

EnnemyShot.prototype.Update = function(deltaTime)
{
	this.x += this.direction[0]*deltaTime * 500;
	this.y += this.direction[1]*deltaTime * 500;
	Shot.prototype.Update.call(this,deltaTime);
}
	
EnnemyShot.prototype.Draw = function(graphics,deltaTime)
{
	Shot.prototype.Draw.call(this,graphics,deltaTime);
}

/**** ../../web-static/src/js/game/Shot/PlayerShot.js ****/
var PlayerShot = function(game,img,width,height,direction)
{
	Shot.call(this,game,img,width,height);
}
PlayerShot.prototype = new Shot();

PlayerShot.prototype.Update = function(deltaTime)
{
	this.y -= 500 * deltaTime;
}

PlayerShot.prototype.Draw = function(graphics,deltaTime)
{
	Shot.prototype.Draw.call(this,graphics,deltaTime);
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


function Distance(sx,ex,sy,ey)
{
	return Math.sqrt(SquarredDistance(sx,ex,sy,ey));
}
function SquarredDistance(sx,ex,sy,ey)
{
	return square(sx-ex)+square(sy-ey);
}
function square(x)
{
	return x*x;
}


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