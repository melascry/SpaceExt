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
		var d = Math.sqrt( Squarre(this.ShootDirection[i][0])+ Squarre(this.ShootDirection[i][1]));
		this.ShootDirection[i][0] /= d;
		this.ShootDirection[i][1] /= d;
	}
	this.ShootDamage = [0.5*level,1*level,0.5*level];
}