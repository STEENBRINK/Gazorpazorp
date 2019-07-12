interface Subject {
    subscribe(observer : Observer) : void;
    unSubscribe(observer : Observer) : void; 
}