var Game = function()
{
	var _this = this;
		
	requestAnimFrame(
			function loop() {
				_this.UpdateTime();
				requestAnimFrame(loop);
			}					
		);

	this.LastTime = Date.now();
	
	this.canvas = document.getElementById("canvas");
	this.graphics = canvas.getContext("2d");
	
	this.poolManager = new PoolManager(this,1,1);

	this.player = new Player(this,null,IMAGE_URL+"ShooterSDLittle.png",50,47,1,null);
	var playerShip = new Ship(this,this.player,IMAGE_URL+"ShooterSDLittle.png",50,47,1,1);
	this.player.ship = playerShip;
	this.player.AddChild(playerShip);
	
	
	this.graphics.Check = function()
	{
		var i = Date.now() - this.drawTime;
		if(i >50)
		{
			throw(new CheckException("draw too long "));
		}
	};
	this.graphics.fillCircle = function(x, y, radius)
	{
		this.beginPath();
		this.arc(x,y,radius,0,2*Math.PI);
		this.closePath();
		this.fill();
	};
	this.graphics.strokeCircle = function(x,y,radius)
	{
		this.beginPath();
		this.arc(x,y,radius,0,2*Math.PI);
		this.closePath();
		this.stroke();
	};
	
	this.timerPopEnnemy = 1;
	this.timer = 0;

	this.pause = false;

	$(document).keydown(function(e){
		return _this.onKeyDown(e.which);
	});
}

Game.prototype.onKeyDown = function(e)
{
	if(e == 80)
		this.pause = !this.pause;
}

Game.prototype.Update = function(deltaTime)
{
	this.timer += deltaTime;
	if(this.timer >= this.timerPopEnnemy)
	{
		this.timer = 0;
		var ennemy = this.poolManager.GetLittleEnnemy();
		ennemy.PopInWorld();
	}
	
	/*var test = new Array();
	for(var i in this.poolManager.PlayerShoots)
		test[i] = this.poolManager.PlayerShoots[i].length;*/
	if(this.player != null && this.player.exists)
		this.player.Update(deltaTime);
	/*for(var i in test)
	{
		if(test[i] != this.poolManager.PlayerShoots[i].length)
			console.log("different :O");
	}*/
	
	for ( var i in this.poolManager.LittleEnnemies)
		if(this.poolManager.LittleEnnemies[i] != null)
			if( this.poolManager.LittleEnnemies[i].isUsed)
				if(this.poolManager.LittleEnnemies[i].exists)
					this.poolManager.LittleEnnemies[i].Update(deltaTime);
	
	for(var i in this.poolManager.PlayerShoots)
		if(this.poolManager.PlayerShoots[i] != null)
				if(this.poolManager.PlayerShoots[i].isUsed)
					if(this.poolManager.PlayerShoots[i].exists)
						this.poolManager.PlayerShoots[i].Update(deltaTime);

	for(var i in this.poolManager.DroneShoots)
		if(this.poolManager.DroneShoots[i] != null)
			if( this.poolManager.DroneShoots[i].isUsed)
				if(this.poolManager.DroneShoots[i].exists)
					this.poolManager.DroneShoots[i].Update(deltaTime);
	
	for( var i in this.poolManager.LittleEnnemiesShoots)
		if(this.poolManager.LittleEnnemiesShoots[i] != null)
			if( this.poolManager.LittleEnnemiesShoots[i].isUsed)
				if(this.poolManager.LittleEnnemiesShoots[i].exists)
					this.poolManager.LittleEnnemiesShoots[i].Update(deltaTime);
}

Game.prototype.Draw = function(deltaTime)
{
	this.graphics.drawTime = Date.now();
	//try
	//{
		this.graphics.save();
		this.graphics.fillStyle = 'black';
		this.graphics.fillRect(0,0,this.canvas.width,this.canvas.height);
	
		if(this.player.visible)
			this.player.Draw(this.graphics,deltaTime);
		
		//DrawEnnemies
		for ( var i in this.poolManager.LittleEnnemies)
			if(this.poolManager.LittleEnnemies[i] != null)
				if( this.poolManager.LittleEnnemies[i].isUsed)
					if(this.poolManager.LittleEnnemies[i].visible)
						this.poolManager.LittleEnnemies[i].Draw(this.graphics,deltaTime);

		//DrawMissiles
		for(var i in this.poolManager.PlayerShoots)
			if(this.poolManager.PlayerShoots[i] != null)
					if( this.poolManager.PlayerShoots[i].isUsed)
						if(this.poolManager.PlayerShoots[i].visible)
							this.poolManager.PlayerShoots[i].Draw(this.graphics,deltaTime);

		for(var i in this.poolManager.DroneShoots)
			if(this.poolManager.DroneShoots[i] != null)
				if( this.poolManager.DroneShoots[i].isUsed)
					if(this.poolManager.DroneShoots[i].visible)
						this.poolManager.DroneShoots[i].Draw(this.graphics,deltaTime);
		
		for( var i in this.poolManager.LittleEnnemiesShoots)
			if(this.poolManager.LittleEnnemiesShoots[i] != null)
				if( this.poolManager.LittleEnnemiesShoots[i].isUsed)
					this.poolManager.LittleEnnemiesShoots[i].Draw(this.graphics,deltaTime);
		
		this.graphics.restore();
	/*}
	catch(e)
	{
		console.log(e);
	}*/
}

Game.prototype.UpdateTime = function()
{
	var deltaTime = Math.min(50,Date.now() - this.LastTime);
	deltaTime /= 1000;
	this.LastTime = Date.now();
	
	if(!this.pause)
	{
		this.Update(deltaTime);
		this.Draw(deltaTime);
	}
}

var CheckException = function(text)
{
	this.text = text;
}