/*
    Stalks the player.
    Moves forward each movementTimer for movementPeriod.
*/

class EnemyDrone {
    constructor(x,y,type,players,level) {
    this.canBeDamaged = true;
    this.gracePeriod = 300;
    this.graceTimer = 300;  

    //gameobject
    this.x = x;
    this.y = y;
    this.width = 45;
    this.height = 45;
    this.image = new Image();

    this.teleportImage = new Image();
    this.teleportImage.src = './images/teleportdrone.fw.png';

    this.seekerImage = new Image();
    this.seekerImage.src = './images/seekerdrone.fw.png';
    
    this.screen = 'game';
    this.level = level;
    //stats
    this.type = type;
    this.movementCoolDown = 0;
    this.movementPeriod = 100;
    this.moveSpeed = 2;
    
    this.health = 3;
    this.damage = 3;

    this.targetid = 0;

    //gameplayvars
    this.movementTimer = 0;
    this.movementTolerance = 20;

    this.animationTimer = 0;
    
    if (players != undefined) this.targetid = (Math.round(Math.random())*(players.length-1));

    if (this.type == "teleportdrone") {
        this.movementCoolDown = 800 - (60 * this.level);
        this.movementPeriod = 100;
        this.moveSpeed = 50 + (5*this.level);
        
        this.health = 1 + this.level;
        this.damage = this.level;
        this.image = this.teleportImage;
    }
    if (this.type == "stalker") {
        this.movementCoolDown = 0;
        this.movementPeriod = 300;
        this.moveSpeed = 1*(this.level);
        
        this.health = 1+(this.level-1);
        this.damage = 1;
        this.image = this.seekerImage;
    }

    }

    draw(context) {
        this.animationTimer+=17;
        if (this.animationTimer > 400) this.animationTimer = 0;

        if (this.type == "stalker") {
        if (this.animationTimer > 200) context.drawImage(this.image,54,0,25,28,this.x,this.y,this.width,this.height);
        else if (this.animationTimer > 100) context.drawImage(this.image,24,0,20,28,this.x,this.y,this.width,this.height);
        else if (this.animationTimer > 0) context.drawImage(this.image,0,0,25,28,this.x,this.y,this.width,this.height);
        else context.drawImage(this.image,0,0,25,28,this.x,this.y,this.width,this.height);
        }

        if (this.type == "teleportdrone") {
            if (this.animationTimer > 300) context.drawImage(this.image,0,0,35,30,this.x,this.y,this.width,this.height);
            else if (this.animationTimer > 100) context.drawImage(this.image,0,0,35,30,this.x,this.y,this.width,this.height);
            else if (this.animationTimer > 0) context.drawImage(this.image,0,0,35,30,this.x,this.y,this.width,this.height);
            else context.drawImage(this.image,0,0,25,28,this.x,this.y,this.width,this.height);
        }
    }

    init() {
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

        if (this.canBeDamaged) {
        this.movementTimer+=17;
        if (this.movementTimer <= this.movementCoolDown) {this.movementTimer+=17;}
        if (this.movementTimer >= this.movementCoolDown && this.movementTimer <= this.movementCoolDown+this.movementPeriod)  {
            this.x-=this.moveSpeed;

        if (players.length > 1) {
            if (players[this.targetid].y < this.y) this.y-=this.moveSpeed;
            else this.y+=this.moveSpeed;
           
        } else if (players.length != 0) {
            if (players[0].y < this.y) this.y-=this.moveSpeed;
            else this.y+=this.moveSpeed;
        }
            this.movementTimer = 0;
        }
        }}
    }