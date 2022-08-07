class Keyboard{
	constructor(){
		this.delta =  {x:0, y:0};
		this.sensitivity = 0.5;
		this.keysDown = [];
				
		document.addEventListener('keydown', (ev) => {
			if (this.isLeft(ev.keyCode) || this.isRight(ev.keyCode)){
				this.keysDown.push(ev.keyCode);
			}
						
			if (ev.key == "Space" || ev.keyCode == 32){
				
			}
			
			ev.preventDefault();    
			return false;
		}, false);
		
		document.addEventListener('keyup', (ev) => {
			if (this.isLeft(ev.keyCode) || this.isRight(ev.keyCode)){
				this.keysDown = this.keysDown.filter(x => x != ev.keyCode);
			}
			
			ev.preventDefault();
			return false;
		}, false);
	}
	
	isLeft(keyCode){			
		return keyCode == 37 || keyCode == 65;
	}
	
	isRight(keyCode){
		return keyCode == 39 || keyCode == 68;
	}
	
	getDeltaFromPreviousFrame(time){
		if (!this.prevTime){
			this.prevTime = time;
			return {x:0, y:0};
		}
				
		let dx = 0.0;
		if (this.keysDown.length > 0){
		let direction = this.keysDown[this.keysDown.length - 1];
			if (this.isLeft(direction))
				dx = -1.5;
			else if (this.isRight(direction))
				dx = 1.5;
		}
		let dt = time - this.prevTime;
		this.prevTime = time;
		return {x: dx * this.sensitivity * dt, y: this.delta.y * dt};
	}
}


class Touch{	
	constructor(){
		var canvas = document.getElementById("MyCanvas");
		this.previousDelta = {x: 0, y: 0};
		this.deltaMovementFromDown = {x: 0, y: 0};
		
		canvas.addEventListener('touchstart', (e)=>{		
			var touchobj = e.changedTouches[0];
			var rect = canvas.getBoundingClientRect();
			
			let x = touchobj.clientX - rect.left;
			let y = touchobj.clientY - rect.top;
			
			this.previousDelta = {x: 0, y: 0};
			this.touchDown = {x: x, y: y};				
			
			e.preventDefault();
		}, false);
		
		canvas.addEventListener('touchmove', (e)=>{
			if (e.buttons == 0) return;
			var touchobj = e.changedTouches[0];
			var rect = canvas.getBoundingClientRect();
			
			let x = touchobj.clientX - rect.left;
			let y = touchobj.clientY - rect.top;
			
			this.deltaMovementFromDown = {x: x - this.touchDown.x, y: y - this.touchDown.y};
			
			e.preventDefault();
		}, false);
		
		canvas.addEventListener('touchend', (e)=>{
			var touchobj = e.changedTouches[0];
			var rect = canvas.getBoundingClientRect();
			
			let x = touchobj.clientX - rect.left;
			let y = touchobj.clientY - rect.top;
			
			this.touchDown = null;
			this.previousDelta = {x: 0, y: 0};
			this.deltaMovementFromDown = {x: 0, y: 0};
			e.preventDefault();
		}, false);
	}
	
	getDeltaFromPreviousFrame(time){
		let ret = {x: this.deltaMovementFromDown.x - this.previousDelta.x, y: 0.0};
		this.previousDelta = this.deltaMovementFromDown;		
		return ret;
	}
}


class MultiController{
	constructor(a, b){
		this.a = a;
		this.b = b;
	}
	
	getDeltaFromPreviousFrame(time){
		let a = this.a.getDeltaFromPreviousFrame(time);
		let b = this.b.getDeltaFromPreviousFrame(time);
		return {x: a.x + b.x, y: a.y + b.y};
	}
	
}