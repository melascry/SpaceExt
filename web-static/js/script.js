

/**** ../../web-static/src/js/.gitignore ****/


/**** ../../web-static/src/js/MathUtils.js ****/
var MathUtils = {

};

MathUtils.Squarre = function (x)
{
	return x*x;
};

MathUtils.SquarredDistance = function (sx,ex,sy,ey)
{
	return MathUtils.Squarre(sx-ex)+MathUtils.Squarre(sy-ey);
}

MathUtils.Distance = function (sx,ex,sy,ey)
{
	return Math.sqrt(MathUtils.SquarredDistance(sx,ex,sy,ey));
}


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
	
	this.radius =width/2;
	this.radiusSquarred = this.radius*this.radius;
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
var Ennemy = function(game,img,width,height,index)
{
	GameObject.call(this,game,img,width,height);
	
	this.timer = 0;
	
	this.FireTimer = 1;
	
	this.index = index; 
	this.life = 10; 
}

Ennemy.prototype = new GameObject();

Ennemy.prototype.Update = function(deltaTime)
{
	if(this.game.player != null)
	{
		this.timer += deltaTime;
		if(this.timer >= this.FireTimer)
		{
			var c = this.game.poolManager.GetLittleEnnemiesShot();
			c.x = this.x ;
			c.y = this.y ;
			var d = MathUtils.Distance(c.x,this.game.player.x,c.y,this.game.player.y);
	
			c.direction[0] = (this.game.player.x-c.x)/d;
			c.direction[1] = (this.game.player.y-c.y)/d;
			
			this.timer = 0;
		}
	}
	this.y += 50*deltaTime;
	
	GameObject.prototype.Update.call(this,deltaTime);

	if(this.y > this.game.canvas.height)
		this.isUsed = false;
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

Ennemy.prototype.Attacked = function(damage)
{
	this.life -= damage;
	if(this.life <= 0)
	{
		this.isUsed = false;
		this.life = 10;
	}
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
	
	this.canvas = document.getElementById("canvas");
	this.graphics = canvas.getContext("2d");
	
	this.poolManager = new PoolManager(this,1,1);

	this.player = new Player(this,IMAGE_URL+"ShooterSD.png",100,94,1,20);
	
	
	this.graphics.Check = function()
	{
		var i = Date.now() - this.drawTime;
		if(i >50)
		{
			throw(new CheckException("draw too long "));
		}
	};
	this.graphics.fillCircle = function(x, y, radius)
	{
		this.beginPath();
		this.arc(x,y,radius,0,2*Math.PI);
		this.closePath();
		this.fill();
	};
	this.graphics.strokeCircle = function(x,y,radius)
	{
		this.beginPath();
		this.arc(x,y,radius,0,2*Math.PI);
		this.closePath();
		this.stroke();
	};
	
	this.timerPopEnnemy = 1;
	this.timer = 0;

	this.pause = false;

	$(document).keydown(function(e){
		return _this.onKeyDown(e.which);
	});
}

Game.prototype.onKeyDown = function(e)
{
	if(e == 80)
		this.pause = !this.pause;
}

Game.prototype.Update = function(deltaTime)
{
	this.timer += deltaTime;
	if(this.timer >= this.timerPopEnnemy)
	{
		this.timer = 0;
		var ennemy = this.poolManager.GetLittleEnnemy();
		ennemy.PopInWorld();
	}
	
	/*var test = new Array();
	for(var i in this.poolManager.PlayerShoots)
		test[i] = this.poolManager.PlayerShoots[i].length;*/
	if(this.player != null && this.player.exists)
		this.player.Update(deltaTime);
	/*for(var i in test)
	{
		if(test[i] != this.poolManager.PlayerShoots[i].length)
			console.log("different :O");
	}*/
	
	for ( var i in this.poolManager.LittleEnnemies)
		if(this.poolManager.LittleEnnemies[i] != null)
			if( this.poolManager.LittleEnnemies[i].isUsed)
				if(this.poolManager.LittleEnnemies[i].exists)
					this.poolManager.LittleEnnemies[i].Update(deltaTime);
	
	for(var i in this.poolManager.PlayerShoots)
		if(this.poolManager.PlayerShoots[i] != null)
			for(var e in this.poolManager.PlayerShoots[i])
				if(this.poolManager.PlayerShoots[i][e].isUsed)
					if(this.poolManager.PlayerShoots[i][e].exists)
						this.poolManager.PlayerShoots[i][e].Update(deltaTime);

	for(var i in this.poolManager.DroneShoots)
		if(this.poolManager.DroneShoots[i] != null)
			if( this.poolManager.DroneShoots[i].isUsed)
				if(this.poolManager.DroneShoots[i].exists)
					this.poolManager.DroneShoots[i].Update(deltaTime);
	
	for( var i in this.poolManager.LittleEnnemiesShoots)
		if(this.poolManager.LittleEnnemiesShoots[i] != null)
			if( this.poolManager.LittleEnnemiesShoots[i].isUsed)
				if(this.poolManager.LittleEnnemiesShoots[i].exists)
					this.poolManager.LittleEnnemiesShoots[i].Update(deltaTime);
}

Game.prototype.Draw = function(deltaTime)
{
	this.graphics.drawTime = Date.now();
	try
	{
		this.graphics.save();
		this.graphics.fillStyle = 'black';
		this.graphics.fillRect(0,0,this.canvas.width,this.canvas.height);
	
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
			if(this.poolManager.PlayerShoots[i] != null)
				for(var e in this.poolManager.PlayerShoots[i])
					if( this.poolManager.PlayerShoots[i][e].isUsed)
						this.poolManager.PlayerShoots[i][e].Draw(this.graphics,deltaTime);

		for(var i in this.poolManager.DroneShoots)
			if(this.poolManager.DroneShoots[i] != null)
				if( this.poolManager.DroneShoots[i].isUsed)
					if(this.poolManager.DroneShoots[i].visible)
						this.poolManager.DroneShoots[i].Draw(this.graphics,deltaTime);
		
		for( var i in this.poolManager.LittleEnnemiesShoots)
			if(this.poolManager.LittleEnnemiesShoots[i] != null)
				if( this.poolManager.LittleEnnemiesShoots[i].isUsed)
					this.poolManager.LittleEnnemiesShoots[i].Draw(this.graphics,deltaTime);
		
		this.graphics.restore();
	}
	catch(e)
	{
		console.log(e);
	}
}

Game.prototype.UpdateTime = function()
{
	var deltaTime = Math.min(50,Date.now() - this.LastTime);
	deltaTime /= 1000;
	this.LastTime = Date.now();
	
	if(!this.pause)
	{
		this.Update(deltaTime);
		this.Draw(deltaTime);
	}
}

var CheckException = function(text)
{
	this.text = text;
}

/**** ../../web-static/src/js/game/HoriDrone.js ****/
var HoriDrone = function(game,img,width,height,left,fireRate)
{
	GameObject.call(this,game,img,width,height);
	
	this.x = left?-100:100;
	this.y = 0;
	
	this.canFire = true;
	this.timerFire = 1/fireRate;
	this.timer = 0;
	this.ammo = 100;
}

HoriDrone.prototype = new GameObject();

HoriDrone.prototype.Update = function(deltaTime)
{
	if(!this.canFire)
	{
		this.timer += deltaTime;
		if(this.timer >= this.timerFire)
		{
			this.timer = 0;
			this.canFire = true;
		}
	}
	GameObject.prototype.Update.call(this,deltaTime);
};

HoriDrone.prototype.Draw = function(graphics,deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics,deltaTime);
}

