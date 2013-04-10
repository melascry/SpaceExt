var Ship = function(game,type,level)//Initialize with the DB
{
	if(typeof(game) == "undefined")
		return;
	
	this.ShootPosition = new Array();
	this.ShootDirection = new Array();
	this.ShootDamage = new Array();
	
	for(var i = 0 ; i < 3; i++)
	{
		this.ShootPosition[i] = [-20+20*i,50];
		this.ShootDirection[i] = [-1+i,-1];
		var d = Math.sqrt( MathUtils.Squarre(this.ShootDirection[i][0])+ MathUtils.Squarre(this.ShootDirection[i][1]));
		this.ShootDirection[i][0] /= d;
		this.ShootDirection[i][1] /= d;
	}
	this.ShootDamage = [0.5*level,1*level,0.5*level];
	/*
this.Sources = new Array();
	
	for(var i = 0 ; i < 3; i++)
	{
		var direc;
		
		direc[i] = [-1+i,-1];
		var d = Math.sqrt( MathUtils.Squarre(direc[i][0])+ MathUtils.Squarre(direc[i][1]));
		direc[i][0] /= d;
		direc[i][1] /= d;
		this.Sources[i] = new ShootSource(game,IMAGE_URL+"Ennemy.png",21,22,direc,level * (0.5+i/2));
		this.Sources[i].x = -20+20*i;
		this.Sources[i].y = 50;
	}*/
}