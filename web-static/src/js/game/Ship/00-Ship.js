var Ship = function(game,parent,img,width,height,type,level)//Initialize with the DB
{
	if(typeof(game) == "undefined")
		return;
	
	GameObject.call(this,game,parent,img,width,height);
	this.SS = new  Array();

	this.ShootDamage = new Array();
	
	for(var i = 0 ; i < 3; i++)
	{

		var ShootDirection = [-1+i,-1];
		var d = Math.sqrt( MathUtils.Squarre(ShootDirection[0])+ MathUtils.Squarre(ShootDirection[1]));
		ShootDirection[0] /= d;
		ShootDirection[1] /= d;

		this.SS[i*2] = new ShotSource(this.game,this,IMAGE_URL+"ShotSource.png", 10,10,30,1,ShootDirection,[-20+20*i, -30*Math.sin(Math.PI/2 * (i))]);
		//this.SS[i*2+1] = new ShotSource(this.game,this,IMAGE_URL+"ShotSource.png", 10,10,30,1,ShootDirection,[-20+20*i, -30*Math.sin(Math.PI/2 * (i)) ]);
	}
	this.ShootDamage = [0.5*level,1*level,0.5*level];

	this.drones = new Array();
	
	this.radius = 10;
	this.radiusSquarred = 100;
	this.collectibleRadius = 25;
	
	this.droneRadius = this.radius + 50;
	this.droneRadiusSquarred = MathUtils.Squarre(this.droneRadius);
	
	for(var i = 0; i < 10 ; i++ )
	{
		this.drones[i] = new RadialDrone(this.game,this,"/spaceext-static/img/thing.png",10,10,this.droneRadius,2*Math.PI/10 * i);
	}
	//this.LengthDrones[0] = new HoriDrone(this.game,"/spaceext-static/img/thing.png",10,10,true,20);
	//this.LengthDrones[1] = new HoriDrone(this.game,"/spaceext-static/img/thing.png",10,10,false,20);
}

Ship.prototype = new GameObject();

Ship.prototype.Fire = function()
{
	for(i in this.SS)
	{
		this.SS[i].Fire();
	}
	for(var i in this.LengthDrones)	
		if(this.LengthDrones[i] != null)
			if(this.LengthDrones[i].canFire)
				this.LengthDrones[i].Fire();
}

Ship.prototype.Update = function (deltaTime)
{
	GameObject.prototype.Update.call(this, deltaTime);
}

Ship.prototype.Draw = function (graphics,deltaTime)
{
	graphics.save();
	graphics.translate(this.x,this.y);
	
	graphics.drawImage(this.img,this.offsetX, this.offsetY);

	//* only for debug
	graphics.strokeStyle = "#F00";
	graphics.strokeCircle(0,0, this.radius);
	graphics.strokeStyle = "#FF0";
	graphics.strokeCircle(0,0, this.collectibleRadius);
	graphics.strokeStyle = "#0F0";
	graphics.strokeCircle(0,0, this.droneRadius);
	graphics.strokeStyle = "#00F";
	graphics.strokeCircle(0,0, this.droneRadius + this.children[0].radius);
	//*/
	
	GameObject.prototype.Draw.call(this,graphics, deltaTime);
	
	graphics.restore();
}


Ship.prototype.Die = function()
{
	GameObject.prototype.Die.call(this);
}