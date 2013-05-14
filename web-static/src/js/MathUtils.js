var MathUtils = {

};

MathUtils.Squarre = function (x)
{
	return x*x;
};

MathUtils.SquarredDistance = function (sx,ex,sy,ey)
{
	return MathUtils.Squarre(sx-ex)+MathUtils.Squarre(sy-ey);
}

MathUtils.Distance = function (sx,ex,sy,ey)
{
	return Math.sqrt(MathUtils.SquarredDistance(sx,ex,sy,ey));
}

MathUtils.Normalize = function( direction)
{
	var d = MathUtils.Distance(0,direction[0],0,direction[1]);
	
	direction[0] /= d;
	direction[1] /= d;
	
	return direction;
}