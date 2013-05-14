var Game = function()
{
	GameObject.call(this,this,null,"",0,0);
	
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
	
	this.jScore = $('#score');
	
	this.poolManager = new PoolManager(this,1,1);

	this.player = new Player(this,this,IMAGE_URL+"ShooterSDLittle.png",50,47,1,null);
	var playerShip = new Ship(this,this.player,IMAGE_URL+"ShooterSDLittle.png",50,47,1,1);
	this.player.ship = playerShip;
	
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
	
	this.gold = 0;
	this.cristal = 0;
	

	// Set the user past data in the game;
	this.gold = Math.round(userData.gold);
	this.jScore.html(this.gold);
	//////////////////////////////////////

	$(document).keydown(function(e){
		return _this.onKeyDown(e.which);
	});
}

Game.prototype = new GameObject();

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
	
	GameObject.prototype.Update.call(this,deltaTime);	
}

Game.prototype.Draw = function(graphics,deltaTime)
{
	this.graphics.drawTime = Date.now();
	//try
	//{
		this.graphics.save();
		this.graphics.fillStyle = 'black';
		this.graphics.fillRect(0,0,this.canvas.width,this.canvas.height);
		
		GameObject.prototype.Draw.call(this,this.graphics, deltaTime);
	
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

Game.prototype.StartParty = function()
{
	/*var _this = this;
	$.ajax({
		url: 'api.php', 
		type: 'POST',
		data: 
		{
			action: 'starting'
		},
		error: function(xhr, msg, msg2)
		{
			alert(msg2);
		},
		success: function(data)
		{
			var result = JSON.parse(data);
			if(result.error)
			{
				alert(result.error);
			}
			else
			{
				_this.player.inParty = true;
			}
		}
	});*/
}

Game.prototype.AddGold = function(value)
{
	this.gold += value;
	this.jScore.html(this.gold);
	/*
	jQuery.ajax
	(
		{
			url: 'api.php', 
			type: 'POST',
			data: 
			{
				action: 'goldFound',
				gold: value
			},
			success: function(data)
			{
				/*console.log(data);
				var result = JSON.parse(data);
				
				if(result.error)
				{
					alert(result.error);
				}
				else
				{
					console.log("gold validated : " + result.gold);
				}*//*
			},
			error: function(xhr, msg, msg2)
			{
				//alert(msg2);
			}			
		}
	);*/
}

var CheckException = function(text)
{
	this.text = text;
}