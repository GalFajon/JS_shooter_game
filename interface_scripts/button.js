class Button {
	constructor(x,y,text,onclick,screen) {
		this.x = x;
		this.y = y;
		this.text = text;
		this.onclick = onclick;
		this.screen = screen;
	}
	
	ifclick(mouseX,mouseY) {
		if (this.x < mouseX + 4 && 
			this.x + 14*this.text.length > mouseX &&
			this.y < mouseY + 4 &&
			this.y + 20 > mouseY) {this.onclick();}
	}
	
	draw(ctx) {
		ctx.fillStyle='#0066ff';
		ctx.font = "24px Arial";
		ctx.beginPath();
		ctx.rect(this.x, this.y, 14*(this.text.length), 20);
		ctx.stroke();
		ctx.fillText(this.text,this.x+5,this.y+15);
	}
}