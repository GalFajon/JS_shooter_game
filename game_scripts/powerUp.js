class powerUp {
    constructor(x,y) {
        this.name = "powerup";
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.image = new Image();
        this.image.src = './images/itembox.png';
        this.screen = 'game';
        this.moveSpeed = 2;
    }

    perframe() {
        this.x-=this.moveSpeed;
    }

    draw(context) {
        context.drawImage(this.image,this.x,this.y,this.width,this.height);
    }

    givePlayerWeapon(player) {
        let weapons = player.weapons;
        let weapon = (Math.round(Math.random()*player.weapons.length)-2)+1;
		if (weapons[weapon] == player.weaponname) this.givePlayerLife(player);
        else player.changeWeapon(player.weapons[weapon]);
    }
}

class expOrb {
    constructor(x,y) {
        this.name = "exporb";
        this.x = x;
        this.y = y;
        this.width = 22;
        this.height = 32;
        this.image = new Image();
        this.image.src = './images/expgem.png'
        this.screen = 'game';
        this.moveSpeed = 2;
    }

    perframe() {
        this.x-=this.moveSpeed;
    }

    draw(context) {
        context.drawImage(this.image,this.x,this.y,this.width,this.height);
    }

    givePlayerEXP(player) {
        player.kills++;
    }
}

class trainingOrb {
    constructor(x,y,weaponname) {
        this.name = "trainingorb";
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.weaponname = weaponname;
        this.image = new Image();
        this.image.src = './images/testpowerup.png';
        this.screen = 'game';
        this.moveSpeed = 0;
    }

    perframe() {

    }

    draw(context) {
        context.fillStyle = 'white';
        context.font = "12px Consolas";
        context.fillText(this.weaponname, this.x, this.y-20);

        context.drawImage(this.image,this.x,this.y,this.width,this.height);
    }

    givePlayerWeapon(player) {
        player.changeWeapon(this.weaponname);
    }
}
