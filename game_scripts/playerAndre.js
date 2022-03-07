class AndreBullet {
    constructor(x,y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.image = new Image();
    this.image.src = './images/andrebullet.png';
    this.screen = 'game';
    //stats
    this.moveSpeed = 15;
    }

    update(context) {
        this.draw(context);
        this.x+=this.moveSpeed;
    }
    
    draw(context) {
        context.drawImage(this.image,this.x,this.y,this.width,this.height);
    }
}

class Andre {
    constructor(x,y,settings,screenWidth,screenHeight) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        //images
        this.healthGraphic = new Image();
        this.healthGraphic.src = "./images/heartgraphic.png";

        this.bulletImage = new Image();
        this.bulletImage.src = './images/andrebullet.png';

        this.handgunIcon = new Image();
        this.handgunIcon.src = './images/handgunicon.png';

        this.submachineIcon = new Image();
        this.submachineIcon.src = "./images/submachineicon.png";

        this.burstIcon = new Image();
        this.burstIcon.src = "./images/bursticon.png";
        
        this.shotgunIcon = new Image();
        this.shotgunIcon.src = "./images/shotgunicon.png";

        this.weaponIcon = new Image();
        this.weaponIcon.src = './images/handgunicon.png';
        //gameobject
        this.x = x;
        this.y = y;
        this.width = 45;
        this.height = 64;
        this.image = new Image();
        this.image.src = './images/playerandre.png'
        this.screen = 'game';
        this.weapons = ["handgun","shotgun","burst","submachine"];
        //stats
        this.weaponname = "handgun";
        this.weaponDisplay = "Chiappa Rhino .38 Special";
        this.weapon = "error";
        this.maxBullets = 0;
        
        this.shotCoolDown = 0;
        this.reloadTime = 0;
        this.weaponDamage = 0;

        this.moveSpeed = 10;
        this.dashDistance = 20;

        //leveling
        this.kills = 0;
        this.levelgap = 6;
        this.level = 0;

        //gameplayvars
        this.canShoot = true;
        this.isReloading = false;
        this.health = 3;
        this.bullets = [];
        this.currentBullets = 0;
        
        //timers
        this.shotTimer = 0;
        this.reloadTimer = 0;
        this.animationTimer = 0;
        //HUD
        this.callout == "Test!";

        //settings
        this.inputSettings = settings;

        this.currentInput = {
            Left:false,
            Right:false,
            Up:false,
            Down:false,
            Shooting:false,
        }

