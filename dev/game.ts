class Game {

    public  ui              : UI
    private pause           : boolean = false
    private zombiecounter   : number = 0
    private gameObjects     : GameObject[] = []
    private static instance : Game

    public static getInstance() : Game {
        if(!this.instance) this.instance = new Game()
        return Game.instance
    }

    private constructor() {
    }

    public init(){
        this.ui = new UI();
            
        let basicTower : Tower = new Tower(200, 200, this)
        basicTower.fireBehavior = new BasicFireBehavior(basicTower)

        let singleShotTower : Tower = new Tower(320, 60, this)
        singleShotTower.fireBehavior = new SingleShotFireBehavior(singleShotTower)
        
        let multiShotTower : Tower = new Tower(600, 240, this)
        multiShotTower.fireBehavior = new MultiShotFireBehavior(multiShotTower)

        this.ui.towerUpgradeButton.subscribe(basicTower)
        this.ui.towerUpgradeButton.subscribe(singleShotTower)
        this.ui.towerUpgradeButton.subscribe(multiShotTower)

        this.gameLoop()
    }

    public addGameObject(b: GameObject) { 
        this.gameObjects.push(b)
    }

    public removeGameObject(b: GameObject) {
        let index = this.gameObjects.indexOf(b)
        this.gameObjects.splice(index, 1)
    }

    private gameLoop() : void {
        

        if(this.ui.life <= 0) {
            this.gameOver()
        }
        
        this.zombiecounter++;
        if(this.zombiecounter > 10){
            this.zombiecounter = 0
            this.addGameObject(new Zombie())
        }
        
        for(let b of this.gameObjects) {
            b.update()
            b.draw()
        }

        this.checkCollision()

        if (!this.pause) {
            requestAnimationFrame(() => this.gameLoop())
        }
    }

    private checkCollision() {
        
        for(let go1 of this.gameObjects) {
            for(let go2 of this.gameObjects) {

                // Bullet vs Zombie collision
                if(go1 instanceof Bullet && go2 instanceof Zombie) {
                    if(go1.hasCollision(go2)) {
                        this.ui.addCoins(100)
                        go1.remove()
                        go2.remove()
                        break
                    }
                }
            }

            // Zombie exits screen (left)
            if(go1 instanceof Zombie) {
                if(go1.x < 0) {
                    go1.remove()
                    this.ui.decreaseLife(4)
                }
            }
        }
    }

    private gameOver() : void {
        this.pause = true
        this.ui.stop()
        new GameOver()
    }
}

window.addEventListener("load", () => Game.getInstance().init())