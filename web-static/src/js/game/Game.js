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
	
	this.ennemiesLittle = new Array();
	this.ennemiesMiddle = new Array();
	this.ennemeisBig = new Array();
	
	this.player = new Player("../spaceext-static/image/ShooterSD.png",100,94,1);
	
	this.canvas = document.getElementById("canvas");
	this.graphics = canvas.getContext("2d");
	
}

Game.prototype.Update = function(deltaTime)
{
	this.player.Update(deltaTime);
}

Game.prototype.Draw = function(deltaTime)
{
	this.graphics.save();
	this.graphics.clearRect(0,0,this.canvas.width,this.canvas.height);


	this.player.Draw(this.graphics,deltaTime);
	//DrawEnnemies
	//DrawMissiles

	this.graphics.restore();
}

Game.prototype.UpdateTime = function()
{
	var deltaTime = Date.now() - this.LastTime;
	deltaTime /= 1000;
	this.LastTime = Date.now();
	
	this.Update(deltaTime);
	this.Draw(deltaTime);
}