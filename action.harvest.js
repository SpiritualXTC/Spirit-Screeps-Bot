
var constants = require('constants');
var utilities = require('utilities');

class TargetSource
{
    constructor (source)
    {
        if (! source)
        {
            console.log('ERR: Invalid Harvest Source [action.harvest.js]')
            return;
        }
        this.source = source;
        this.room = source.room;
    }

    data()
    {
        var data = {}
        data.action = constants.ACTION_HARVEST;
        data.sourceId = this.source.id;
        data.status = 0;
        data.roomName = this.source.room.name;

        return data;
    }

    cost(creep)
    {
        // If this room doesn't belong to me, determine it's history, might be hostile
        if (! this.room.controller.my)
        {
            var history = Game.historyDB.getRoom(this.targetRoomName);
            if (history && history.lastOwner && history.lastOwner != Game.username)
            {
                console.log('HARVEST: Planning to search a potentially hostile zone: ' + r.lastOwner);
                return -1;
            }
        }

        // How much space is their to harvest?
        var avail = this.room.getNonObstructedTerrainCount(this.source.pos.x, this.source.pos.y, 1);
        
        // How many are currently harvesting?
        var count = Game.countersDB.get(this.source.id, constants.ACTION_HARVEST);
        if (count >= avail)
            return -1;

        return 100;
    }

    actionCost(creep, action)
    {
        var c = this.cost(creep); 
        return c;
    }    
}


class TargetPickup
{
    constructor(pickup)
    {

    }
}


class ActionHarvest 
{
    start(data)
    {
        // Send Start Events
        Game.countersDB.increase(data.sourceId, constants.ACTION_HARVEST, data.roomName);
    }
    
    stop(data)
    {
        // Send Stop Events   
        Game.countersDB.decrease(data.sourceId, constants.ACTION_HARVEST, data.roomName);
    }

    update(creep, data)
    {            
        // Creep is full of energy
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0)
        {
            return false;
        }

        // Needs to remain compatible with old code for now <,<
        var source = Game.getObjectById(data.sourceId);
        if (! source)
        {
            return false;
        }

        var distance = creep.distanceTo(source);
        var result = OK;
         if (distance == 1)
        {
            result = creep.harvest(source);
        }
        else if (! source.isHarvestable())
        {
            if (source.energyAvailable == 0)
                return false;
            
            console.log('Unable to harvest: [' + creep.name + ']');
            return false;
        }
        else
        {
            result = creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }

        return result == OK && creep.store.getFreeCapacity() > 0;
    }

    targets(creep)
    {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            return null;

        var t = utilities.wrap(creep.room.findAvailableSources(true), (o) => {return new TargetSource(o)});
        return t;
    }
}

module.exports = ActionHarvest;