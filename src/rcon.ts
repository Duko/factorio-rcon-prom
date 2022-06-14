import { Rcon } from "rcon-client";
import { readFileSync } from 'fs';
import { Statistics } from "./metrics/metricsInterfaces"

export class FactorioRcon extends Rcon {
    public connected: boolean;
    private script: string;

    constructor() {
        super({
            host: process.env["FACTORIO_HOSTNAME"] || "localhost",
            port: parseInt(process.env["FACTORIO_RCON_PORT"]) || 27015,
            password: process.env["FACTORIO_RCON_PASSWORD"] || "roon1aiZaixiaqu"
        });

        this.script = readFileSync('metrics.lua', 'utf8');

        this.on('connect', this.onConnect);
        this.on('end', this.onDisconnect);
        this.on('error', this.onError);
    }

    getHostname(): string {
        return this.config.host + ':' + this.config.port
    }

    getMetrics = async (): Promise<Statistics> => {
        if (!this.connected) await this.connect();
        return JSON.parse(await this.send("/sc "+this.script));
    }

    onConnect = () => {
        console.log('connected: ' + this.getHostname());
        this.connected = true;
    }

    onDisconnect = () => {
        console.log('disconnect: ' + this.getHostname());
        this.connected = false;
    }

    onError = (error: any) => {
        console.log(error);
    }
}
