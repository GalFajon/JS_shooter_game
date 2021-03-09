class soldierBullet {
    constructor(x,y,targety) {
        this.x = x;
        this.y = y;
        this.targety = targety;
        this.height = 32;
        this.width = 32;
        this.image = new Image();
        this.image.src = './images/turretbullet.fw.png'
        this.screen = 'game';
        //stats
        this.moveSpeed = 5;
        }
    
        update(context) {
            this.draw(context);
            this.x-=this.moveSpeed;
            if (this.targety < this.y) this.y-=this.moveSpeed;
            if (this.targety > this.y) this.y+=this.moveSpeed;
        }
        
        draw(context) {
            context.drawImage(this.image,this.x,this.y,this.width,this.height);
        }
}

class enemySoldier {
    constructor(x,y,type,level,players) {
        this.canBeDamaged = true;
        this.gracePeriod = 300;
        this.graceTimer = 300;

        this.animationTimer = 0;

        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 70;
        this.image = new Image();
        this.image.src = './images/soldier.fw.png'
        this.screen = 'game';
        this.level = level;

        this.bullets = [];
        this.timer = 0;

        this.type = type;
        this.movementPeriod = 600;
        this.shootPeriod = 1000;
        this.moveSpeed = 3;
        
        this.health = 2;
        this.damage = 1;
        this.ammo = 1;
        this.maxAmmo = 1;
        this.targetid = 0;
        
        this.playerDistance = 200;
        
        if (players != undefined) this.targetid = (Math.round(Math.random())*(players.length-1));
        if (this.type == "handgun") {this.playerDistance = 200; this.health=5 + Math.floor(this.level/2);}
        if (this.type == "shotgun") {this.playerDistance = 150; this.health=2;}
    }

    draw(context) {
        this.animationTimer+=17;
        if (this.timer <= this.movementPeriod+this.shootPeriod && this.timer > this.movementPeriod) {
            //shooting frame
            context.drawImage(this.image,39+42+42,0,70,56,this.x,this.y,this.width,this.height);
        }
        else if (this.animationTimer > 300) {context.drawImage(this.image,0,0,39,56,this.x,this.y,this.width,this.height);this.animationTimer = 0;}
        else if (this.animationTimer > 200) context.drawImage(this.image,39,0,39,56,this.x,this.y,this.width,this.height);
        else if (this.animationTimer > 100) context.drawImage(this.image,39+42,0,60,39,this.x,this.y,this.width,this.height);
        else context.drawImage(this.image,0,0,39,56,this.x,this.y,this.width,this.height);

        for (let i=0;i<this.bullets.length;i++) {
            this.bullets[i].update(context);
        }
    }

    perframe(players) {

        if (this.graceTimer < this.gracePeriod) {
            this.canBeDamaged = false;
            this.graceTimer+=17;
        }

        if (this.graceTimer >= this.gracePeriod) {
            this.canBeDamaged = true;
            this.graceTimer = this.gracePeriod;
        }


        if(players.length < 2) this.targetid = 0;

        if (this.canBeDamaged) {
        this.timer+=17;
    
        if (this.timer <= this.movementPeriod) {
            if (this.x > players[this.targetid].x) this.x-=this.moveSpeed;
            if (this.x - players[this.targetid].x < this.playerDistance) this.x+=this.moveSpeed;
            if (this.y > players[this.targetid].y) this.y-=this.moveSpeed;
            if (this.y < players[this.targetid].y) this.y+=this.moveSpeed;
        }

        else if (this.timer <= this.movementPeriod+this.shootPeriod) {
            if (this.ammo > 0) {
                if (this.type == "handgun") this.bullets.push(new soldierBullet(this.x,this.y,players[this.targetid].y));
                if (this.type == "shotgun") {
                    this.bullets.push(new soldierBullet(this.x,this.y,this.y+90));
                    this.bullets.push(new soldierBullet(this.x,this.y,this.y-90));
                }
                this.ammo--;
            }
        }

        else if (this.timer > this.movementPeriod + this.shootPeriod) {
            this.timer = 0;
            this.ammo = this.maxAmmo;
        }}

    }


}