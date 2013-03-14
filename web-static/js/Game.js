var Game = function()
{
	var _this = this;
		
	requestAnimFrame(
			function loop() {
				_this.UpdateTime();
				requestAnimFrame(loop);
			}					
		);

	this.LastTime = 0;
	
	this.ennemiesLittle = new Array();
	this.ennemiesMiddle = new Array();
	this.ennemeisBig = new Array();
	
	this.canvas = document.getElementById("canvas");
	this.graphics = canvas.getContext("2d");
	
}

Game.prototype.Update = function(deltaTime)
{
	
}

Game.prototype.Draw = function(graphics,deltaTime)
{
	graphics.setTransform(1,0,0,1,0,0);
	graphics.clearRect(0,0,this.canvas.width,this.canvas.height);
	graphics.beginPath();
	graphics.moveTo(100,150);
	graphics.lineTo(450,50);
	graphics.stroke();
	//graphics.drawImage(this.img, col * this.width, row * this.height, this.width, this.height, -this.centerX, -this.centerY,this.width,this.height);
	img = document.createElement('image');
	img.src = "../SpaceExt-static/image/ShooterSD.png";
	graphics.drawImage(img,0,0);
}

Game.prototype.UpdateTime = function()
{
	var deltaTime = Date.now() - this.LastTime;
	this.LastTime = Date.now();
	
	this.Update(deltaTime);
	this.Draw(this.graphics, deltaTime);
}