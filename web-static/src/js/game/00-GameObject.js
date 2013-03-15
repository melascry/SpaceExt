var GameObject = function(img,width,height)
{
	if(typeof(img) == "undefined"){
		return;
	}
	
	this.img = document.createElement('image');
	this.img.src = img;
	
	this.offsetX = width/2;
	this.offsetY = height/2;
	
	this.x = 512;
	this.y = 300;
	
	this.drawX = this.x - this.offsetX;
	this.drawY = this.y - this.offsetY;
	
	this.life = 1;
	
};
GameObject.prototype.Update = function(deltaTime)
{
	this.drawX = this.x - this.offsetX;
	this.drawY = this.y - this.offsetY;
	
	if(this.life <=0)
	{
		this.Die();
	}
};
GameObject.prototype.Draw = function(graphics,deltaTime)
{
	graphics.drawImage(this.img,this.drawX,this.drawY);
};

GameObject.prototype.Die = function()
{
	delete this;
};