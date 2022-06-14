import { createServer } from "http"
import { FactorioRcon } from "./rcon"
import { Metrics } from "./metrics"

const server = createServer();
const factorio = new FactorioRcon();
const metrics = new Metrics();

process.on('SIGTERM', () => {
    process.exit(0);
});

server.on('close', () => {
    console.log('http server closed');
})

server.on('request', async (request, response) => {
    try {
        let json = await factorio.getMetrics();
        
        metrics.rocketsLaunchedCounter.reset();
        metrics.rocketsLaunchedItemsCounter.reset();
        metrics.flowStatisticsCounter.reset()
        for (let forceName in json.forces) {
            let force = json.forces[forceName];

            // Rockets
            metrics.rocketsLaunchedCounter.inc({
                "force": forceName
            }, force.rockets.launch_count)
            for (let item in force.rockets.launched_items) {
                metrics.rocketsLaunchedItemsCounter.inc({
                    "force": forceName,
                    "item":item
                }, force.rockets.launched_items[item])
            }

            // Flow Statistics
            for (let type in force.flow_statistics) {
                for (let direction in force.flow_statistics[type]) {
                    for (let item in force.flow_statistics[type][direction]) {
                        metrics.flowStatisticsCounter.inc({
                            "force": forceName,
                            "type": type,
                            "direction": direction,
                            "item": item
                        }, force.flow_statistics[type][direction][item])
                    }
                }
            }

            // Logistics Networks
            for (let surface in force.logistic_networks) {
                for (let index in force.logistic_networks[surface]) {
                    let network = force.logistic_networks[surface][index];
                    let sharedLabels = {
                        "force": forceName,
                        "surface": surface,
                        "index": index,
                    }
                    metrics.logisticNetworkGauge.set({
                        ...sharedLabels,
                        "name": "all_logistic_robots"
                        
                    }, network.all_logistic_robots)
                    metrics.logisticNetworkGauge.set({
                        ...sharedLabels,
                        "name": "available_logistic_robots"
                    }, network.available_logistic_robots)
                    metrics.logisticNetworkGauge.set({
                        ...sharedLabels,
                        "name": "all_construction_robots"
                    }, network.all_construction_robots)
                    metrics.logisticNetworkGauge.set({
                        ...sharedLabels,
                        "name": "available_construction_robots"
                    }, network.available_construction_robots)
                    metrics.logisticNetworkGauge.set({
                        ...sharedLabels,
                        "name": "robot_limit"
                    }, network.robot_limit)
                    for (let item in network.items) {
                        metrics.logisticNetworkItemsGauge.set({
                            ...sharedLabels,
                            "item": item
                        }, network.items[item])
                    }
                }
            }
        }

        metrics.gametimeCounter.reset();
        metrics.gametimeCounter.inc(json.game_tick/60);

        let players = json.players;
        metrics.playerOnlineTimeCounter.reset()
        metrics.playerAfkTimeCounter.reset()
        for (let index in players) {
            let labels = {
                "name": players[index].name, 
                "tag": players[index].tag, 
                "connected": String(players[index].connected), 
                "admin": String(players[index].admin)
            }
            metrics.playerOnlineTimeCounter.inc(labels, players[index].online_time/60)
            metrics.playerAfkTimeCounter.inc(labels, players[index].afk_time/60)
        }

        response.writeHead(200, {'Content-Type': 'text/plain'});
        return response.end(await metrics.collect());
    } catch (error) {
        console.log(error)
    }
    response.writeHead(404, {'Content-Type': 'text/plain'});
    return response.end('Not Found');
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000')
})
