class turretBullet {
    constructor(x,y) {
    this.x = x;
    this.y = y;
    this.height = 32;
    this.width = 32;
    this.image = new Image();
    this.image.src = './images/turretbullet.fw.png';
    this.screen = 'game';
    //stats
    this.moveSpeed = 5;
    }

    update(context) {
        this.draw(context);
        this.x-=this.moveSpeed;
    }
    
    draw(context) {
        context.drawImage(this.image,this.x,this.y,this.width,this.height);
    }
}

class EnemyTurret {
    constructor(x,y,type,level) {
        this.canBeDamaged = true;
        this.gracePeriod = 300;
        this.graceTimer = 300;
        //gameobject
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 50;
        this.image = new Image();
        this.image.src = './images/turret.fw.png';

        this.pillarImage = new Image();
        this.pillarImage.src = './images/pillar.png';

        this.screen = 'game';
    
        //stats
        this.type = type;
        this.shootCoolDown = 0;
        this.shootPeriod = 100;
        this.moveSpeed = 2;
        this.maxAmmo = 10;
        
        this.health = 3;
        this.damage = 1;
    
        this.targetid = 0;
    
        //gameplayvars
        this.shotTimer = 0;
        this.bullets = [];
        this.currentAmmo = 0;
        
        this.level = level;

        if (this.type == "autoturret") {
            this.shootCoolDown = 600 - this.level*5;
            this.shootPeriod = 100;
            this.moveSpeed = 5 - this.level;
            this.maxAmmo = 2;
            this.health = 2+ this.level;
            this.damage = 1+level;
        }
        if (this.type == "semiturret") {
            this.shootCoolDown = 1000 - (this.level * 150);
            this.shootPeriod = 100;
            this.moveSpeed = 2;
            this.maxAmmo = 1;
            this.health = 3 + this.level;
            this.damage = 2;
        }

        if (this.type == "pillar") {
            this.shootCoolDown = 0;
            this.shootPeriod = 0;
            this.moveSpeed = 10 + this.level*3;
            this.maxAmmo = 10;
            this.health = 1;
            this.damage = 10;
            this.height = 128;
        }

        this.currentAmmo = this.maxAmmo;
    
        }    
    
        init(players) {           
        }

    perframe (players) {
        if (this.graceTimer < this.gracePeriod) {
            this.canBeDamaged = false;
            this.graceTimer+=17;
        }

        if (this.graceTimer >= this.gracePeriod) {
            this.canBeDamaged = true;
            this.graceTimer = this.gracePeriod;
        }

        if (this.canBeDamaged) {
        this.x-=this.moveSpeed;
        this.shotTimer+=17;
        if (this.shotTimer >= this.shootCoolDown && this.shotTimer <= this.shootCoolDown+this.shootPeriod)  {
            this.shoot();
        }
        if (this.shotTimer >= this.shootCoolDown+this.shootPeriod)  {
            this.currentAmmo = this.maxAmmo;
            this.shotTimer = 0;
        }
        for (let i=0;i<this.bullets.length;i++) {
            this.bullets[i].update(context);
        }}
    }

    shoot() {
        if (this.currentAmmo > 0) {this.bullets.push(new turretBullet(this.x-(20*this.currentAmmo*2),this.y+10)); this.currentAmmo--;}
    }

    draw(context) {
        if (this.type == "pillar") context.drawImage(this.pillarImage,this.x,this.y,this.width,this.height);
        else context.drawImage(this.image,this.x,this.y,this.width,this.height);

        for (let i=0;i<this.bullets.length;i++) {
            this.bullets[i].update(context);
        }
    }
}