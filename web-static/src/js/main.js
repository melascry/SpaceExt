var game;

EnnemiesIndices = 
{
	LITTLE :0,
	MEDIUM : 1,
	BIG : 2,
	BOSS : 3,
	END : 4
}

function start()
{
	console.log('creating game');
	game = new Game();
}