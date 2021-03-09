class SecindrySlash {
    constructor(x,y,width,height,bladeimage) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = bladeimage;
        this.screen = 'game';
        this.timer = 0;
        }
    
        update(context) {
            this.draw(context);
            this.timer+=17;
        }
        
        draw(context) {
            context.drawImage(this.image,this.x,this.y,this.width,this.height);
        }
}


class Secindry {
    constructor(x,y,settings,screenWidth,screenHeight) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        this.katanaIcon = new Image();
        this.katanaIcon.src = './images/katanaicon.png';

        this.daggerIcon = new Image();
        this.daggerIcon.src = "./images/daggericon.png";

        this.greatswordIcon = new Image();
        this.greatswordIcon.src = "./images/greatswordicon.png";
        
        this.musketIcon = new Image();
        this.musketIcon.src = "./images/musketicon.png";

        this.weaponIcon = new Image();
        this.weaponIcon.src = './images/handgunicon.png';


        this.healthGraphic = new Image();
        this.healthGraphic.src = "./images/heartgraphic.png";

        //blades
        this.daggerSlash = new Image();
        this.daggerSlash.src = "./images/daggerslash.png";

        this.katanaSlash = new Image();
        this.katanaSlash.src = "./images/katanaslash.png";

        this.musketSlash = new Image();
        this.musketSlash.src = "./images/musketslash.png";

        this.greatswordSlash = new Image();
        this.greatswordSlash.src = "./images/greatswordslash.png";

        this.basicAttack = new Image();
        this.basicAttack = this.katanaSlash;

        //specials
        this.daggerSpecial = new Image();
        this.daggerSpecial.src = './images/daggerspecial.png';

        this.greatswordSpecial = new Image();
        this.greatswordSpecial.src = './images/greatswordspecial.png';

        this.katanaSpecial = new Image();
        this.katanaSpecial.src = './images/katanaspecial.png';

        this.musketSpecial = new Image();
        this.musketSpecial.src = './images/musketspecial.png';

        this.animationTimer = 0;
        //gameobject
        this.x = x;
        this.y = y;
        this.width = 45;
        this.height = 64;
        this.image = new Image();
        this.image.src = './images/playersecindry.png'
        this.screen = 'game';
        this.weapons = ["katana","greatsword","dagger","musketblade"];
        this.weaponDisplay = "Jian";
        this.weaponname = "katana";
        this.callout = "Test!";
        //stats
        this.weapon = "katana";
        this.weaponDamage = 1;
            //slash
        this.slashCoolDown = 500;
        this.slashDissipate = 300;
        this.slashOffset = 32;
        this.slashWidth = 64;
        this.slashHeight = 32;

            //special
        this.specialCoolDown = 500;
        this.specialWidth = 64;
        this.specialHeight = 64;
        this.specialName = "SPECIAL!";
        this.readyText = "";
    
        this.moveSpeed = 10;

        //leveling
        this.kills = 0;
        this.levelgap = 3;
        this.level = 1;

        //gameplayvars
        this.health = 3;
        this.canSlash = false;
        this.canSpecial = false;
        this.slashes = [];

        //timers
        this.slashTimer = 5000;
        this.specialTimer = 5000;


        //settings
        this.inputSettings = settings;
        this.currentInput = {
            Left:false,
            Right:false,
            Up:false,
            Down:false,
            Attacking:false,
            Special:false
        }

