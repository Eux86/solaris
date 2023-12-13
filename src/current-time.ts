import { Logger } from "./logger";

export class CurrentTime {
    private static instance: CurrentTime;
    private time = 0;

    private constructor() {}

    public static getInstance() {
        if (!CurrentTime.instance) {
            CurrentTime.instance = new CurrentTime();
        }
        return CurrentTime.instance;
    }

    public increment() {
        this.time += 1;
    }

    public get() {
        return this.time;
    }
}
