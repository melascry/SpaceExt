var PoolManager = function(game,PlayerType,PlayerLevel,nbrLittleShip,nbrShot)
{
	this.game = game;
	this.LittleEnnemies = new Array();
	
	this.PlayerShoots = new Array();
	this.DroneShoots = new Array();
	
	this.LittleEnnemiesShoots = new Array();
	this.Ennemies = new Array();
	
	
	for( var i = 0; i < nbrLittleShip; i++)
	{
		this.LittleEnnemies[i] = new Ennemy(this.game,null,IMAGE_URL+"Ennemy.png",21,22);
	}
	/*
	this.GetEnnemy = function(index)
	{
		for(var i in this.Ennemy[index])
		{
			if(!this.Ennemy[index][i].isUsed)
			{
				this.Ennemy[index][i].isUsed = true;
				return this.Ennemy[index][i];
			}
		}
		
		this.Ennemy[index][this.Ennemy[index].length] = new Ennemy(this.game,IMAGE_URL+"Ennemy.png",21,22,index);
	}*/
	this.GetLittleEnnemy = function()
	{
		for( var i = 0 ; i < this.LittleEnnemies.length; i++)
		{
			//console.log("getting ennemy : " + this.LittleEnnemies[i].isUsed);
			if(!this.LittleEnnemies[i].isUsed)
			{
				//console.log("not used ennemy");
				this.LittleEnnemies[i].isUsed = true;
				return this.LittleEnnemies[i];
			}
		}
		
		this.LittleEnnemies[this.LittleEnnemies.length] = new Ennemy(this.game,null,IMAGE_URL+"Ennemy.png",21,22,EnnemiesIndices.LITTLE);
		//console.log("created pool entity");
		this.LittleEnnemies[this.LittleEnnemies.length-1].isUsed = true;
		//console.log("Little length : " + this.LittleEnnemies.length);
		//console.log("pool entity is used");
		return this.LittleEnnemies[this.LittleEnnemies.length-1]; 
	}
	
	this.GetDroneShot = function()
	{
		for( var i = 0 ; i < this.DroneShoots.length; i++)
		{
			if(!this.DroneShoots[i].isUsed)
			{
				this.DroneShoots[i].isUsed = true;
				//console.log("Shot length : " + this.PlayerShoots.length);
				return this.DroneShoots[i];
			}
		}
		this.DroneShoots[this.DroneShoots.length] = new DroneShot(this.game,null,IMAGE_URL+"Thing.png",10,10,1)
		//console.log("created pool entity");
		this.DroneShoots[this.DroneShoots.length-1].isUsed = true;
		//console.log("pool entity is used");
		//console.log("Shot legngth : " + this.PlayerShoots.length);
		return this.DroneShoots[this.DroneShoots.length-1];
	}
	
	this.GetPlayerShot = function()
	{
		for(var i in this.PlayerShoots)
		{
			if(!this.PlayerShoots[i].isUsed)
			{
				this.PlayerShoots[i].isUsed= true;
				return this.PlayerShoots[i];
			}
		}
		
		this.PlayerShoots[this.PlayerShoots.length] =
			new PlayerShot(
							this.game
							,null
							,""
							,20
							,20
							,0
							,[0,0]
							);
			
		this.PlayerShoots[this.PlayerShoots.length-1].isUsed = true;

		return this.PlayerShoots[this.PlayerShoots.length-1];
	}
	
	this.GetLittleEnnemiesShot = function()
	{
		for( var i = 0 ; i < this.LittleEnnemiesShoots.length ; i++)
		{
			if(!this.LittleEnnemiesShoots[i].isUsed)
			{
				this.LittleEnnemiesShoots[i].isUsed = true;
				//console.log("Shot legngth : " + this.PlayerShoots.length);
				return this.LittleEnnemiesShoots[i];
			}
		}
		
		this.LittleEnnemiesShoots[this.LittleEnnemiesShoots.length] = new EnnemyShot(this.game,null,IMAGE_URL+"Thing.png",10,10);
		//console.log("created pool entity");
		this.LittleEnnemiesShoots[this.LittleEnnemiesShoots.length-1].isUsed = true;
		//console.log("pool entity is used");
		//console.log("Shot legngth : " + this.PlayerShoots.length);
		return this.LittleEnnemiesShoots[this.LittleEnnemiesShoots.length-1];
	}
}

