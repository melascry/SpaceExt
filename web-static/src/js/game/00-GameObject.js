var GameObject = function(game,parent,img,width,height)
{
	if(typeof(game) == "undefined"){
		return;
	}
	
	this.game = game;
	this.img = document.createElement('image');

	this.img.src = img;
	
	this.offsetX = -width/2;
	this.offsetY = -height/2;
	
	this.x = 0;
	this.y = 0;
	
	this.radius =width/2;
	this.radiusSquarred = this.radius*this.radius;
	//console.log("creation : " + img + " : " + this.radiusSquarred);
	this.life = 1;
	
	this.parent = parent;
	this.children = new Array();
	
	this.exists = true;
	this.visible = true;
	this.isUsed = false;
	this.physical = true;
	
};
GameObject.prototype.Update = function(deltaTime)
{
	if(this.exists)
	{
		if(this.life <=0)
		{
			this.Die();
			return;
		}

		//if(this.physical)
			//this.TestPhysique(this.game.poolManager);
		
		for(i in this.children)
			this.children[i].Update(deltaTime);
	}
};
GameObject.prototype.Draw = function(graphics,deltaTime)
{
	if(this.visible)
	{
		graphics.Check();	
		for(i in this.children)
			if(this.children[i].visible)
				this.children[i].Draw(graphics,deltaTime);
	}
};

GameObject.prototype.TestPhysique = function(pool)
{
	//console.log("Calling physics of undefined behaviour");
}

GameObject.prototype.GetWorldPositionX = function()
{
	if(this.parent == null)
		return this.x;
	else
		return this.x + this.parent.GetWorldPositionX();
}

GameObject.prototype.GetWorldPositionY = function()
{
	if(this.parent == null)
		return this.y;
	else
		return this.y + this.parent.GetWorldPositionY();
}

GameObject.prototype.AddChild = function(child)
{
	this.children.push(child);
}

GameObject.prototype.Die = function()
{
	delete this;
};