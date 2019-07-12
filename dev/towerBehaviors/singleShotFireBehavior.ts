class SingleShotFireBehavior implements FireBehavior {
    private _tower      : Tower
    private rotation    : number = 0;
    private intervalid  : number;

        constructor(tower : Tower) {
        this._tower = tower;

        this._tower.div.className = "";
        this._tower.div.classList.add("singleshot-tower");

        // TODO CLEAR WHEN CHANGING BEHAVIOR
        this.intervalid = setInterval(() => this.fire(), 900);
    }

    public fire(): void {
        // Fire one bullet, then turn
        if (this._tower.bullets > 0) {
            Game.getInstance().addGameObject(new Bullet(
                                        this._tower.x + 48, 
                                        this._tower.y + 60, this.rotation,
                                        "bullet-red"));
            this._tower.bullets--;
            this.turn45Degrees();
        }
    }

    public upgrade(tower : Tower) : FireBehavior {
        // from single shot tower to multi shot tower.
        tower.bullets = 0;
        tower.div.classList.remove("singleshot-tower");
        return new MultiShotFireBehavior(tower);
    }

    private turn45Degrees() : void {
        this.rotation += 45;
        if (this.rotation == 360) this.rotation = 0;
    }
}