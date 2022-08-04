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
	
	getPolarAngle(pt){
		let theta  = Math.atan2(pt.y - this.y, pt.x - this.x);	
		return theta;		
	}
	
	getTangentAngleAtPolarAngle(phi){
		return Math.atan2(Math.cos(phi), - Math.sin(phi));		
	}
}

class Rectangle{
	constructor(x, y, w, h, padding){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		
		this.padding = padding;
		
		this.cTopLeft     = new Circle(this.x         , this.y         , padding);
		this.cTopRight    = new Circle(this.x + this.w, this.y         , padding);
		this.cBottomRight = new Circle(this.x + this.w, this.y + this.h, padding);
		this.cBottomLeft  = new Circle(this.x         , this.y + this.h, padding);
	}
	
	collides(vector, dt){
		let ybottom = this.y + this.h + this.padding;		
		let ytop = this.y - this.padding;
		let xleft = this.x - this.padding;		
		let xright = this.x + this.w + this.padding;
		
		
		let t = (ybottom - vector.y) / vector.dy				
		let xbottom = vector.x + vector.dx * t;		
		
		if (0 <= t && t <= dt && this.x <= xbottom && xbottom <= this.x + this.w){			
			return {t:t, pt: {x: xbottom, y: ybottom}, tangent: Math.PI};
		}		
		
		t = (ytop - vector.y) / vector.dy	
		let xtop = vector.x + vector.dx * t;
		
		if (0 <= t && t <= dt && this.x <= xtop && xtop <= this.x + this.w){				
			return {t:t, pt: {x: xtop, y: ytop}, tangent: Math.PI};
		}

		
		t = (xleft - vector.x) / vector.dx
		let yleft = vector.y + vector.dy * t;
		
		if (0 <= t && t <= dt && this.y <= yleft && yleft <= this.y + this.h){			
			return {t:t, pt: {x: xleft, y: yleft}, tangent: Math.PI/2};
		}
		
		t = (xright - vector.x) / vector.dx
		let yright = vector.y + vector.dy * t;
		
		if (0 <= t && t <= dt && this.y <= yright && yright <= this.y + this.h){					
			return {t:t, pt: {x: xright, y: yright}, tangent: Math.PI/2};
		}
		
		let i = vector.intersectCircle(this.cTopLeft);
		if (i && 0 <= i[0] && i[0] <= dt){
			let intersectionPoint = vector.getPointAt(i[0]);
			let polarAngle = this.cTopLeft.getPolarAngle(intersectionPoint);
			let tangent = this.cTopLeft.getTangentAngleAtPolarAngle(polarAngle);
			return {t:i[0], pt: intersectionPoint, tangent: tangent};
		}
		
		i = vector.intersectCircle(this.cTopRight);
		if (i && 0 <= i[0] && i[0] <= dt){
			let intersectionPoint = vector.getPointAt(i[0]);
			let polarAngle = this.cTopLeft.getPolarAngle(intersectionPoint);
			let tangent = this.cTopLeft.getTangentAngleAtPolarAngle(polarAngle);
			return {t:i[0], pt: intersectionPoint, tangent: tangent};
		}
		
		i = vector.intersectCircle(this.cBottomRight);
		if (i && 0 <= i[0] && i[0] <= dt){
			let intersectionPoint = vector.getPointAt(i[0]);
			let polarAngle = this.cTopLeft.getPolarAngle(intersectionPoint);
			let tangent = this.cTopLeft.getTangentAngleAtPolarAngle(polarAngle);
			return {t:i[0], pt: intersectionPoint, tangent: tangent};
		}
		
		i = vector.intersectCircle(this.cBottomLeft);
		if (i && 0 <= i[0] && i[0] <= dt){
			let intersectionPoint = vector.getPointAt(i[0]);
			let polarAngle = this.cTopLeft.getPolarAngle(intersectionPoint);
			let tangent = this.cTopLeft.getTangentAngleAtPolarAngle(polarAngle);
			return {t:i[0], pt: intersectionPoint, tangent: tangent};
		}
		return null;
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