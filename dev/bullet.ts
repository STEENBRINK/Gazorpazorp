/// <reference path="gameobject.ts" />


class Bullet extends GameObject{
    
    private speed : number = 5;
    private speedX : number = 0;
    private speedY : number = 0;

    constructor(x:number, y:number, rotation : number, tag:string) {
        super(x, y, tag);

        this.speedX = this.speed * Math.cos(rotation / 180 * Math.PI);
        this.speedY = this.speed * Math.sin(rotation / 180 * Math.PI);
    }

    public update() : void {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.isOutsideWindow()) {
            this.remove();
        }
    }

    private isOutsideWindow() : boolean {
        return(this.x > window.innerWidth ||
               this.x + this.width < 0 ||
               this.y > window.innerHeight ||
               this.y + this.height < 0);
    }
}