HoriDrone.prototype.Fire = function()
{
	if(this.ammo > 0)
	{
		this.canFire = false;
		this.ammo--;
		
		var c = this.game.poolManager.GetDroneShot();
		c.x = this.x + this.game.player.x;
		c.y = this.y + this.game.player.y;
	}
}

/**** ../../web-static/src/js/game/Player.js ****/
var Player = function(game,img,width,height,type,fireRate)//Need all the things in the DB
{
	var _this = this;

	GameObject.call(this,game,img,width,height);

	this.ship = new Ship(this.game,1,1);
	
	this.keyList = {};
	
	this.diag = Math.sqrt(2)/2;
	this.speed = 300;

	this.drones = new Array();
	
	this.timeFire = 1/fireRate;
	this.canFire = true;
	this.timer = 0;

	for(var i = 0; i < 10 ; i++ )
	{
		this.drones[i] = new RadialDrone(this.game,"/spaceext-static/img/thing.png",10,10,80,2*Math.PI/10 * i);
	}

	this.LengthDrones = new Array();
	
	//this.LengthDrones[0] = new HoriDrone(this.game,"/spaceext-static/img/thing.png",10,10,true,20);
	//this.LengthDrones[1] = new HoriDrone(this.game,"/spaceext-static/img/thing.png",10,10,false,20);
	
	$(document).keyup(function(e){
		return _this.onKeyUp(e.which);		
	});
		
	$(document).keydown(function(e){
		return _this.onKeyDown(e.which);
	});
	
	
	this.radius = 10;
	this.radiusSquarred = 100;
	
	this.droneRadius = this.radius + 80;
	this.droneRadiusSquarred = MathUtils.Squarre(this.droneRadius);
	
};

