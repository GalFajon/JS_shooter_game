class gameController {
    constructor(canvas,context) {
    this.andreBackground = new Image();
    this.andreBackground.src = "./images/andrebackground.png";

    this.secindryBackground = new Image();
    this.secindryBackground.src = "./images/secindrybackground.png";

    this.titleScreenBackground = new Image();
    this.titleScreenBackground.src = "./images/titlebackground.png";

    this.twoplayerBackground = new Image();
    this.twoplayerBackground.src = "./images/twoplayerbackground.png";

    this.players = [];
    this.enemies = [];
    this.buttons = [];
    this.items = [];

    this.canvas = canvas;
    this.context = context;

    //enemy spawning
    this.spawnTimer = 1000;
    this.droneSpawnChance = 0.4;
    this.turretSpawnChance = 0.7;
    this.soldierSpawnChance = 1;
    this.itemSpawnChance = 1;
    this.enemyLimit = 10;

    //gameplay vars
    this.timer = 0;
    //difficulty
    this.difficulty = 1;
    this.enemiesSpawned = 0;
    this.currentScreen = 'game';
    }

    perframe() {
        this.timer+=17;

        if (this.currentScreen == "andregame" || this.currentScreen == "secindrygame" || this.currentScreen == "2pgame") {
        if (this.timer >= this.spawnTimer) this.spawnEnemy(this.canvas.width,this.canvas.height);
    
        for (let i=0;i<this.players.length;i++) 
            this.players[i].perframe();

        for (let i=0;i<this.enemies.length;i++) 
            this.enemies[i].perframe(this.players);

        for (let i=0;i<this.items.length;i++) 
            this.items[i].perframe();

        this.checkCollisions();
        //check if out of bounds
        }

        this.draw();
    }

    draw() {
       if (this.currentScreen == "mainmenu")
       {
        context.drawImage(this.titleScreenBackground,0,0,this.canvas.width,this.canvas.height);

        context.fillStyle='white';
        context.font = "48px Arial";
        context.fillText("RAO vaja 7",this.canvas.width/2-150,160);
        context.font = "18px Arial";
        context.fillText("(Click on the blue text underneath the images below to begin!)",this.canvas.width/2-280,200);

        context.font = "15px Arial";
        context.fillText("-block bullets with your sword",this.canvas.width/2-290,this.canvas.height/2+70);
        context.fillText("-use magic",this.canvas.width/2-290,this.canvas.height/2+85);
        context.fillText("-use a variety of swords",this.canvas.width/2-290,this.canvas.height/2+100);

        context.fillText("-manage your ammo",this.canvas.width/2+50,this.canvas.height/2+70);
        context.fillText("-teleport dash",this.canvas.width/2+50,this.canvas.height/2+85);
        context.fillText("-use many different firearms",this.canvas.width/2+50,this.canvas.height/2+100);

        context.fillText("-play as Gunner (P1) and Swordsman (P2)",this.canvas.width/2-190,this.canvas.height/2+190);

        context.fillStyle='white';
        context.font = "18px Courier New";
        context.fillText("(P1) W,A,S,D or (P2) Arrows = movement,",this.canvas.width/2-250,this.canvas.height-(this.canvas.height/20)-30)
        context.fillText(" (P1) Space or (P2) '-' = attack,",this.canvas.width/2-250,this.canvas.height-(this.canvas.height/20)-60);
        context.fillText(" (P1) Shift or (P2) '.' = special move",this.canvas.width/2-250,this.canvas.height-(this.canvas.height/20)-90)
        context.fillText("(Gunner) R = reload, E = eject magazine",this.canvas.width/2-250,this.canvas.height-(this.canvas.height/20)-0)
        }

        if (this.currentScreen == "retry") {
        this.context.fillStyle = 'black';
        this.context.fillRect(0,0, this.canvas.width, this.canvas.height);
        context.fillStyle='red';
        context.font = "48px Courier new";
        context.fillText("MISSION FAILED",this.canvas.width/2-200,300)
        }
        if (this.currentScreen == "andregame") {
            context.drawImage(this.andreBackground,0,0,this.canvas.width,this.canvas.height);

            this.context.fillStyle = 'white';
            context.font = "24px Consolas";
            context.fillText("Difficulty: "+this.difficulty+" Waves survived: "+this.enemiesSpawned,this.canvas.width/2-200,50);
        }
        if (this.currentScreen == "secindrygame") {
            context.drawImage(this.secindryBackground,0,0,this.canvas.width,this.canvas.height);

            this.context.fillStyle = 'white';
            context.font = "24px Consolas";
            context.fillText("Difficulty: "+this.difficulty+" Waves survived: "+this.enemiesSpawned,this.canvas.width/2-200,50);
        }
        if (this.currentScreen == "2pgame") {
            context.drawImage(this.twoplayerBackground,0,0,this.canvas.width,this.canvas.height);
            this.context.fillStyle = 'white';
            context.font = "24px Consolas";
            context.fillText("Difficulty: "+this.difficulty+" Waves survived: "+this.enemiesSpawned,this.canvas.width/2-200,50);
        }

       for (let i=0;i<this.players.length;i++) 
       this.players[i].draw(this.context);

        for (let i=0;i<this.enemies.length;i++) 
       this.enemies[i].draw(this.context);
    
       for (let i=0;i<this.buttons.length;i++) 
       this.buttons[i].draw(this.context);

       for (let i=0;i<this.items.length;i++) 
       this.items[i].draw(this.context);
    }

    spawnEnemy() {
        let spawnChance = Math.random();
        let spawnCoord = (Math.random()*(this.canvas.height-(this.canvas.height/8))) + 250;

        if (this.enemies.length <= this.enemyLimit) {
        if (this.currentScreen == "andregame") {
            if (spawnChance <= this.droneSpawnChance) this.enemies.push(new EnemyDrone(this.canvas.width,spawnCoord,"teleportdrone",this.players,this.difficulty));
            if (spawnChance >= this.droneSpawnChance && spawnChance <= this.turretSpawnChance) this.enemies.push(new EnemyTurret(this.canvas.width,spawnCoord,"autoturret",this.difficulty));
            if (spawnChance >= this.turretSpawnChance && spawnChance <= this.soldierSpawnChance) this.enemies.push(new enemySoldier(this.canvas.width,spawnCoord,"handgun",this.difficulty,this.players));
        }

        if (this.currentScreen == "secindrygame") {
            if (spawnChance <= this.droneSpawnChance) this.enemies.push(new EnemyDrone(this.canvas.width,spawnCoord,"stalker",this.players,this.difficulty));
            if (spawnChance >= this.droneSpawnChance && spawnChance <= this.turretSpawnChance) this.enemies.push(new EnemyTurret(this.canvas.width,spawnCoord,"semiturret",this.difficulty));
            if (spawnChance >= this.turretSpawnChance && spawnChance <= this.soldierSpawnChance) this.enemies.push(new enemySoldier(this.canvas.width,spawnCoord,"shotgun",this.difficulty,this.players));
        }
        if (this.currentScreen == "2pgame") {
            if (spawnChance <= this.droneSpawnChance) this.enemies.push(new EnemyDrone(this.canvas.width,spawnCoord,"stalker",this.players,this.difficulty));
            if (spawnChance >= this.droneSpawnChance && spawnChance <= this.turretSpawnChance) this.enemies.push(new EnemyTurret(this.canvas.width,spawnCoord,"pillar",this.difficulty));
            if (spawnChance >= this.turretSpawnChance && spawnChance <= this.soldierSpawnChance) this.enemies.push(new enemySoldier(this.canvas.width,spawnCoord,"handgun",this.difficulty,this.players));
        }}

        spawnChance = Math.random();
        spawnCoord = (Math.random()*(this.canvas.height-250)) + 250;
        if (spawnChance < this.itemSpawnChance) this.items.push(new powerUp(this.canvas.width,spawnCoord))

        this.timer = 0;
        this.enemiesSpawned += 1;
        if (this.enemiesSpawned > 30) {
            this.difficulty = 2;
        }
        if (this.enemiesSpawned > 90) {
            this.difficulty = 3;
        }
    }

    titleScreen() {
        this.currentScreen = "mainmenu";
        this.players = [];
        this.enemies = [];
        this.items = [];
        this.buttons = [
            new Button(this.canvas.width/2+50,this.canvas.height/2,"Play as Gunner",function(){this.startAndregame();}.bind(this),"mainmenu"),
            new Button(this.canvas.width/2+50,this.canvas.height/2+30,"Combat training",function(){this.startAndretraining();}.bind(this),"mainmenu"),
            new Button(this.canvas.width/2-300,this.canvas.height/2,"Play as Swordsman",function(){this.startSecindrygame();}.bind(this),"mainmenu"),
            new Button(this.canvas.width/2-300,this.canvas.height/2+30,"Combat training",function(){this.startSecindrytraining();}.bind(this),"mainmenu"),
            new Button(this.canvas.width/2-100,this.canvas.height/2+150,"Play Co-op",function(){this.start2Pgame();}.bind(this),"mainmenu") //FIX ENEMY TARGETING BUG
        ];
        this.addControls(this.players,this.buttons,this.canvas);
    }

    retryScreen() {
        this.difficulty = 1;
        this.players = [];
        this.enemies = [];
        this.items = [];
        this.currentScreen = "retry";
        this.buttons = [
            new Button(this.canvas.width/2-50,this.canvas.height/2,"Retry",function(){this.titleScreen();}.bind(this),"retry"),
        ];
    }

    startAndretraining() {
        let inputsettings = {
            Left:65, //a
            Right:68, //d
            Up:87, //w
            Down:83, //s
            
            Attack:0, //left mouse button
            Special:16, //shift

            Eject:69, //e
            Reload:82, //r
            Attack:32 //space
        }

        this.items = [
            new trainingOrb(100,300,"shotgun"),
            new trainingOrb(200,300,"burst"),
            new trainingOrb(300,300,"submachine"),
            new trainingOrb(400,300,"handgun")
        ];
        this.enemies = [];
        this.players = [new Andre(10,this.canvas.height/2,inputsettings,this.canvas.width,this.canvas.height)];
        this.buttons = [];
        this.addControls(this.players);
        this.currentScreen = "andregame";
        this.difficulty = 1;
        this.droneSpawnChance = 1;
        this.turretSpawnChance = 0;
        this.soldierSpawnChance = 0;
        this.enemyLimit = 1;
        this.enemiesSpawned = 0;
        this.spawnTimer = 2000;
        this.itemSpawnChance = 0;
        //adjust game stats
    }

    startSecindrytraining() {
        let inputsettings = {
            Left:65, //a
            Right:68, //d
            Up:87, //w
            Down:83, //s
            
            Attack:0, //left mouse button
            Special:16, //shift

            Eject:69, //e
            Reload:82, //r
            Attack:32 //space
        };

        this.items = [
            new trainingOrb(100,300,"katana"),
            new trainingOrb(200,300,"dagger"),
            new trainingOrb(300,300,"musketblade"),
            new trainingOrb(400,300,"greatsword")
        ];
        this.buttons = [];
        this.players = [new Secindry(10,this.canvas.height/2,inputsettings,this.canvas.width,this.canvas.height)];
        this.addControls(this.players);
        this.currentScreen = "secindrygame";
        this.difficulty = 1;
        this.droneSpawnChance = 1;
        this.turretSpawnChance = 0;
        this.soldierSpawnChance = 0;
        this.itemSpawnChance = 0;
        this.enemyLimit = 1;
        this.enemiesSpawned = 0;
        this.spawnTimer = 1000;
        
        //adjust game stats
    }


    startAndregame() {
        let inputsettings = {
            Left:65, //a
            Right:68, //d
            Up:87, //w
            Down:83, //s
            
            Attack:0, //left mouse button
            Special:16, //shift

            Eject:69, //e
            Reload:82, //r
            Attack:32 //space
        }

        this.items = [];
        this.enemies = [];
        this.players = [new Andre(10,this.canvas.height/2,inputsettings,this.canvas.width,this.canvas.height)];
        this.buttons = [];
        this.addControls(this.players);
        this.currentScreen = "andregame";

        this.droneSpawnChance = 0.3;
        this.turretSpawnChance = 0.6;
        this.soldierSpawnChance = 1;
        this.itemSpawnChance = 0.3
        this.enemyLimit = 6;
        this.enemiesSpawned = 0;
        this.spawnTimer = 1200;
        //adjust game stats
    }
    startSecindrygame() {
        let inputsettings = {
            Left:65, //a
            Right:68, //d
            Up:87, //w
            Down:83, //s
            
            Attack:0, //left mouse button
            Special:16, //shift

            Eject:69, //e
            Reload:82, //r
            Attack:32 //space
        };

        this.items = [];
        this.buttons = [];
        this.players = [new Secindry(10,this.canvas.height/2,inputsettings,this.canvas.width,this.canvas.height)];
        this.addControls(this.players);
        this.currentScreen = "secindrygame";

        this.droneSpawnChance = 0.5;
        this.turretSpawnChance = 0.7;
        this.soldierSpawnChance = 1;
        this.itemSpawnChance = 0.3
        this.enemyLimit = 10;
        this.enemiesSpawned = 0;
        this.spawnTimer = 1000;
        
        //adjust game stats
    }
    start2Pgame() {
        let p1input = {
            Left:65, //a
            Right:68, //d
            Up:87, //w
            Down:83, //s
            Special:16, //shift

            Eject:69, //e
            Reload:82, //r
            Attack:32 //space
        };

        let p2input = {
            Left:37,
            Right:39,
            Up:38, 
            Down:40,
            
            Attack:189,
            Special:190, 
        }
        this.items = [];
        this.buttons = [];
        this.players = [new Andre(50,400,p1input,this.canvas.width,this.canvas.height), new Secindry(50,300,p2input,this.canvas.width,this.canvas.height)]; //change the controls!
        this.addControls(this.players);
        this.currentScreen = "2pgame";
        this.droneSpawnChance = 0.4;
        this.turretSpawnChance = 0.7;
        this.soldierSpawnChance = 1;
        this.enemyLimit = 15;
        this.enemiesSpawned = 0;
        this.spawnTimer = 1000;
        this.difficulty=1;
        this.itemSpawnChance = 0.4;
        //adjust game stats
    }

    addControls() {
        document.addEventListener('keydown',function (event) {
            for (let i=0;i<this.players.length;i++) 
                this.players[i].inputKeyDown(event);
        }.bind(this));

        document.addEventListener('keyup',function (event) {
            for (let i=0;i<this.players.length;i++) 
                this.players[i].inputKeyUp(event);
        }.bind(this));
        
        document.addEventListener('mousedown',function (event) {
                if (this.canvas != undefined && this.buttons != undefined) {
                let rect = this.canvas.getBoundingClientRect();
                for (let i=0;i<this.buttons.length;i++) {
                    this.buttons[i].ifclick(event.clientX-rect.left,event.clientY-rect.top);
                }}
        }.bind(this));
    }
    
    checkCollisions() {
        	//collision checking
        //player v enemy
        for (let i=0; i<this.players.length;i++) {
            
            for (let o=0;o<this.items.length;o++) {
                if (this.items[o].x < 0) this.items.splice(o,1);
                if (collisionDetection(this.players[i],this.items[o])){
                   if (this.items[o].name == "powerup" || this.items[o].name == "trainingorb") {
                    this.items[o].givePlayerWeapon(this.players[i]);
                   }
                   if (this.items[o].name == "exporb") {
                       this.items[o].givePlayerEXP(this.players[i]);
                       if(this.players[i].kills >= (this.players[i].levelgap * this.players[i].level)) this.players[i].levelup();
                   };

                   if (this.items[o].name != "trainingorb") this.items.splice(o,1);
                }
            }

		for (let j=0; j<this.enemies.length;j++) {
            if (this.enemies[j].x < 0) {this.enemies.splice(j,1);}

            if (collisionDetection(this.players[i],this.enemies[j])) {
                this.players[i].health-=this.enemies[j].damage; //replace with physical damage
                this.enemies.splice(j,1);
                if (this.players[i].health <= 0) this.players.splice(i,1);
                if (this.players.length <= 0) this.retryScreen();
            }
    
            if (this.enemies[j].bullets != undefined) {
                for (let k=0;k<this.enemies[j].bullets.length;k++) {
                if (this.enemies[j].bullets[k].x < 0) this.enemies[j].bullets.splice(k,1);
                if (collisionDetection(this.players[i],this.enemies[j].bullets[k])) {
                    this.players[i].health-=this.enemies[j].damage;
                    if (this.players[i].health <= 0) this.players.splice(i,1);
                    this.enemies[j].bullets.splice(k,1);
                    if (this.players.length <= 0) this.retryScreen();
                }
                if (this.players[i].slashes != undefined) {
                for (let n=0;n<this.players[i].slashes.length;n++) { 
                    if (collisionDetection(this.players[i].slashes[n],this.enemies[j].bullets[k])) {
                        this.enemies[j].bullets.splice(k,1);
                    }
                }}
                }
            }
    
            if (this.players[i].bullets != undefined) {
                for (let k=0;k<this.players[i].bullets.length;k++) {
                    if (this.players[i].bullets[k].x > this.canvas.width) this.players[i].bullets.splice(k,1);
                    if (collisionDetection(this.players[i].bullets[k],this.enemies[j])) {
                        this.enemies[j].health -= this.players[i].weaponDamage;
                        this.players[i].bullets.splice(k,1);
                        if (this.enemies[j].health <= 0) {
                            this.items.push(new expOrb(this.enemies[j].x-(Math.random()*40),this.enemies[j].y));
                            this.items.push(new expOrb(this.enemies[j].x+(Math.random()*40),this.enemies[j].y));
                            this.items.push(new expOrb(this.enemies[j].x,this.enemies[j].y-(Math.random()*40)));
                            this.enemies.splice(j,1);
                        }
                }
                }
            }
    
            if (this.players[i].slashes != undefined) {
                for (let m=0;m<this.players[i].slashes.length;m++) {
                    if (collisionDetection(this.players[i].slashes[m],this.enemies[j]) && this.enemies[j].canBeDamaged) {
                        this.enemies[j].health -= this.players[i].weaponDamage;
                        this.enemies[j].graceTimer = 0;
                        if (this.enemies[j].health <= 0) {
                            this.items.push(new expOrb(this.enemies[j].x-(Math.random()*40),this.enemies[j].y));
                            this.items.push(new expOrb(this.enemies[j].x+(Math.random()*40),this.enemies[j].y));
                            this.items.push(new expOrb(this.enemies[j].x,this.enemies[j].y-(Math.random()*40)));
                            this.enemies.splice(j,1);
                        }
                }
                }
            }
    }
    }
}
}