"use strict";
class GameObject {
    constructor(x, y, tag) {
        this._x = 0;
        this._y = 0;
        this._width = 0;
        this._height = 0;
        this._x = x;
        this._y = y;
        let parent = document.getElementsByTagName("game")[0];
        this._div = document.createElement(tag);
        parent.appendChild(this._div);
        this._width = this._div.clientWidth;
        this._height = this._div.clientHeight;
        this.draw();
    }
    get x() { return this._x; }
    set x(value) { this._x = value; }
    get y() { return this._y; }
    set y(value) { this._y = value; }
    get width() { return this._width; }
    set width(v) { this._width = v; }
    get height() { return this._height; }
    set height(v) { this._height = v; }
    get div() { return this._div; }
    set div(v) { this._div = v; }
    update() {
    }
    draw() {
        this._div.style.transform = `translate(${this._x}px, ${this._y}px)`;
    }
    hasCollision(obj) {
        return (this.x < obj.x + obj.width &&
            this.x + this.width > obj.x &&
            this.y < obj.y + obj.height &&
            this.y + this.height > obj.y);
    }
    remove() {
        this.div.remove();
        Game.getInstance().removeGameObject(this);
    }
}
class Bullet extends GameObject {
    constructor(x, y, rotation, tag) {
        super(x, y, tag);
        this.speed = 5;
        this.speedX = 0;
        this.speedY = 0;
        this.speedX = this.speed * Math.cos(rotation / 180 * Math.PI);
        this.speedY = this.speed * Math.sin(rotation / 180 * Math.PI);
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.isOutsideWindow()) {
            this.remove();
        }
    }
    isOutsideWindow() {
        return (this.x > window.innerWidth ||
            this.x + this.width < 0 ||
            this.y > window.innerHeight ||
            this.y + this.height < 0);
    }
}
class Game {
    constructor() {
        this.pause = false;
        this.zombiecounter = 0;
        this.gameObjects = [];
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new Game();
        return Game.instance;
    }
    init() {
        this.ui = new UI();
        let basicTower = new Tower(200, 200, this);
        basicTower.fireBehavior = new BasicFireBehavior(basicTower);
        let singleShotTower = new Tower(320, 60, this);
        singleShotTower.fireBehavior = new SingleShotFireBehavior(singleShotTower);
        let multiShotTower = new Tower(600, 240, this);
        multiShotTower.fireBehavior = new MultiShotFireBehavior(multiShotTower);
        this.ui.towerUpgradeButton.subscribe(basicTower);
        this.ui.towerUpgradeButton.subscribe(singleShotTower);
        this.ui.towerUpgradeButton.subscribe(multiShotTower);
        this.gameLoop();
    }
    addGameObject(b) {
        this.gameObjects.push(b);
    }
    removeGameObject(b) {
        let index = this.gameObjects.indexOf(b);
        this.gameObjects.splice(index, 1);
    }
    gameLoop() {
        if (this.ui.life <= 0) {
            this.gameOver();
        }
        this.zombiecounter++;
        if (this.zombiecounter > 10) {
            this.zombiecounter = 0;
            this.addGameObject(new Zombie());
        }
        for (let b of this.gameObjects) {
            b.update();
            b.draw();
        }
        this.checkCollision();
        if (!this.pause) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    checkCollision() {
        for (let go1 of this.gameObjects) {
            for (let go2 of this.gameObjects) {
                if (go1 instanceof Bullet && go2 instanceof Zombie) {
                    if (go1.hasCollision(go2)) {
                        this.ui.addCoins(100);
                        go1.remove();
                        go2.remove();
                        break;
                    }
                }
            }
            if (go1 instanceof Zombie) {
                if (go1.x < 0) {
                    go1.remove();
                    this.ui.decreaseLife(4);
                }
            }
        }
    }
    gameOver() {
        this.pause = true;
        this.ui.stop();
        new GameOver();
    }
}
window.addEventListener("load", () => Game.getInstance().init());
class GameOver extends GameObject {
    constructor() {
        super(window.innerWidth / 2 - 50, window.innerHeight / 2 - 25, "gameover");
        this.div.innerHTML = "GAME OVER";
    }
}
class Tower extends GameObject {
    constructor(x, y, g) {
        super(x, y, "tower");
        this._bullets = 16;
        this.game = g;
        this.bulletsDisplay = document.createElement("div");
        this.div.appendChild(this.bulletsDisplay);
        this.bulletsDisplay.style.fontSize = "14px";
        this.displayBullets();
        this.game.ui.bulletUpgradeButton.subscribe(this);
    }
    get bullets() {
        return this._bullets;
    }
    set bullets(value) {
        this._bullets = value;
        this.displayBullets();
    }
    set fireBehavior(b) {
        this._fireBehavior = b;
    }
    get fireBehavior() {
        return this._fireBehavior;
    }
    displayBullets() {
        this.bulletsDisplay.innerHTML = this._bullets + "";
    }
    notify() {
        this._bullets++;
        this.displayBullets();
    }
    upgrade() {
        this._fireBehavior = this._fireBehavior.upgrade(this);
    }
}
class UI {
    constructor() {
        this.coins = 0;
        this.life = 100;
        this.coindiv = document.getElementsByTagName("counter")[0];
        this.coindiv.innerHTML = this.coins.toString();
        this.lifediv = document.querySelector("lifebar progressbar");
        this.lifediv.style.width = this.life + "%";
        this.lifediv.classList.add("blinking");
        this.bulletUpgradeButton = new Button("bulletbutton");
        this.towerUpgradeButton = new TowerButton();
        this.bulletUpgradeButton.subscribe(this);
    }
    notify() {
        this.coins -= 10;
        this.coindiv.innerHTML = this.coins.toString();
    }
    addCoins(amount) {
        this.coins += amount;
        this.coindiv.innerHTML = this.coins.toString();
    }
    decreaseLife(amount) {
        this.life -= amount;
        this.lifediv.style.width = this.life + "%";
    }
    stop() {
        this.bulletUpgradeButton.stop();
    }
}
class Zombie extends GameObject {
    constructor() {
        super(window.innerWidth, Math.random() * window.innerHeight, "zombie");
        this.speed = 2;
        this.setTarget();
    }
    update() {
        this.x -= this.xspeed;
        this.y -= this.yspeed;
        if (this.x + this.width < 0) {
            this.remove();
        }
        this.xdist = this.x - this.xtarget;
        this.ydist = this.y - this.ytarget;
        if (Math.sqrt(this.xdist * this.xdist + this.ydist * this.ydist) < 10) {
            this.setTarget();
        }
    }
    setTarget() {
        this.xtarget = this.x - 200;
        this.ytarget = Math.random() * (window.innerHeight - this.y);
        this.setSpeed(this.x - this.xtarget, this.y - this.ytarget);
    }
    setSpeed(xdist, ydist) {
        let distance = Math.sqrt(xdist * xdist + ydist * ydist);
        this.xspeed = (xdist / distance) * this.speed;
        this.yspeed = (ydist / distance) * this.speed;
    }
}
class Button {
    constructor(tag) {
        this.observers = [];
        this.pause = false;
        this.div = document.getElementsByTagName(tag)[0];
        this.div.addEventListener("click", (e) => this.handleClick(e));
    }
    handleClick(event) {
        if (!this.pause) {
            for (let o of this.observers) {
                o.notify();
            }
        }
    }
    subscribe(observer) {
        this.observers.push(observer);
    }
    unSubscribe(o) {
        let i = this.observers.indexOf(o);
        if (i != -1) {
            this.observers.splice(i, 1);
        }
    }
    stop() {
        this.pause = true;
    }
}
class TowerButton extends Button {
    constructor() {
        super("towerbutton");
        this.progress = 0;
        this.bar = document.querySelector("towerbutton progressbar");
        this.bar.style.width = "0%";
    }
    handleClick(event) {
        this.progress += 10;
        this.bar.style.width = this.progress + "%";
        Game.getInstance().ui.addCoins(-100);
        if (this.progress > 90) {
            this.progress = 0;
            super.handleClick(event);
            Game.getInstance().ui.addCoins(-1000);
            this.notify();
        }
    }
    subscribe(t) {
        this.observers.push(t);
    }
    notify() {
        for (let o of this.observers) {
            o.notify();
        }
    }
}
class BasicFireBehavior {
    constructor(tower) {
        tower.bullets = 0;
        tower.div.className = "";
        tower.div.classList.add("small-tower");
    }
    fire() {
    }
    upgrade(tower) {
        tower.bullets = 0;
        tower.div.classList.remove("small-tower");
        return new SingleShotFireBehavior(tower);
    }
}
class MultiShotFireBehavior {
    constructor(tower) {
        this.rotation = 0;
        this._tower = tower;
        this._tower.div.className = "";
        this._tower.div.classList.add("multishot-tower");
        this.intervalid = setInterval(() => this.fire(), 1900);
    }
    fire() {
        while (this.rotation != 360 && this._tower.bullets > 0) {
            Game.getInstance().addGameObject(new Bullet(this._tower.x + 40, this._tower.y + 60, this.rotation, "bullet-blue"));
            this._tower.bullets--;
            this.rotation += 45;
        }
        this.rotation = 0;
    }
    upgrade(tower) {
        return this;
    }
}
class SingleShotFireBehavior {
    constructor(tower) {
        this.rotation = 0;
        this._tower = tower;
        this._tower.div.className = "";
        this._tower.div.classList.add("singleshot-tower");
        this.intervalid = setInterval(() => this.fire(), 900);
    }
    fire() {
        if (this._tower.bullets > 0) {
            Game.getInstance().addGameObject(new Bullet(this._tower.x + 48, this._tower.y + 60, this.rotation, "bullet-red"));
            this._tower.bullets--;
            this.turn45Degrees();
        }
    }
    upgrade(tower) {
        tower.bullets = 0;
        tower.div.classList.remove("singleshot-tower");
        return new MultiShotFireBehavior(tower);
    }
    turn45Degrees() {
        this.rotation += 45;
        if (this.rotation == 360)
            this.rotation = 0;
    }
}
//# sourceMappingURL=main.js.map