class MultiShotFireBehavior {

    private rotation : number = 0;
    private _tower : Tower;
    private intervalid: number;

    constructor(tower : Tower) {
        this._tower = tower;

        this._tower.div.className = "";
        this._tower.div.classList.add("multishot-tower");
        
        // TODO CLEAR WHEN CHANGING BEHAVIOR
        this.intervalid = setInterval(() => this.fire(), 1900);
    }

    public fire(): void {
        // Fire one bullet, then turn
        while(this.rotation != 360 && this._tower.bullets > 0) {
            Game.getInstance().addGameObject(new Bullet(
                                        this._tower.x + 40, 
                                        this._tower.y + 60, this.rotation,
                                        "bullet-blue"));
            this._tower.bullets--;
            this.rotation += 45;
        }

        this.rotation = 0;
    }

    public upgrade(tower : Tower) : FireBehavior {
        return this;
    }
}