var Player = function(game,parent,img,width,height,type,ship)//Need all the things in the DB
{
	var _this = this;

	GameObject.call(this,game,parent,img,width,height);

	this.ship = ship;
	
	this.keyList = {};
	
	this.diag = Math.sqrt(2)/2;
	this.speed = 400;

	this.drones = new Array();

	this.x = 512;
	this.y = 300;
	
	this.canFire = true;
	this.timer = 0;

	
	this.radius = 10;
	this.radiusSquarred = 100;
	
	this.droneRadius = this.radius + 80;
	this.droneRadiusSquarred = MathUtils.Squarre(this.droneRadius);
	
	for(var i = 0; i < 10 ; i++ )
	{
		this.children[i] = new RadialDrone(this.game,this,"/spaceext-static/img/thing.png",10,10,this.droneRadius,2*Math.PI/10 * i);
		this.drones[i] = this.children[i]; 
	}
	//this.LengthDrones[0] = new HoriDrone(this.game,"/spaceext-static/img/thing.png",10,10,true,20);
	//this.LengthDrones[1] = new HoriDrone(this.game,"/spaceext-static/img/thing.png",10,10,false,20);
	
	$(document).keyup(function(e){
		return _this.onKeyUp(e.which);		
	});
		
	$(document).keydown(function(e){
		return _this.onKeyDown(e.which);
	});
	
	
};

Player.prototype = new GameObject();

Player.prototype.Update = function(deltaTime)
{	
	if(this.exists)
	{
		var X = 0;
		var Y = 0;
		
		if(this.keyList[32])
		{
			this.ship.Fire();
			
			for(var i  in this.LengthDrones)	
				if(this.LengthDrones[i] != null)
					if(this.LengthDrones[i].canFire)
						this.LengthDrones[i].Fire();
		}
			
		
		// Q
		if(this.keyList[113] || this.keyList[81] || this.keyList[37])
		{
			this.revertDirection = true;
			X -= 1;
		}
		// S
		if(this.keyList[115] || this.keyList[83] || this.keyList[40])
		{
			Y += 1;
		}
		// D
		if(this.keyList[100] || this.keyList[68] || this.keyList[39])
		{
			X += 1;
		}
		// Z
		if(this.keyList[122] || this.keyList[90] || this.keyList[38])
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
		
	}

	GameObject.prototype.Update.call(this,deltaTime);
}
/*
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
					
				}
			}
		}
	}
}
*/
Player.prototype.Draw = function(graphics, deltaTime)
{
	graphics.save();
	graphics.translate(this.x,this.y);
	
	graphics.strokeStyle = "#F00";
	graphics.strokeCircle(0,0, this.radius);
	graphics.strokeStyle = "#0F0";
	graphics.strokeCircle(0,0, this.droneRadius);
	graphics.strokeStyle = "#00F";
	graphics.strokeCircle(0,0, this.droneRadius + this.children[0].radius);
	
	GameObject.prototype.Draw.call(this,graphics,deltaTime);
	
	graphics.restore();
};

Player.prototype.onKeyDown = function(k)
{
	this.keyList[k] = true;
	return k != 32 && k != 37 && k != 38 && k != 39 && k != 40;
};
Player.prototype.onKeyUp = function(k)
{
	this.keyList[k] = false;
	return k != 32 && k != 37 && k != 38 && k != 39 && k != 40;
};