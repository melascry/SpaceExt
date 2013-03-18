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