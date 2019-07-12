/// <reference path="gameobject.ts" />

class GameOver extends GameObject{
    constructor() {
        super(window.innerWidth / 2 - 50, window.innerHeight / 2 - 25, "gameover");
        this.div.innerHTML = "GAME OVER";
    }
}