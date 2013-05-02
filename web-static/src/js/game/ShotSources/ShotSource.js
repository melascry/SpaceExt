var ShotSource = function(game,parent,img,width,height,fireRate,damage,direction,position)
{
	GameObject.call(this,game,parent,img,width,height);
	
	this.x = position[0];
	this.y = position[1];
	
	this.baseFirerate = fireRate;
	this.fireRate = this.baseFirerate;
	this.timeToFire = 1/ this.fireRate;
	
	this.timer = 0 ;
	
	this.damage = damage;
	this.direction = direction;
	this.canFire = true;
	
	this.gradient = document.createElement('canvas');
	this.gradient.style.background = 'transparent';
	this.gradient.width = width;
	this.gradient.height = height;	
	this.gradContext = this.gradient.getContext("2d");

	this.decal = 0.15;
	this.radiusDraw = this.radius*0.9;
	this.gradContext.translate(this.gradient.width/2,this.gradient.width/2);
	this.gradContext.rotate( Math.atan2(this.direction[1],this.direction[0]) + Math.PI / 2);
	this.gradContext.translate(0,Math.round(this.radiusDraw*this.decal));

	/*this.grad = this.gradContext.createRadialGradient(0,  0 , this.radius*0.1, -this.radius * direction[0], this.gradient.height - this.radius * direction[1], this.radius);
	
	this.grad.addColorStop(0, 'rgba(255,0,0,1)');
	this.grad.addColorStop(1, 'rgba(255,0,0,1)');

	this.gradContext.fillStyle = this.grad;
	this.gradContext.fillCircle = function(x, y, radius)
	{
		this.beginPath();
		this.arc(x,y,radius,0,2*Math.PI);
		this.closePath();
		this.fill();
	};
	 */
	//this.gradContext.fillCircle(0,0,this.radius);
	/*
	this.gradContext.beginPath();
	this.gradContext.lineTo(-5,5);
	this.gradContext.lineTo(5,5);
	this.gradContext.lineTo(0,0);
	this.gradContext.closePath();
	this.gradContext.fill();
	*/

	var hue = 70;
	
    // create radial gradient
    this.grad = this.gradContext.createRadialGradient(0,Math.round( this.radiusDraw*this.decal),Math.round( this.radiusDraw*(1-this.decal)), 0, 0, Math.round(this.radiusDraw));
    // light blue
//    this.grad.addColorStop(0, 'rgba(0,0,200,0)');
//    // dark blue
//    this.grad.addColorStop(0.9, 'rgba(150,150,255,0.9)');
//    this.grad.addColorStop(1, 'rgba(200,200,255,1)');
    this.grad.addColorStop(0, 'hsla('+hue+',100%,30%,0)');
    // dark blue
    this.grad.addColorStop(0.8, 'hsla('+hue+',100%,40%,0.9)');
    this.grad.addColorStop(1, 'hsla('+hue+',100%,75%,1)');

    this.gradContext.fillStyle = this.grad;
    
    this.gradContext.beginPath();
    this.gradContext.arc(0, Math.round(-this.radiusDraw*this.decal),Math.round(this.radiusDraw),0,2*Math.PI);
    this.gradContext.closePath();
    this.gradContext.fill();

}

ShotSource.prototype = new GameObject();

ShotSource.prototype.Update = function(deltaTime)
{
	if(this.exists)
	{
		if(!this.canFire)
		{
			this.timer += deltaTime;
			if(this.timer >= this.timeToFire)
			{
				this.timer = 0;
				this.canFire = true;
			}
		}
	}
	
	GameObject.prototype.Update.call(this,deltaTime);
}
ShotSource.prototype.Fire = function()
{
	if(this.canFire)
	{
		var shot = this.game.poolManager.GetPlayerShot();
		
		shot.x = this.GetWorldPositionX();
		shot.y = this.GetWorldPositionY();
		
		shot.damage = this.damage;
		shot.direction = this.direction;
	    shot.gradient = this.gradient;
		this.canFire = false;
	}
}

ShotSource.prototype.Draw = function(graphics,deltaTime)
{
	graphics.save();
	graphics.translate(this.x,this.y);
	
	graphics.drawImage(this.img,this.offsetX,this.offsetY);
	
	GameObject.prototype.Draw.call(this,graphics, deltaTime);
	graphics.restore();
}