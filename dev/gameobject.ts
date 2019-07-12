/**
 * GameObject
 */
class GameObject {
    //Fields
    private _x      : number = 0;
    private _y      : number = 0;
    private _width  : number = 0;
    private _height : number = 0;
    private _div    : HTMLElement;
    
    //Properties
    public get x(): number          { return this._x;       }
    public set x(value: number)     { this._x = value;      }

    public get y(): number          { return this._y;       }
    public set y(value: number)     { this._y = value;      }

    public get width() : number     { return this._width;   }
    public set width(v : number)    { this._width = v;      }
    
    public get height() : number    { return this._height;  }
    public set height(v : number)   { this._height = v;     }

    public get div() : HTMLElement  { return this._div;     }
    public set div(v : HTMLElement) { this._div = v;        }

    /**
     * Basic game object
     * @param x X position
     * @param y Y position
     * @param tag Html semantic tag name
     * @param parent parent object to append to
     */
    constructor(x: number, y: number, tag: string) {
        this._x      = x;
        this._y      = y;

        let parent:HTMLElement = <HTMLElement> document.getElementsByTagName("game")[0];

        this._div    = document.createElement(tag);
        parent.appendChild(this._div);

        this._width  = this._div.clientWidth;
        this._height = this._div.clientHeight;

        this.draw();
    }
    
    /**
     * Update function to override by child
     */
    public update() : void {
        
    }
    
    /**
     * Draw function to override by child
     */
    public draw() : void {
        this._div.style.transform = `translate(${this._x}px, ${this._y}px)`;
    }

    public hasCollision(obj : GameObject) : boolean {
        return (this.x < obj.x + obj.width &&
                this.x + this.width > obj.x &&
                this.y < obj.y + obj.height &&
                this.y + this.height > obj.y);
    }

    public remove() {
        this.div.remove();
        Game.getInstance().removeGameObject(this);
    }
}