        this.changeWeapon("handgun");
    }

    levelup() {
        this.reloadTimer = 0;
        this.shotTimer = 0;
        if (this.level < 12) {
            this.level++;
            this.movespeed+=3*(this.level*0.5);
            this.dashDistance+=1*(this.level*0.5);
            this.kills = 0;
            this.changeWeapon(this.weaponname);
            this.callout = "Level up!"
        }
        else this.callout = "MAX level reached!"

        this.currentBullets = this.maxBullets;
    }

    //mandatory functions
    perframe() {
        this.animationTimer+=17;

        if (this.health < 3) this.callout = "Low on health!";

        if (this.currentInput.Left == true && this.x>0 ) this.x-=this.moveSpeed;
        if (this.currentInput.Right == true && this.x < this.screenWidth-50) this.x+=this.moveSpeed;
        if (this.currentInput.Up == true && this.y > this.screenHeight/3) this.y-=this.moveSpeed;
        if (this.currentInput.Down == true && this.y < this.screenHeight-(this.screenHeight/14)) this.y+=this.moveSpeed;
        if (this.currentInput.Shooting == true) this.shoot();

        if (this.shotTimer <= this.shotCoolDown) this.shotTimer+=17;
        if (this.shotTimer >= this.shotCoolDown)  {this.canShoot = true; this.shotTimer = this.shotCoolDown;}
        
        if (this.isReloading && this.reloadTimer < this.reloadTime) {
            this.reloadTimer+=17;
            if (this.weaponname == "handgun") this.callout = "Reloading handgun...";
            if (this.weaponname == "burst") this.callout = "Reloading rifle...";
            if (this.weaponname == "submachine") this.callout = "Reloading SMG...";
            if (this.weaponname == "shotgun") this.callout = "Reloading shotgun...";
        }
        if (this.isReloading && this.reloadTimer >= this.reloadTime) {
            this.reload();
            this.reloadTimer = 0;
            this.isReloading = false;
            this.callout = "Loaded!";
        }

    }

    inputKeyDown(event){
        if (event.keyCode == this.inputSettings.Left) this.currentInput.Left = true;
        if (event.keyCode == this.inputSettings.Right) this.currentInput.Right = true;
        if (event.keyCode == this.inputSettings.Up) this.currentInput.Up = true;
        if (event.keyCode == this.inputSettings.Down) this.currentInput.Down = true;
        if (event.keyCode == this.inputSettings.Eject) this.eject();
        if (event.keyCode == this.inputSettings.Reload && this.isReloading == false && this.currentBullets == 0) this.isReloading = true; 
        if (event.keyCode == this.inputSettings.Special) {
        if (this.y+this.dashDistance < this.screenHeight-(this.screenHeight/14) && this.y + this.dashDistance > this.screenHeight/3 && this.x+this.dashDistance > 0 && this.x+this.dashDistance <  this.screenWidth-50)
            this.dash();
        else this.callout = "Unable to reposition!";
        }
        if (event.keyCode == this.inputSettings.Attack) this.currentInput.Shooting = true;
    }

    inputKeyUp(event) {
        if (event.keyCode == this.inputSettings.Left) this.currentInput.Left = false;
        if (event.keyCode == this.inputSettings.Right) this.currentInput.Right = false;
        if (event.keyCode == this.inputSettings.Up) this.currentInput.Up = false;
        if (event.keyCode == this.inputSettings.Down) this.currentInput.Down = false;
        if (event.keyCode == this.inputSettings.Attack) this.currentInput.Shooting = false;
    }

    //gameplay function
    draw(context){
        if (this.currentInput.Shooting == true) {
            context.drawImage(this.image,0,0,16,24,this.x,this.y,this.width,this.height);
            
            if (this.weaponname == "handgun") context.drawImage(this.weaponIcon,this.x+29,this.y+16,50,32);
            if (this.weaponname == "handgun" && (this.level > 10)) context.drawImage(this.weaponIcon,this.x + 15,this.y+20,50,32);

            if (this.weaponname == "burst") context.drawImage(this.weaponIcon,this.x-3,this.y+16,90,32);
            if (this.weaponname == "shotgun") context.drawImage(this.weaponIcon,this.x-5,this.y+30,90,25);
            if (this.weaponname == "submachine") context.drawImage(this.weaponIcon,this.x+17,this.y+25,50,32);
        }
        else if (this.animationTimer > 600) {this.animationTimer = 0;context.drawImage(this.image,55,0,16,24,this.x,this.y,this.width,this.height);}
        else if (this.animationTimer > 400) {context.drawImage(this.image,55,0,16,24,this.x,this.y,this.width,this.height);}
        else if (this.animationTimer > 200) context.drawImage(this.image,37,0,16,24,this.x,this.y,this.width,this.height);
        else if (this.animationTimer > 0) context.drawImage(this.image,19,0,16,24,this.x,this.y,this.width,this.height);

        for (let i=0;i<this.bullets.length;i++) {
            this.bullets[i].update(context);
        }

        context.fillStyle = 'white';
        context.font = "12px Consolas";

        //bullet count
        for (let i=0;i<this.currentBullets;i++) {
        context.drawImage(this.bulletImage,this.x+(10*i),this.y-40,10,10);
        context.font = "12px Arial";
        context.fillText('E to reload', this.x, this.y-50);
        }
        if (this.currentBullets == 0) {
            context.fillStyle = 'red';
            context.font = "24px Arial";
            context.fillText('R', this.x, this.y-40);
        }

        context.fillStyle = 'white';
        context.font = "12px Arial";

        //character callouts
        context.fillText(this.callout, this.x, this.y-20);

        //HUD
        context.fillText("Gunner", 1000, 630);
        context.fillText("Health:", 1000, 650);
        for (let i=0;i<this.health;i++) {
            context.drawImage(this.healthGraphic,1050+(10*i),640,10,10);
        }
        context.fillText("Level:", 1000, 670);
        context.fillText(this.level, 1050, 670);
        context.fillText("EXP:", 1000, 690);
        context.fillText((this.level*this.levelgap) - this.kills, 1050, 690);
        context.fillText("Weapon:", 1155, 600);
        context.drawImage(this.weaponIcon,1110,610,128,64);

        if (this.weaponname == 'handgun' && (this.level > 10)) {
            context.drawImage(this.weaponIcon,1110 + 30,610 + 20, 128,64);
        }

        context.fillText(this.weaponDisplay, 1100, 690);

        for (let i=0;i<this.bullets.length;i++) {
            this.bullets[i].update(context);
        }
    }
    shoot(){
        if (this.currentBullets > 0  && this.canShoot == true) {
            this.currentBullets-=1;
            this.createBullets();
            this.canShoot = false;
            this.shotTimer = 0;
            this.callout = '';
        }
    }
    eject(){
        if (this.currentBullets != 0) this.currentBullets = 0;
        this.callout = "Ejecting!";
    }
    reload(){
        this.currentBullets = this.maxBullets;
    }
    dash(){
        if (this.currentInput.Left == true) this.x-=this.dashDistance;
        if (this.currentInput.Right == true) this.x+=this.dashDistance;
        if (this.currentInput.Up == true) this.y-=this.dashDistance;
        if (this.currentInput.Down == true) this.y+=this.dashDistance; 
        this.callout = "Repositioning!";
    }
    createBullets() {
        this.bullets.push(new AndreBullet(this.x,this.y));
    }

    changeWeapon(weaponname) {
        this.reloadTimer = 0;
        this.shotTimer = 0;
	this.currentBullets = 0;

        if (weaponname == "handgun") {
            this.weaponIcon = this.handgunIcon;
            this.callout = "Got a handgun!";
            this.weaponDisplay = "1911 handgun";
            this.weaponname = "handgun";
            this.maxBullets = 6 + Math.round((this.level * 0.5));
            this.shotCoolDown = 400;
            this.reloadTime = 800 - (this.level*10);
            this.weaponDamage = 2;

            if (this.level > 10) {
                this.callout = "Got two handguns!";
                this.weaponDisplay = "dual 1911s";
            }

            this.createBullets = function () {
                this.bullets.push(new AndreBullet(this.x+64,this.y));
                if (this.level > 10) this.bullets.push(new AndreBullet(this.x+128,this.y));
            }
        }
        if (weaponname == "shotgun") {
            this.weaponIcon = this.shotgunIcon;
            this.callout = "Found a shotgun!";
            this.weaponDisplay = "Remington shotgun";
            this.weaponname = "shotgun";
            this.maxBullets = 1 + Math.round(this.level/5);
            this.shotCoolDown = 300;
            this.reloadTime = 400 - (this.level * 5);
            
            this.weaponDamage = 1;

            this.createBullets = function () {
            for (let i=0; i<3+(Math.round(this.level*0.25));i++)
                this.bullets.push(new AndreBullet(this.x+64,this.y-32+(32*i)));
            }

        }
        if (weaponname == "submachine") {
            this.weaponIcon = this.submachineIcon;
            this.callout = "SMG procured!";
            this.weaponDisplay = "MAC 10 submachine gun";
            this.weaponname = "submachine";
            this.maxBullets = 10 + Math.round((this.level / 3));
            this.shotCoolDown = 50;
            this.reloadTime = 1200 + (this.level * 10);
            this.weaponDamage = 1;
            this.createBullets = function () {
                this.bullets.push(new AndreBullet(this.x+64,this.y));
                if (this.level > 10) this.bullets.push(new AndreBullet(this.x+32,this.y+42));
            }
        }
        if (weaponname == "burst") {
            this.weaponIcon = this.burstIcon;
            this.callout = "Found discarded rifle.";
            this.weaponname = "burst";
            this.weaponDisplay = "Steyr AUG rifle";
            this.maxBullets = 5 + Math.round(this.level/2);
            this.shotCoolDown = 500 - (this.level * 10);
            this.reloadTime = 800 - (this.level* 10);
            this.weaponDamage = 1;

            this.createBullets = function () {
                for (let i=0; i<2+Math.round(this.level/4);i++)
                this.bullets.push(new AndreBullet(this.x+64+(32*i),this.y));
            }
        }
    }
}
