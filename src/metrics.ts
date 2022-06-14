import { Registry, Counter, Gauge} from "prom-client"

export class Metrics {
    private registry: Registry = new Registry();
    public gametimeCounter = new Counter({
        name: 'factorio_game_time_seconds_total',
        help: 'Total time in seconds since starting the map',
        registers: [this.registry]
    });

    public playerOnlineTimeCounter = new Counter({
        name: 'factorio_players_online_time_seconds_total',
        help: 'Total time in seconds since starting the map',
        labelNames: ['name', 'tag', 'admin', 'connected'],
        registers: [this.registry]
    });

    public playerAfkTimeCounter = new Counter({
        name: 'factorio_players_afk_time_seconds_total',
        help: 'Total time in seconds since starting the map',
        labelNames: ['name', 'tag', 'admin', 'connected'],
        registers: [this.registry]
    });

    public rocketsLaunchedCounter = new Counter({
        name: 'factorio_rocket_launch_total',
        help: 'Rockets launched per force',
        labelNames: ['force'],
        registers: [this.registry]
    });
    
    public rocketsLaunchedItemsCounter = new Counter({
        name: 'factorio_rocket_launched_items_total',
        help: 'Rockets launched per force',
        labelNames: ['force', 'item'],
        registers: [this.registry]
    });
    
    public flowStatisticsCounter = new Counter({
        name: 'factorio_flow_statistics_total',
        help: 'some help here',
        labelNames: ['force', 'type', 'direction', 'item'],
        registers: [this.registry]
    });
    
    public logisticNetworkGauge = new Gauge({
        name: 'factorio_logistic_network_count',
        help: 'Rockets launched per force',
        labelNames: ['force', 'surface', 'index', 'name'],
        registers: [this.registry]
    });
    
    public logisticNetworkItemsGauge = new Gauge({
        name: 'factorio_logistic_network_items_count',
        help: 'Rockets launched per force',
        labelNames: ['force', 'surface', 'index', 'item'],
        registers: [this.registry]
    });

    constructor() {
    }

    collect() {
        return this.registry.metrics();
    }
}