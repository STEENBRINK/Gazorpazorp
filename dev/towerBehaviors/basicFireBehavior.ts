class BasicFireBehavior implements FireBehavior {
    
    constructor(tower : Tower) {
        tower.bullets = 0;

        tower.div.className = "";
        tower.div.classList.add("small-tower");
    }

    public fire(): void {
        // Do nothing.
    }

    public upgrade(tower : Tower) : FireBehavior {
        // from basic to single shot tower.
        tower.bullets = 0;
        tower.div.classList.remove("small-tower");
        return new SingleShotFireBehavior(tower);
    }
}