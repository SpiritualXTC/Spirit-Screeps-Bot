
var constants = require('constants')

var workerT1 = {name: "drone MK 1", role: constants.ROLE_WORKER,  tier: 1, parts: [WORK, MOVE, CARRY]};
var workerT2 = {name: "drone MK 2", role: constants.ROLE_WORKER,  tier: 2, parts: [WORK, MOVE, CARRY, MOVE, CARRY, WORK]};

var scoutT1 = {name: "seek", role: constants.ROLE_SCOUT,  tier: 1, parts: [MOVE, MOVE, RANGED_ATTACK]};

var defT1 = {name: 'defender', role: constants.ROLE_TANK, tier: 1, parts: [MOVE, TOUGH, TOUGH, RANGED_ATTACK]}

var observer = {name: 'observer', role: constants.ROLE_OBSERVER, tier: 1, parts: [MOVE, TOUGH, TOUGH]}
var settler = {name: 'settler', role: constants.ROLE_SETTLER, tier: 1, parts: [MOVE, MOVE, CLAIM]}

var creeps = {}
creeps['worker'] = [workerT1, workerT2]
creeps['scout'] = [scoutT1]

creeps[constants.ROLE_OBSERVER] = [observer]

creeps[constants.ROLE_TANK] = [defT1]



var creepsDB = [
    workerT1,
    workerT2,

    scoutT1,
    defT1,

    observer,
    settler,
];





function CreepDB()
{
    // Construct a list of ALL possible creeps that can be spawned
}

CreepDB.prototype.getCreepDB = function()
{
    return creepsDB;
}

CreepDB.prototype.getCreep = function(role, max_energy_cost)
{
    var creep_role = creeps[role];
    var idx = creeps[role].length - 1;
    while (idx >= 0)
    {
        var creep_spawn = creep_role[idx];
        var cost = this.calcCost(creep_spawn.parts);
        if (cost <= max_energy_cost)
        {
            return creep_spawn;
        }
        --idx;
    }
    return null;
}

CreepDB.prototype.calcCost = function(partsList)
{
    var c = 0;
    
    for (var i=0; i<partsList.length; ++i)
    {
        if (BODYPART_COST)
            c += BODYPART_COST[partsList[i]];
    }

    return c;
}

module.exports = CreepDB