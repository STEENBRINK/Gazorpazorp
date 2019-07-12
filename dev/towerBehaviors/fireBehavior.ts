interface FireBehavior {
    fire() : void;
    upgrade(tower : Tower) : FireBehavior;
}