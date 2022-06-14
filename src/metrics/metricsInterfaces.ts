export interface Statistics {
    game_tick: number
    players: Players[]
    pollution_statistics: FlowStatistics
    forces: {
        [forceName:string]: Force
    }
}

export interface FlowStatistics {
    [direction:string]: Items
}

export interface Force {
    flow_statistics: {
        [statisticsName:string]: FlowStatistics
    }
    logistic_networks: {
        [surface:string]: LogisticNetwork[]
    }
    rockets: RocketStatistics
}

export interface LogisticNetwork {
    all_logistic_robots: any
    available_logistic_robots: any
    all_construction_robots: any
    available_construction_robots: any
    robot_limit: any
    items: any
}

export interface LogisticNetworks {
    [surface:string]: LogisticNetwork
}

export interface RocketStatistics {
    launch_count: number
    launched_items: Items
}

export interface Items {
    [name:string]: number
}

export interface Players {
    name: string
    tag: string
    admin: boolean
    afk_time: number
    connected: boolean
    online_time: number
}