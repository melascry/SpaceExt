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