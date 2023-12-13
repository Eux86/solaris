export class Logger {
    private static maxLogs = 4;
    private static logsContainer = document.getElementById('logs')!;
    private static instance: Logger;
    private static logs: string[] = [];

    public static get() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public static log(value: string) {
        if (Logger.logs.length > Logger.maxLogs) {
            Logger.logs.splice(Logger.logs.length-1,1);
        }
        Logger.logs.unshift(value);
        Logger.updateLogs();
    }

    public static updateLogs() {
        Logger.logsContainer.innerHTML = ''; // Clear the existing content

        // Display the last 10 logs
        for (let i = 0; i < Logger.logs.length; i++) {
            const logElement = document.createElement('div');
            logElement.textContent = Logger.logs[i];
            Logger.logsContainer.appendChild(logElement);
        }
    }
}