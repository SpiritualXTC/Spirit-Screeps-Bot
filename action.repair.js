var constants = require('constants');
var utilities = require('utilities');

var multiplier = {
    STRUCTURE_ROAD: 0.4,
}

var REPAIR_RANGE_MINIMUM = 3;

class TargetStructure
{
    constructor(structure)
    {
        this.structure = structure;
        this.room = structure.room;

    }

    data()
    {
        var data = {}
        data.action = constants.ACTION_REPAIR;
        data.id = this.structure.id;
        data.status = 0;

        return data;
    }

    cost(creep)
    {
        if (this.structure.hits < this.structure.hitsMax)
        {
            var w = this.structure.hits / this.structure.hitsMax;
            
            // Really damaged, drop to zero = Higher priority
            if (w <= 0.2)
                w = 0.0;
            
            if (multiplier[this.structure.structureType])
                w *= multiplier[this.structure.structureType]
            
            return (1.0 - w) * 100;
        }

        return -1;
    }

    // TEMP: Remove this at a later point
    actionCost(creep, action)
    {
        return this.cost(creep)
    }
}


class ActionRepair
{
    start(data)
    {
        // Send Start Events
        var structure = Game.getObjectById(data.repairId);
        if (! structure)
            return false; 
        structure.onStartRepairing(data)
    }

    stop(data)
    {
        // Send Stop Events   
        var structure = Game.getObjectById(data.repairId);
        if (! structure)
            return false;
        structure.onStopRepairing(data);
    }

    update(creep, data)
    {
        var structure = Game.getObjectById(data.id);
        if (! structure || structure.hits >= structure.hitsMax)
            return false;

        var distance = creep.distanceTo(structure);
        var result = OK;
        if (distance <= REPAIR_RANGE_MINIMUM)
        {
            result = creep.repair(structure);
        }
        else
        {
            result = creep.moveTo(structure, {visualizePathStyle: {stroke: '#00ff00'}});
        }
        
        return creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 &&  structure.hits < structure.hitsMax;
    }

    targets(creep)
    {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
            return null;

        var structures = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax});
    
        var t = utilities.wrap(structures, (o) => {return new TargetStructure(o)});
        return t;
    }
}

module.exports = ActionRepair;