class TowerButton extends Button implements Subject{
    
    private progress:number = 0
    private bar:HTMLElement

    constructor() {
        super("towerbutton")

        this.bar = document.querySelector("towerbutton progressbar") as HTMLElement
        this.bar.style.width = "0%"
    }

    protected handleClick(event: MouseEvent) : void {
        
        this.progress+=10;
        this.bar.style.width = this.progress+"%";
        Game.getInstance().ui.addCoins(-100);

        if(this.progress > 90){
            this.progress = 0;
            super.handleClick(event);
            Game.getInstance().ui.addCoins(-1000);
            this.notify();
        }
    }

    public subscribe(t:Observer){
        this.observers.push(t)
    }

    private notify() {
        for(let o of this.observers) {
            o.notify()
        }
    }
}