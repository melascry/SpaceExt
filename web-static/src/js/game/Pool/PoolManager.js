var PoolManager = function(game,nbrLittleShip,nbrShot)
{
	this.game = game;
	this.LittleEnnemies = new Array();
	this.PlayerShoots = new Array();
	this.LittleEnnemiesShoots = new Array();
	
	for( var i = 0; i < nbrLittleShip; i++)
	{
		this.LittleEnnemies[i] = new Ennemy(this.game,IMAGE_URL+"Ennemy.png",21,22);
	}
	
	this.GetLittleEnnemy = function()
	{
		for(var i in this.LittleEnnemies)
		{
			//console.log("getting ennemy : " + this.LittleEnnemies[i].isUsed);
			if(!this.LittleEnnemies[i].isUsed)
			{
				//console.log("not used ennemy");
				this.LittleEnnemies[i].isUsed = true;
				return this.LittleEnnemies[i];
			}
		}
		
		this.LittleEnnemies[this.LittleEnnemies.length] = new Ennemy(this.game,IMAGE_URL+"Ennemy.png",21,22);
		//console.log("created pool entity");
		this.LittleEnnemies[this.LittleEnnemies.length-1].isUsed = true;
		console.log("Little length : " + this.LittleEnnemies.length);
		//console.log("pool entity is used");
		return this.LittleEnnemies[this.LittleEnnemies.length-1]; 
	}
	
	this.GetPlayerShot = function()
	{
		for( var i in this.PlayerShoots)
		{
			if(!this.PlayerShoots[i].isUsed)
			{
				this.PlayerShoots[i].isUsed = true;
				//console.log("Shot legngth : " + this.PlayerShoots.length);
				return this.PlayerShoots[i];
			}
		}
		
		this.PlayerShoots[this.PlayerShoots.length] = new PlayerShot(this.game,IMAGE_URL+"Thing.png",10,10);
		//console.log("created pool entity");
		this.PlayerShoots[this.PlayerShoots.length-1].isUsed = true;
		//console.log("pool entity is used");
		//console.log("Shot legngth : " + this.PlayerShoots.length);
		return this.PlayerShoots[this.PlayerShoots.length-1];
	}
	
	this.GetLittleEnnemiesShot = function()
	{
		for( var i in this.LittleEnnemiesShoots)
		{
			if(!this.LittleEnnemiesShoots[i].isUsed)
			{
				this.LittleEnnemiesShoots[i].isUsed = true;
				//console.log("Shot legngth : " + this.PlayerShoots.length);
				return this.LittleEnnemiesShoots[i];
			}
		}
		
		this.LittleEnnemiesShoots[this.LittleEnnemiesShoots.length] = new EnnemyShot(this.game,IMAGE_URL+"Thing.png",10,10);
		//console.log("created pool entity");
		this.LittleEnnemiesShoots[this.LittleEnnemiesShoots.length-1].isUsed = true;
		//console.log("pool entity is used");
		//console.log("Shot legngth : " + this.PlayerShoots.length);
		return this.LittleEnnemiesShoots[this.LittleEnnemiesShoots.length-1];
	}
}

