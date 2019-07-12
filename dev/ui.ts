class UI implements Observer {
    
    private coins       : number        = 0
    public  life        : number        = 100

    private coindiv     : HTMLElement
    private lifediv     : HTMLElement

    public  bulletUpgradeButton  : Button
    public  towerUpgradeButton  : TowerButton

    constructor() {
        this.coindiv = document.getElementsByTagName("counter")[0] as HTMLElement
        this.coindiv.innerHTML = this.coins.toString()

        this.lifediv = document.querySelector("lifebar progressbar") as HTMLElement
        this.lifediv.style.width = this.life + "%"

        this.lifediv.classList.add("blinking")

        this.bulletUpgradeButton  = new Button("bulletbutton")
        this.towerUpgradeButton  = new TowerButton()

        this.bulletUpgradeButton.subscribe(this)
    }

    public notify(): void {
        this.coins -= 10
        this.coindiv.innerHTML = this.coins.toString()
    }

    public addCoins(amount : number) : void {
        this.coins += amount
        this.coindiv.innerHTML = this.coins.toString()
    }

    public decreaseLife(amount : number) : void {
        this.life -= amount
        this.lifediv.style.width = this.life + "%"
    }

    public stop() : void {
        this.bulletUpgradeButton.stop()
    }
}