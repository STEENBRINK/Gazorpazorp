/// <reference path="gameobject.ts" />

class Tower extends GameObject implements Observer {

    private _bullets        : number = 16;
    private _fireBehavior   : FireBehavior;
    private bulletsDisplay  : HTMLElement;
    public  game:Game;

	public get bullets(): number  {
		return this._bullets;
	}

	public set bullets(value: number ) {
		this._bullets = value;
        this.displayBullets();
	}

    public set fireBehavior(b : FireBehavior) {
        this._fireBehavior = b;
    }
    public get fireBehavior() : FireBehavior {
        return this._fireBehavior;
    }

    constructor(x:number, y:number, g:Game) {
        super(x, y, "tower");

        this.game = g;

        this.bulletsDisplay = document.createElement("div");
        this.div.appendChild(this.bulletsDisplay);
        this.bulletsDisplay.style.fontSize = "14px";

        this.displayBullets();

        // luister naar fire button
        this.game.ui.bulletUpgradeButton.subscribe(this);
    }

    private displayBullets() : void {
        this.bulletsDisplay.innerHTML = this._bullets + "";
    }

    // bullet button was clicked
    // todo can still buy bullets when coins < 0
    public notify(): void {
        this._bullets++;
        this.displayBullets();
    }

    public upgrade() : void {
        this._fireBehavior = this._fireBehavior.upgrade(this);
    }
}