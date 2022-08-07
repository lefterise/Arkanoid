
class LineTrace{
	constructor(x1,y1, x2,y2, duration){
		this.x1 = x1;
		this.y1 = y1;		
		this.x2 = x2;
		this.y2 = y2;
		this.duration = duration;
	}
	
	update(dt){
		this.duration -= dt;
	}
	
	draw(ctx){
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.stroke();
	}
}

class CircleTrace{
	constructor(x,y, r, duration){
		this.x = x;
		this.y = y;		
		this.r = r;
		this.duration = duration;
	}
	
	update(dt){
		this.duration -= dt;
	}
	
	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.stroke();
	}
}

class Traces{
	constructor(){
		this.traces = [];
	}
	
	addLine(x1,y1, x2,y2, duration){
		let trace = new LineTrace(x1,y1, x2,y2, duration);
		this.traces.push(trace);
	}
	
	addCircle(x,y, r, duration){
		let trace = new CircleTrace(x,y, r, duration);
		this.traces.push(trace);
	}
	
	update(dt){
		for (let trace of this.traces){
			trace.update(dt);
		}
		
		this.traces = this.traces.filter( t=> t.duration > 0);
	}
	
	draw(ctx){
		for (let trace of this.traces){
			trace.draw(ctx);
		}
	}	
}

