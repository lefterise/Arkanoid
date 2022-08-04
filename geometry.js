function solveQuadratic(a,b,c){	
	let d = b**2 - 4 * a * c;
	if (d < 0)
		return null;
	let rootd = Math.sqrt(d);
	let s1 = (-b + rootd) / (2 * a);
	let s2 = (-b - rootd) / (2 * a);
	return s1 < s2 ? [s1, s2] : [s2, s1];
}

function distanceSquared(a, b){
	return (a.x - b.x) **2 + (a.y - b.y) ** 2;
}

class Ellipse{
	constructor(x, y, a, b){
		this.x = x;
		this.y = y;
		this.a = a;
		this.b = b;
	}
	
	getPolarAngle(pt){
		let theta  = Math.atan2(pt.y - this.y, pt.x - this.x);
		let phi    = Math.atan2(this.a * Math.sin(theta), this.b * Math.cos(theta));
		//let phiAlt = Math.atan(this.a/this.b * Math.tan(theta)); //I wonder why doc says it's b/a..
		return phi;
	}
	
	getTangentAngleAtPolarAngle(phi){
		return Math.atan2(this.b * Math.cos(phi), - this.a * Math.sin(phi));		
	}
	
	getRadiusSquaredAtPolarAngle(polarAngle){
		return (this.a * Math.cos(polarAngle)) ** 2 + (this.b * Math.sin(polarAngle)) ** 2;
	}
}

class Circle{
	constructor(x, y, r){
		this.x = x;
		this.y = y;
		this.r = r;
	}
}

class Rectangle{
	constructor(x, y, w, h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}	
}

class Vector{
	constructor(x, y, dx, dy){
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;		
	}
	
	static create(v){
		return new Vector(v.x, v.y, v.dx, v.dy);
	}
	
	getPointAt(t){
		return {x: this.x + this.dx * t, 
				y: this.y + this.dy * t};
	}
	
	getDirectionAngle(){
		return Math.atan2(this.dy, this.dx);		
	}
	
	getMagnitude(){
		return Math.sqrt(this.dx ** 2 + this.dy ** 2);
	}
	
	intersectCircle(c){
		let a = this.dx ** 2 + this.dy ** 2;
		let b = 2 * this.dx * (this.x - c.x) + 2 * this.dy * (this.y - c.y);
		let e = (this.x - c.x) ** 2 + (this.y - c.y) **2 - c.r**2;
		return solveQuadratic(a,b,e);
	}
	
	intersectEllipse(e){
		let a = this.dx ** 2 / (e.a ** 2) + this.dy ** 2 / (e.b ** 2);
		let b = 2 * this.dx * (this.x - e.x) / (e.a ** 2)+ 2 * this.dy * (this.y - e.y) / (e.b ** 2);
		let c = (this.x - e.x) ** 2 / (e.a ** 2) + (this.y - e.y) ** 2 / (e.b ** 2) - 1;
		return solveQuadratic(a,b,c);
	}	
}

//https://math.stackexchange.com/questions/3670465/calculate-distance-from-point-to-ellipse-edge
//https://math.stackexchange.com/questions/4086824/how-to-find-the-polar-coordinate-angle-of-the-tangent-of-any-point-on-an-ellipse