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
