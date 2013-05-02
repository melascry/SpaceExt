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

		this.SS[i] = new ShotSource(this.game,this,IMAGE_URL+"ShotSource.png", 10,10,10,1,ShootDirection,[-20+20*i, -30*Math.sin(Math.PI/2 * i)]);
		this.AddChild(this.SS[i]);
	}
	this.ShootDamage = [0.5*level,1*level,0.5*level];
}

Ship.prototype = new GameObject();

Ship.prototype.Fire = function()
{	
	for(i in this.SS)
	{
		this.SS[i].Fire();
	}
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
	
	GameObject.prototype.Draw.call(this,graphics, deltaTime);
	
	graphics.restore();
}