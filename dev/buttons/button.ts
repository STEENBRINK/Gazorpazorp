class Button implements Subject{

    protected observers : Observer[] = []
    private pause : boolean = false
    protected div : HTMLElement

    constructor(tag:string) {
        this.div = document.getElementsByTagName(tag)[0] as HTMLElement
        this.div.addEventListener("click", (e:MouseEvent) => this.handleClick(e))
    }

    protected handleClick(event: MouseEvent) : void {
        if(!this.pause) {
            for(let o of this.observers) {
                o.notify()
            }
        }
    }

    public subscribe(observer: Observer): void {
        this.observers.push(observer)
    }

    public unSubscribe(o: Observer): void {
        let i:number = this.observers.indexOf(o)
        if(i != -1) {
            this.observers.splice(i, 1)
        }
    }

    public stop() : void {
        this.pause = true
    }
}