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