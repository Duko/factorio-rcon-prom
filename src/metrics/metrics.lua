local statistics = {
    'item_production_statistics',
    'fluid_production_statistics',
    'kill_count_statistics',
    'entity_build_count_statistics'
}
local stats = {
    game_tick = game.tick,
    players = {},
    pollution_statistics = {
        input = game.pollution_statistics.input_counts,
        output = game.pollution_statistics.output_counts
    },
    forces = {}
}
local players_stats = {}
for _, player in pairs(game.players) do
    players_stats[player.index] = {
        name = player.name,
        tag = player.tag,
        admin = player.admin,
        afk_time = player.afk_time,
        connected = player.connected,
        online_time = player.online_time
    }
end
stats.players = players_stats
for _, force in pairs(game.forces) do
    stats.forces[force.name] = {
        flow_statistics = {},
        logistic_networks = {},
        rockets = {}
    }
    for _, statName in pairs(statistics) do
        stats.forces[force.name].flow_statistics[statName] = {
            input = force[statName].input_counts,
            output = force[statName].output_counts
        }
    end
    stats.forces[force.name].rockets = {
        launch_count = force.rockets_launched,
        launched_items = force.items_launched
    }
    stats.forces[force.name].logistic_networks = {}
    for surface, n in pairs(force.logistic_networks) do
        stats.forces[force.name].logistic_networks[surface] = {}
        for i in ipairs(n) do
            stats.forces[force.name].logistic_networks[surface][i] = {
                all_logistic_robots = n[i].all_logistic_robots,
                available_logistic_robots = n[i].available_logistic_robots,
                all_construction_robots = n[i].all_construction_robots,
                available_construction_robots = n[i].available_construction_robots,
                robot_limit = n[i].robot_limit,
                items = {}
            }
            if n[i].get_contents() ~= nil then
                for item, l in pairs(n[i].get_contents()) do
                    stats.forces[force.name].logistic_networks[surface][i].items[item] = l
                end
            end
        end
    end
end
rcon.print(game.table_to_json(stats))