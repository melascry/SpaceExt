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