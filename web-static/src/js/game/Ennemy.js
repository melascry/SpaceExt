var Ennemy = function(game,parent,img,width,height,index)
{
	GameObject.call(this,game,parent,img,width,height);
	
	this.timer = 0;
	
	this.FireTimer = 0.05;
	
	this.index = index; 
	this.life = 1; 
}

Ennemy.prototype = new GameObject();

Ennemy.prototype.Update = function(deltaTime)
{
	if(this.y > this.game.canvas.height)
	{
		this.Die();
	}
	
	if(this.game.player != null && this.game.player.exists)
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
}

Ennemy.prototype.Draw = function(graphics, deltaTime)
{
	graphics.save();
	
	graphics.translate(this.x,this.y);
	graphics.drawImage(this.img,this.offsetX, this.offsetY);
	
	GameObject.prototype.Draw.call(this,graphics,deltaTime);
	
	graphics.restore();
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
		this.Die();
		var c = this.game.poolManager.GetCollectible();
		
		c.x = this.x;
		c.y = this.y;
	}
}

Ennemy.prototype.Die = function()
{
	this.life = 1;
	GameObject.prototype.Die.call(this);
}