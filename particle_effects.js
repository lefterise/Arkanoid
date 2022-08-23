class BrickParticle{
	constructor(x, y, vx, vy, ax, ay){
		this.x = x;
		this.y = y;		
		this.vx = vx;
		this.vy = vy;		
		this.ax = ax;
		this.ay = ay;
		this.t = 0;
		this.angle = Math.PI * Math.random();
				
		this.points = 
		    [{x: -10, y: -5, z: -5}
			,{x:  10, y: -5, z: -5}
			,{x:  10, y:  5, z: -5}
			,{x: -10, y : 5, z: -5}
			,{x:  10, y: -5, z:  5}
			,{x: -10, y: -5, z:  5}
			,{x:  10, y:  5, z:  5}
			,{x: -10, y:  5, z:  5}
			]
		
		this.faces = 
			[[0,1,2,3]
			,[0,1,4,5]
			,[5,4,6,7]
			,[3,2,6,7]
			,[0,5,7,3]
			,[1,4,6,2]
			];
			
			this.points = this.rotateAll(this.points, Math.PI / 4, this.rotateY);
	}
	
	update(t){
		this.vx += this.ax * t;
		this.vy += this.ay * t;
		this.x  += this.vx * t;
		this.y  += this.vy * t;
		this.t  += t;
	}
	
	rotateX(p,r){
		return {x: p.x
			   ,y: p.y * Math.cos(r) - p.z * Math.sin(r)
			   ,z: p.y * Math.sin(r) + p.z * Math.cos(r)
		};
	}
	
	rotateY(p,r){
		return {x:  p.x * Math.cos(r) + p.z * Math.sin(r)
			   ,y:  p.y 
			   ,z: -p.x * Math.sin(r) + p.z * Math.cos(r)
		};
	}
	
	rotateAll(pts,r, func){
		return pts.map(x=>func(x,r));
	}
	
	getSumZ(face, points){
		let z = 0;
		for (let p of face){
			z += points[p].z;
		}
		return z;
	}
	
	draw(ctx){
		let r = this.t * 0.002 * Math.PI + this.angle;
		
		let rotatedPoints = this.rotateAll(this.points, r, this.rotateX);
		let sortedFaces = this.faces;
		sortedFaces.sort((a,b)=>{ return this.getSumZ(a, rotatedPoints) < this.getSumZ(b, rotatedPoints); });
		
		for (let face of sortedFaces){
			ctx.beginPath();			
			let p = rotatedPoints[face[face.length-1]];
			ctx.moveTo(this.x + p.x, this.y + p.y);
			
			for (let pt of face){
				p = rotatedPoints[pt];
				ctx.lineTo(this.x + p.x, this.y + p.y);
			}
			ctx.fill();
			ctx.stroke();
		}		

	}
}

class ParticleEffect{
	constructor(x, y, w, h, num, lifetime, hsl){
		this.particles = [];
		for (let i = 0; i < num; ++i){
			let particle = new BrickParticle(x + Math.random() * w, y + Math.random() * h, 0, -0.1 - Math.random() * 0.07, 0, 0.001);
			this.particles.push(particle);
		}
		
		this.lifetime = lifetime;
		this.t = 0;
		this.hsl = hsl;
	}
	
	update(t){
		for(let particle of this.particles){
			particle.update(t);
		}
		this.t += t;
	}
	
	draw(ctx){
		ctx.fillStyle = "hsl(" + this.hsl[0] + "," + this.hsl[1] + "%," +  this.hsl[2] + "%)";
		for(let particle of this.particles){
			particle.draw(ctx);
		}
	}
}

class Effects{
	constructor(){
		this.effects = [];
	}
	
	addParticleEffect(x, y, w, h, num, hsl){
		this.effects.push(new ParticleEffect(x, y, w, h, num, 1500, hsl));
	}
	
	update(t){
		for(let effect of this.effects){
			effect.update(t);
		}
		
		this.effects = this.effects.filter(e => e.t < e.lifetime);
	}
	
	draw(ctx){
		for(let effect of this.effects){
			effect.draw(ctx);
		}
	}
}