        this.changeWeapon("katana");
    }

    levelup() {
        if (this.level < 31) {
            this.movespeed+=3*(this.level*0.5);
            this.level++;
            this.kills = 0;
            this.changeWeapon(this.weaponname);
            this.callout = "Level increased.";
        }
        else this.callout = "Maximum level reached."
    }

    perframe() {
        this.animationTimer+=17;

        if ((this.slashes.length <= 0 || this.weaponname=="dagger") && this.currentInput.Special == false) {
        this.callout = "";
        
        if (this.currentInput.Left == true && this.x>0 ) this.x-=this.moveSpeed;
        if (this.currentInput.Right == true && this.x < this.screenWidth-50) this.x+=this.moveSpeed;
        if (this.currentInput.Up == true && this.y > this.screenHeight/3) this.y-=this.moveSpeed;
        if (this.currentInput.Down == true && this.y < this.screenHeight-(this.screenHeight/14)) this.y+=this.moveSpeed;
        if (this.currentInput.Attacking == true) this.slash();
        }

        if (this.slashTimer <= this.slashCoolDown) this.slashTimer+=17;
        if (this.slashTimer >= this.slashCoolDown)  {this.canSlash = true; this.slashTimer = this.slashCoolDown;}
        
        if (this.specialTimer < this.specialCoolDown) {
            this.specialTimer+=17;
        }
        if (this.specialTimer >= this.specialCoolDown)  {
            if (this.weaponname == "katana") this.callout = "Sword special charged!";
            if (this.weaponname == "greatsword") this.callout = "Greatsword special charged!";
            if (this.weaponname == "dagger") this.callout = "Dagger special charged!";
            if (this.weaponname == "musketblade") this.callout = "Flameblade special charged!";
            
            this.canSpecial = true; this.specialTimer = this.specialCoolDown;
        }
    }

    inputKeyDown(event){
        if (event.keyCode == this.inputSettings.Left) this.currentInput.Left = true;
        if (event.keyCode == this.inputSettings.Right) this.currentInput.Right = true;
        if (event.keyCode == this.inputSettings.Up) this.currentInput.Up = true;
        if (event.keyCode == this.inputSettings.Down) this.currentInput.Down = true;
        if (event.keyCode == this.inputSettings.Attack) this.currentInput.Attacking = true;
        if (event.keyCode == this.inputSettings.Special) {
            this.currentInput.Special = true;
            this.special();
        }
    }

    inputKeyUp(event) {
        if (event.keyCode == this.inputSettings.Left) this.currentInput.Left = false;
        if (event.keyCode == this.inputSettings.Right) this.currentInput.Right = false;
        if (event.keyCode == this.inputSettings.Up) this.currentInput.Up = false;
        if (event.keyCode == this.inputSettings.Down) this.currentInput.Down = false;
        if (event.keyCode == this.inputSettings.Attack) this.currentInput.Attacking = false;
        if (event.keyCode == this.inputSettings.Special) {
            this.currentInput.Special = false;
        }
    }

    special() {
        if (this.canSpecial == true) {
            this.callout = this.specialName;
            this.canSpecial = false;
            this.makeSpecial();
            this.specialTimer = 0;
        }
    }

    slash() {
        if (this.canSlash == true) {
            this.callout = "HIT!";
            this.canSlash = false;
            this.makeSlash();
            this.slashTimer = 0;
        }
    }

    makeSpecial() {
        this.slashes.push(new SecindrySlash(this.x+this.slashOffset,this.y,this.specialSize));
    }

    makeSlash() {
        this.slashes.push(new SecindrySlash(this.x+this.slashOffset+13,this.y+20,this.slashWidth,this.slashHeight,this.basicAttack));
    }

    draw(context){
        for (let i=0;i<this.slashes.length;i++) {
            this.slashes[i].update(context);
            if (this.slashes[i].timer > this.slashDissipate) this.slashes.splice(i,1);
        }

        if (this.currentInput.Attacking == true && this.slashes.length > 0) {
            context.drawImage(this.image,16,0,16,24,this.x,this.y,this.width,this.height);
            if (this.weaponname == "katana") context.drawImage(this.weaponIcon,this.x+40,this.y+20,64,32);
            if (this.weaponname == "greatsword") context.drawImage(this.weaponIcon,this.x+50,this.y+20,90,40);
            if (this.weaponname == "dagger") context.drawImage(this.weaponIcon,this.x+40,this.y+20,64,32);
            if (this.weaponname == "musketblade") context.drawImage(this.weaponIcon,this.x+40,this.y+20,64,32);
        }

        else if (this.currentInput.Special == true) {
            context.drawImage(this.image,0,0,16,24,this.x,this.y,this.width,this.height);
        }

        else if (this.animationTimer > 600) {this.animationTimer = 0;context.drawImage(this.image,33,0,18,24,this.x,this.y,this.width,this.height);}
        else if (this.animationTimer > 400) {context.drawImage(this.image,33+18+17,0,18,24,this.x,this.y,this.width,this.height);}
        else if (this.animationTimer > 200) context.drawImage(this.image,33+18,0,17,24,this.x,this.y,this.width,this.height);
        else if (this.animationTimer > 0) context.drawImage(this.image,33,0,18,24,this.x,this.y,this.width,this.height);

        context.fillStyle = 'white';
        context.font = "12px Arial";
        context.fillText(this.callout, this.x, this.y-32);

        context.fillText("Swordsman", 50, 630);
        context.fillText("Health:", 50, 650);
        for (let i=0;i<this.health;i++) {
            context.drawImage(this.healthGraphic,120+(10*i),640,10,10);
        }
        context.fillText("Level:", 50, 670);
        context.fillText(this.level, 100, 670);
        context.fillText("EXP:", 50, 690);
        context.fillText((this.level*this.levelgap) - this.kills, 100, 690);
        context.fillText("Weapon:", 200, 630);
        context.drawImage(this.weaponIcon,200,640,90,40);
        context.fillText(this.weaponDisplay, 200, 690);

    }

    changeWeapon(weaponname) {
        this.weaponname = weaponname;

        if (weaponname == "katana") {
            this.basicAttack = this.katanaSlash;
            this.weaponIcon = this.katanaIcon;
            this.weaponDisplay = "Shadow blade";
            this.weaponDamage = 1;
            //slash
            this.slashCoolDown = 300 - (this.level*5);
            this.slashDissipate = 100;
            this.slashOffset = 32;
            this.slashWidth = 128 + (this.level*3);
            this.slashHeight = 32;

            //special
            this.specialCoolDown = 800;
            this.specialWidth = 200  + (this.level*5);
            this.specialHeight = 128  + (this.level*5);
            this.specialName = "SPIN!";

            this.makeSpecial = function () {
                this.slashes.push(new SecindrySlash(this.x-64,this.y-32,this.specialWidth,this.specialHeight,this.katanaSpecial));
            }
        }

        if (weaponname == "greatsword") {
            this.basicAttack = this.greatswordSlash;
            this.weaponIcon = this.greatswordIcon;
            this.weaponDisplay = "Greatsword";
            this.weaponDamage = 2;
            //slash
            this.slashCoolDown = Math.round(1000 - (this.level*3));
            this.slashDissipate = 300;
            this.slashOffset = 64 + (this.level * 3);
            this.slashWidth = 160 + (this.level*3);
            this.slashHeight = 32;

            //special
            this.specialCoolDown = 1000;
            this.specialWidth = 128;
            this.specialHeight = 400;
            this.specialName = "GIANT SWORD!";

            this.makeSpecial = function () {
                this.slashes.push(new SecindrySlash(this.x+32,this.y,this.specialWidth,this.specialHeight,this.greatswordSpecial));
            }
        }

        if (weaponname == "dagger") {
            this.basicAttack = this.daggerSlash;
            this.weaponIcon = this.daggerIcon;
            this.weaponDisplay = "Misericorde dagger";
            this.weaponDamage = 1;
            //slash
            this.slashCoolDown = 200 - Math.round(this.level*5);
            this.slashDissipate = 100;
            this.slashOffset = 32;
            this.slashWidth = 64 + (this.level*4);
            this.slashHeight = 32;

            //special
            this.specialCoolDown = 2000;
            this.specialWidth = 800;
            this.specialHeight = 100+(this.level*5);
            this.specialName = "WIND!";

            this.makeSpecial = function () {
                this.slashes.push(new SecindrySlash(this.x+32,this.y-40,this.specialWidth,this.specialHeight,this.daggerSpecial));
            }
        }

        if (weaponname == "musketblade") {
            this.basicAttack = this.musketSlash;
            this.weaponIcon = this.musketIcon;
            this.weaponDisplay = "Flameblade";
            this.weaponDamage = 1;
            //slash
            this.slashCoolDown = 700  - Math.round(this.level*5);
            this.slashDissipate = 400;
            this.slashOffset = 32 + (this.level*4);
            this.slashWidth = 128 + (this.level*4);
            this.slashHeight = 32;

            //special
            this.specialCoolDown = 500  - Math.round(this.level*5);
            this.specialWidth = 32 + (this.level*5);
            this.specialHeight = 32;
            this.specialName = "FIRE WAVE!";

            this.makeSpecial = function () {
                for (let i=0;i<(this.level*2);i++) {
                    this.slashes.push(new SecindrySlash(this.x+(32*i)+32,this.y-(32*i),this.specialWidth,this.specialHeight,this.musketSpecial));
                    this.slashes.push(new SecindrySlash(this.x+(32*i)+32,this.y+(32*i),this.specialWidth,this.specialHeight,this.musketSpecial));  
                }
            }
        }
    
    }
}