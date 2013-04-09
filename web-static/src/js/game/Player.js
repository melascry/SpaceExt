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