Player.prototype = new GameObject();

Player.prototype.Update = function(deltaTime)
{
	var pool = this.game.poolManager;
	
	if(this.exists)
	{
		var X = 0;
		var Y = 0;
		
		//this.ship.Shoot();
		if(this.canFire)
		{
			if(this.keyList[32])
			{
				var s = pool.GetPlayerShot();
				//console.log(s.length);
				for(var i in s)
				{
					//console.log(s[i]);
					
					s[i].x = this.x + this.ship.ShootPosition[i][0];
					s[i].y = this.y + this.ship.ShootPosition[i][1];
				}
				//console.log(s);
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
		
		if(this.keyList[32])
			for(var i  in this.LengthDrones)	
				if(this.LengthDrones[i] != null)
					if(this.LengthDrones[i].canFire)
						this.LengthDrones[i].Fire();
		
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
		else if(this.x >= this.game.canvas.width + this.offsetX)
			this.x = this.game.canvas.width + this.offsetX;
		
		if(this.y <= -this.offsetY)
			this.y = -this.offsetY;
		else if(this.y >= this.game.canvas.height + this.offsetY)
			this.y = this.game.canvas.height + this.offsetY;
		
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
	
	this.TestPhysique(pool);
	
}

Player.prototype.TestPhysique = function(pool)
{
	for(var i in pool.PlayerShoots)
	{
		if(pool.PlayerShoots[i] != null)
		{
			for(var j in pool.PlayerShoots[i])
			{
				if(pool.PlayerShoots[i][j].isUsed)
				{
					for ( var e in pool.LittleEnnemies)
					{
						if(pool.LittleEnnemies[e].isUsed)
						{
							var distance = MathUtils.SquarredDistance(pool.LittleEnnemies[e].x, pool.PlayerShoots[i][j].x, pool.LittleEnnemies[e].y, pool.PlayerShoots[i][j].y);
							/*
							if(pool.PlayerShoots[i][j].x < pool.LittleEnnemies[e].x)
								if(pool.PlayerShoots[i][j].x + pool.PlayerShoots[i][j].width > pool.LittleEnnemies[e].x + pool.LittleEnnemies[e].width)
									if(pool.PlayerShoots[i][j].y < pool.LittleEnnemies[e].y)
										if(pool.PlayerShoots[i][j].y + pool.PlayerShoots[i][j].height> pool.LittleEnnemies[e].y + pool.LittleEnnemies[e].height)
											{
												pool.LittleEnnemies[e].isUsed = false;
												pool.PlayerShoots[i][j].isUsed = false;
											}*/
							if(distance <= pool.PlayerShoots[i][j].radiusSquarred + pool.LittleEnnemies[e].radiusSquarred)
							{
								pool.LittleEnnemies[e].Attacked(pool.PlayerShoots[i][j].damage);
								pool.PlayerShoots[i][j].isUsed = false;							
							}
						}
					}
				}
			}
		}
	}
	
	for(var i in pool.DroneShoots)
	{
		if(pool.DroneShoots[i] != null)
		{
			if(pool.DroneShoots[i].isUsed)
			{
				for ( var e in pool.LittleEnnemies)
				{
					if(pool.LittleEnnemies[e].isUsed)
					{
						var distance = MathUtils.SquarredDistance(pool.LittleEnnemies[e].x, pool.DroneShoots[i].x, pool.LittleEnnemies[e].y, pool.DroneShoots[i].y);
						
						if(distance <= pool.DroneShoots[i].radiusSquarred + pool.LittleEnnemies[e].radiusSquarred)
						{
							pool.LittleEnnemies[e].isUsed = false;
							pool.DroneShoots[i].isUsed = false;							
						}
					}
				}
			}
			
		}
	}
	
	for( var i in pool.LittleEnnemiesShoots)
	{
		if(pool.LittleEnnemiesShoots[i] != null)
		{
			if( pool.LittleEnnemiesShoots[i].isUsed)
			{
				var distance = MathUtils.SquarredDistance(this.x,pool.LittleEnnemiesShoots[i].x,this.y,pool.LittleEnnemiesShoots[i].y);
				
				//Test for all drones
				for(var e in this.drones)
				{
					if(distance <= pool.LittleEnnemiesShoots[i].radiusSquarred + this.droneRadiusSquarred + this.drones[e].radiusSquarred)
					{
						var distanceD = MathUtils.SquarredDistance(this.drones[e].x+this.x,pool.LittleEnnemiesShoots[i].x,this.drones[e].y+this.y,pool.LittleEnnemiesShoots[i].y);

						if(distanceD <= pool.LittleEnnemiesShoots[i].radiusSquarred + this.drones[e].radiusSquarred)
						{
							pool.LittleEnnemiesShoots[i].isUsed = false;
							this.drones[e].alive = false;
						}
					}
					if(distance <= pool.LittleEnnemiesShoots[i].radiusSquarred + this.radiusSquarred)
					{
						this.exists = false;
						pool.LittleEnnemiesShoots[i].isUsed = false;
					}
				}
			}			
		}
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
			if(this.drones[i].visible)
				this.drones[i].Draw(graphics,deltaTime);
	}
	for(var i in this.LengthDrones)
	{
		if(this.LengthDrones[i] != null)
			if(this.LengthDrones[i].visible)
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
var PoolManager = function(game,PlayerType,PlayerLevel,nbrLittleShip,nbrShot)
{
	this.game = game;
	this.LittleEnnemies = new Array();
	
	this.PlayerShoots = new Array();
	this.DroneShoots = new Array();
	
	this.LittleEnnemiesShoots = new Array();
	this.Ennemies = new Array();
	
	
	for( var i = 0; i < nbrLittleShip; i++)
	{
		this.LittleEnnemies[i] = new Ennemy(this.game,IMAGE_URL+"Ennemy.png",21,22);
	}
	/*
	this.GetEnnemy = function(index)
	{
		for(var i in this.Ennemy[index])
		{
			if(!this.Ennemy[index][i].isUsed)
			{
				this.Ennemy[index][i].isUsed = true;
				return this.Ennemy[index][i];
			}
		}
		
		this.Ennemy[index][this.Ennemy[index].length] = new Ennemy(this.game,IMAGE_URL+"Ennemy.png",21,22,index);
	}*/
	this.GetLittleEnnemy = function()
	{
		for( var i = 0 ; i < this.LittleEnnemies.length; i++)
		{
			//console.log("getting ennemy : " + this.LittleEnnemies[i].isUsed);
			if(!this.LittleEnnemies[i].isUsed)
			{
				//console.log("not used ennemy");
				this.LittleEnnemies[i].isUsed = true;
				return this.LittleEnnemies[i];
			}
		}
		
		this.LittleEnnemies[this.LittleEnnemies.length] = new Ennemy(this.game,IMAGE_URL+"Ennemy.png",21,22,EnnemiesIndices.LITTLE);
		//console.log("created pool entity");
		this.LittleEnnemies[this.LittleEnnemies.length-1].isUsed = true;
		//console.log("Little length : " + this.LittleEnnemies.length);
		//console.log("pool entity is used");
		return this.LittleEnnemies[this.LittleEnnemies.length-1]; 
	}
	
	this.GetDroneShot = function()
	{
		for( var i = 0 ; i < this.DroneShoots.length; i++)
		{
			if(!this.DroneShoots[i].isUsed)
			{
				this.DroneShoots[i].isUsed = true;
				//console.log("Shot length : " + this.PlayerShoots.length);
				return this.DroneShoots[i];
			}
		}
		this.DroneShoots[this.DroneShoots.length] = new DroneShot(this.game,IMAGE_URL+"Thing.png",10,10,1)
		//console.log("created pool entity");
		this.DroneShoots[this.DroneShoots.length-1].isUsed = true;
		//console.log("pool entity is used");
		//console.log("Shot legngth : " + this.PlayerShoots.length);
		return this.DroneShoots[this.DroneShoots.length-1];
	}
	
	this.GetPlayerShot = function()
	{
		for( var i in this.PlayerShoots)
		{
			var isOk = true;
			//console.log(this.PlayerShoots[i]);
			for(var e =0; e < this.PlayerShoots[i].length; e++)
			{
				//console.log(this.PlayerShoots[i]);
				if(this.PlayerShoots[i][e].isUsed)
				{
					isOk = false;
				}
				//console.log(this.PlayerShoots[i]);
			}

			
			if(isOk)
			{
				//console.log(this.PlayerShoots[i]);
				for(var e =0; e < this.PlayerShoots[i].length; e++)
				{
					//console.log(e + " : " + this.PlayerShoots[i][e]);
					this.PlayerShoots[i][e].isUsed = true;
				}
				//console.log("Shot length : " + this.PlayerShoots.length);
				//console.log(this.PlayerShoots[i]);
				
				return this.PlayerShoots[i];
			}
		}
		
		this.PlayerShoots[this.PlayerShoots.length] = new Array();
		for(var i = 0 ; i < this.game.player.ship.ShootPosition.length ;i++)
		{
			this.PlayerShoots[this.PlayerShoots.length-1][i] =
				new PlayerShot(
								this.game
								,null
								,20
								,20
								,this.game.player.ship.ShootDamage[i]
								,this.game.player.ship.ShootDirection[i]
								);
			
			
			this.PlayerShoots[this.PlayerShoots.length-1][i].isUsed = true;
		}
		//console.log(this.PlayerShoots[this.PlayerShoots.length-1]);
		return this.PlayerShoots[this.PlayerShoots.length-1];
	}
	
	this.GetLittleEnnemiesShot = function()
	{
		for( var i = 0 ; i < this.LittleEnnemiesShoots.length ; i++)
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
	this.radialSpeed = 6;
	
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
	this.angle += this.radialSpeed*deltaTime;
	
	this.x = Math.cos(this.angle)*this.distance;
	this.y = Math.sin(this.angle)*this.distance;
	
	if(!this.alive)
	{
		this.timerRevive += deltaTime;
		if(this.timerRevive >= this.TimeToRevive)
		{
			this.timerRevive = 0;
			this.alive = true;
		}
	}

	GameObject.prototype.Update.call(this,deltaTime);
}
RadialDrone.prototype.Draw = function(graphics,deltaTime)
{
	if(this.alive)
	{
		GameObject.prototype.Draw.call(this,graphics,deltaTime);
	}
}

/**** ../../web-static/src/js/game/Ship/00-Ship.js ****/
var Ship = function(game,type,level)//Initialize with the DB
{
	if(typeof(game) == "undefined")
		return;
	
	this.ShootPosition = new Array();
	this.ShootDirection = new Array();
	this.ShootDamage = new Array();
	
	for(var i = 0 ; i < 3; i++)
	{
		this.ShootPosition[i] = [-20+20*i,50];
		this.ShootDirection[i] = [-1+i,-1];
		var d = Math.sqrt( MathUtils.Squarre(this.ShootDirection[i][0])+ MathUtils.Squarre(this.ShootDirection[i][1]));
		this.ShootDirection[i][0] /= d;
		this.ShootDirection[i][1] /= d;
	}
	this.ShootDamage = [0.5*level,1*level,0.5*level];
	/*
this.Sources = new Array();
	
	for(var i = 0 ; i < 3; i++)
	{
		var direc;
		
		direc[i] = [-1+i,-1];
		var d = Math.sqrt( MathUtils.Squarre(direc[i][0])+ MathUtils.Squarre(direc[i][1]));
		direc[i][0] /= d;
		direc[i][1] /= d;
		this.Sources[i] = new ShootSource(game,IMAGE_URL+"Ennemy.png",21,22,direc,level * (0.5+i/2));
		this.Sources[i].x = -20+20*i;
		this.Sources[i].y = 50;
	}*/
}

/**** ../../web-static/src/js/game/Ship/Bullet.js ****/
var Bullet = function(game,level)
{
	Ship.call(this,game);
}

Bullet.prototype = new Ship();

/**** ../../web-static/src/js/game/Ship/Lazer.js ****/
var Lazer = function(game,level)
{
	Ship.call(this,game);
}

Lazer.prototype = new Ship(); 

/**** ../../web-static/src/js/game/Shot/00-Shot.js ****/
var Shot = function(game,img,width,height,damage)
{
	GameObject.call(this,game,img,width,height);
	
	this.damage = damage;
}

Shot.prototype = new GameObject();

Shot.prototype.Draw = function(graphics,deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics, deltaTime);	
}

/**** ../../web-static/src/js/game/Shot/BulletShot.js ****/
var BulletShot = function(game,img,width,height,damage,direction)
{
	Shot.call(this,game,img,width,height,damage);

	this.direction = direction;
	
	this.gradient = document.createElement('canvas');
	this.gradient.style.background = 'transparent';
	this.gradient.width = width;
	this.gradient.height = height;	
	this.gradContext = this.gradient.getContext("2d");

	var decal = 0.15;
	var radiusDraw = this.radius*0.9;
	this.gradContext.translate(this.gradient.width/2,this.gradient.width/2);
	this.gradContext.rotate( Math.atan2(direction[1],direction[0]) + Math.PI / 2);
	this.gradContext.translate(0,Math.round(radiusDraw*decal));
	var hue = 70;
	
    // create radial gradient
    this.grad = this.gradContext.createRadialGradient(0,Math.round( radiusDraw*decal),Math.round( radiusDraw*(1-decal)), 0, 0, Math.round(radiusDraw));
    // light blue
//    this.grad.addColorStop(0, 'rgba(0,0,200,0)');
//    // dark blue
//    this.grad.addColorStop(0.9, 'rgba(150,150,255,0.9)');
//    this.grad.addColorStop(1, 'rgba(200,200,255,1)');
    this.grad.addColorStop(0, 'hsla('+hue+',100%,30%,0)');
    // dark blue
    this.grad.addColorStop(0.8, 'hsla('+hue+',100%,40%,0.9)');
    this.grad.addColorStop(1, 'hsla('+hue+',100%,75%,1)');

    this.gradContext.fillStyle = this.grad;
    
    this.gradContext.beginPath();
    this.gradContext.arc(0, Math.round(-radiusDraw*decal),Math.round(radiusDraw),0,2*Math.PI);
    this.gradContext.closePath();
    this.gradContext.fill();
}

BulletShot.prototype = new Shot();

BulletShot.prototype.Update = function(deltaTime)
{
	this.x += this.direction[0]*deltaTime * 1000;
	this.y += this.direction[1]*deltaTime * 1000;
}

/**** ../../web-static/src/js/game/Shot/DroneShot.js ****/
var DroneShot = function (game,img,width,height,damage)
{
	Shot.call(this,game,img,width,height,damage);
}

DroneShot.prototype = new Shot();

DroneShot.prototype.Update = function(deltaTime)
{

	this.y -= 1000 * deltaTime;
	
	if(this.y <= 0 )
		this.isUsed = false;
}

DroneShot.prototype.Draw = function(graphics,deltaTime)
{
	Shot.prototype.Draw.call(this,graphics,deltaTime);
}

/**** ../../web-static/src/js/game/Shot/EnnemyShot.js ****/
var EnnemyShot = function(game,img,width,height,damage)
{
	Shot.call(this,game,img,width,height,damage);
	
	this.gradient = document.createElement('canvas');
	this.gradient.style.background = 'transparent';
	this.gradient.width = width;
	this.gradient.height = height;
	this.gradContext = this.gradient.getContext("2d");
	
	this.gradContext.translate(width/2,height/2);
	
	this.grad = this.gradContext.createRadialGradient(0, 0, 0, 0, 0, this.radius);

/*
	this.grad.addColorStop(0.4, 'rgba(0,76,179,0.8)');
	this.grad.addColorStop(1, 'rgba(140,208,255,0.9)');
	//*/
	//*
	this.grad.addColorStop(0, 'rgba(102,0,0,1)');
	this.grad.addColorStop(0.2, 'rgba(150,0,0,0.9)');
	this.grad.addColorStop(0.4, 'rgba(200,0,0,0.8)');
	this.grad.addColorStop(0.6, 'rgba(255,0,0,0.7)');
	this.grad.addColorStop(1, 'rgba(255,0,0,0.5)');
//*/
	/*
	this.grad.addColorStop(0.4, 'rgba(0,76,179,0.8)');
	this.grad.addColorStop(1, 'rgba(140,208,255,0.9)');
	//*/
	this.gradContext.fillStyle = this.grad;
	this.gradContext.fillCircle = function(x, y, radius)
	{
		this.beginPath();
		this.arc(x,y,radius,0,2*Math.PI);
		this.closePath();
		this.fill();
	};

	this.gradContext.fillCircle(0,0,this.radius);
		
	this.direction = new Array();
}
EnnemyShot.prototype = new Shot();

EnnemyShot.prototype.Update = function(deltaTime)
{
	this.x += this.direction[0]*deltaTime * 500;
	this.y += this.direction[1]*deltaTime * 500;
	Shot.prototype.Update.call(this,deltaTime);
	
	if(this.x > this.game.canvas.width || this.x < 0+ this.offsetX*2 || this.y < 0+ this.offsetY*2 || this.y > this.game.canvas.height)
	{
		this.isUsed = false;
	}
}

EnnemyShot.prototype.Draw = function(graphics,deltaTime)
{
	graphics.save();
	graphics.Check();
	graphics.translate(this.x+this.offsetX,this.y+this.offsetY);

	graphics.drawImage(this.gradient,0,0);
	
	graphics.restore();
}

/**** ../../web-static/src/js/game/Shot/PlayerShot.js ****/
var PlayerShot = function(game,img,width,height,damage,direction)
{
	Shot.call(this,game,img,width,height,damage);

	this.direction = direction;	
	
	this.gradient = document.createElement('canvas');
	this.gradient.style.background = 'transparent';
	this.gradient.width = width;
	this.gradient.height = height;	
	this.gradContext = this.gradient.getContext("2d");

	var decal = 0.15;
	var radiusDraw = this.radius*0.9;
	this.gradContext.translate(this.gradient.width/2,this.gradient.width/2);
	this.gradContext.rotate( Math.atan2(direction[1],direction[0]) + Math.PI / 2);
	this.gradContext.translate(0,Math.round(radiusDraw*decal));

	/*this.grad = this.gradContext.createRadialGradient(0,  0 , this.radius*0.1, -this.radius * direction[0], this.gradient.height - this.radius * direction[1], this.radius);
	
	this.grad.addColorStop(0, 'rgba(255,0,0,1)');
	this.grad.addColorStop(1, 'rgba(255,0,0,1)');

	this.gradContext.fillStyle = this.grad;
	this.gradContext.fillCircle = function(x, y, radius)
	{
		this.beginPath();
		this.arc(x,y,radius,0,2*Math.PI);
		this.closePath();
		this.fill();
	};
	 */
	//this.gradContext.fillCircle(0,0,this.radius);
	/*
	this.gradContext.beginPath();
	this.gradContext.lineTo(-5,5);
	this.gradContext.lineTo(5,5);
	this.gradContext.lineTo(0,0);
	this.gradContext.closePath();
	this.gradContext.fill();
	*/

	var hue = 70;
	
    // create radial gradient
    this.grad = this.gradContext.createRadialGradient(0,Math.round( radiusDraw*decal),Math.round( radiusDraw*(1-decal)), 0, 0, Math.round(radiusDraw));
    // light blue
//    this.grad.addColorStop(0, 'rgba(0,0,200,0)');
//    // dark blue
//    this.grad.addColorStop(0.9, 'rgba(150,150,255,0.9)');
//    this.grad.addColorStop(1, 'rgba(200,200,255,1)');
    this.grad.addColorStop(0, 'hsla('+hue+',100%,30%,0)');
    // dark blue
    this.grad.addColorStop(0.8, 'hsla('+hue+',100%,40%,0.9)');
    this.grad.addColorStop(1, 'hsla('+hue+',100%,75%,1)');

    this.gradContext.fillStyle = this.grad;
    
    this.gradContext.beginPath();
    this.gradContext.arc(0, Math.round(-radiusDraw*decal),Math.round(radiusDraw),0,2*Math.PI);
    this.gradContext.closePath();
    this.gradContext.fill();
	
}
PlayerShot.prototype = new Shot();

PlayerShot.prototype.Update = function(deltaTime)
{

	this.x += this.direction[0] * 1000 * deltaTime;
	this.y += this.direction[1] * 1000 * deltaTime;
	
	if(this.y <= 0 )
		this.isUsed = false;
}

PlayerShot.prototype.Draw = function(graphics,deltaTime)
{
	//Shot.prototype.Draw.call(this,graphics,deltaTime);
	graphics.save();
	graphics.Check();
	graphics.translate(this.x+this.offsetX,this.y+this.offsetY);
	
	graphics.drawImage(this.gradient,0,0);
	
	graphics.restore();
}

// laser
function testLaser(){
	var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    context.rect(0, 0, canvas.width, canvas.height);
      //context.rotate(Math.PI/2);

    // Corps laser
      var laser = document.createElement('canvas');
      laser.width = 100;
      laser.height = 1;
      var laserContext = laser.getContext('2d');
    laserContext.rect(0, 0, laser.width, laser.height);
    // create radial gradient
    var grd = laserContext.createLinearGradient(0, 0, 100, 0);
    // light blue
    grd.addColorStop(0.0, 'rgba(50,50,255,0)');
    // dark blue
    grd.addColorStop(0.5, 'rgba(255,255,255,1)');
    grd.addColorStop(01, 'rgba(50,50,255,0)');

    laserContext.fillStyle = grd;
	laserContext.fill();
	
	// Dessin du laser (hauteur variable)
      context.drawImage(laser, 0, 50, 100, 200);
      
      
      // Tête laser
      context.translate(50, 50);
      var hue = 200;
	radiusDraw=50;
      decal = 0.15;
    // create radial gradient
    grad = context.createRadialGradient(0,
       0,
   Math.round( radiusDraw*0.05), 0, 0, 
            Math.round(radiusDraw));
    // light blue
//    this.grad.addColorStop(0, 'rgba(0,0,200,0)');
//    // dark blue
//    this.grad.addColorStop(0.9, 'rgba(150,150,255,0.9)');
//    this.grad.addColorStop(1, 'rgba(200,200,255,1)');
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    // dark blue
    grad.addColorStop(1, 'rgba(50,50,255,0)');

    context.fillStyle = grad;
    
    context.beginPath();
    context.arc(0, 0,
                Math.round(radiusDraw),0,Math.PI, true);
    context.closePath();
    context.fill();
}

/**** ../../web-static/src/js/game/ShotSource/00-ShootSource.js ****/
var ShootSource = function(game,img,width,height,direction,damage)
{
	GameObject.call(this,game,img,width,height);

	this.shootDirection = direction
	this.damage = damage;
}

ShootSource.prototype = new GameObject();

ShootSource.prototype.Draw(graphics, deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics,deltaTime);
}

ShootSource.prototpe.Shoot()
{
	
}

/**** ../../web-static/src/js/main.js ****/
var game;

EnnemiesIndices = 
{
	LITTLE :0,
	MEDIUM : 1,
	BIG : 2,
	BOSS : 3,
	END : 4
}

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