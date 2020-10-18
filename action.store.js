var constants = require('constants');
var utilities = require('utilities');

// TODO: Higher Max Capacity should get a lower multiplier as well; but also a lower affect by the balancing

var multiplier = [
    STRUCTURE_TOWER = 4.0,          // This really needs to be topped up constantly!

    
    STRUCTURE_EXTENSION = 1.5,      // The highest storage container
    STRUCTURE_SPAWN = 0.9,          // Spawn is important, but also regenerates
    STRUCTURE_CONTAINER = 0.8,      
    STRUCTURE_STORAGE = 0.6,
]

class TargetStore
{
    constructor(structure)
    {
        this.structure = structure;

    }

    data()
    {
        var data = {}
        data.action = constants.ACTION_STORE;
        data.id = this.structure.id;
        data.roomName = this.structure.room.name;
        data.status = 0;

        return data;
    }

    cost(creep)
    {
        if (creep.store[RESOURCE_ENERGY] <= 0)
            return -1;

        // TODO: Need to also be able to store MINERALS!        

        // Invalid Store
        if (! this.structure.store)
        {
            return -1;
        }
        
        // Is it Full?
        if (! this.structure.store.getFreeCapacity(RESOURCE_ENERGY))
        {
            return -1;
        }
        
        var counter = Game.countersDB.get(this.structure.id, constants.ACTION_STORE)
        var balance = Game.countersDB.get(this.structure.room.name, constants.ACTION_STORE);
        
        var w = this.structure.store.getFreeCapacity(RESOURCE_ENERGY) / this.structure.store.getCapacity(RESOURCE_ENERGY) * 100;
        if (multiplier[this.structure.structureType])
            w *= multiplier[this.structure.structureType];

        // Double the weight if no creep is planning to store here already
        if (counter == 0)
            w *= 2.0;
        // Double the weight if the capacity is less than half
        if (w < 50.0)
            w *= 2.0

        // Load Balance amongst storage containers
        w = w / (counter + 1);

        // Load Balance all forms of storage for this room
        w = w / ((balance + 1) * 0.5);
        
        return w;
    }

    // TEMP: Remove this at a later point
    actionCost(creep, action)
    {
        return this.cost(creep)
    }
}


class ActionStore
{
    targets(creep)
    {
        // TODO: Support for Minerals needs to be added
        // TODO: This is a cascading issue, as only energy is supported atm, and not all containers can store minerals.
        
        // Creep has no energy to store
        if (creep.store[RESOURCE_ENERGY] == 0)
            return null;

        var targets = creep.room.findAvailableContainers();
        if (creep.room.name != creep.memory.home)
        {
            var homeRoom = Game.rooms[creep.memory.home];
            targets = targets.concat(homeRoom.findAvailableContainers());
        }

        var t = utilities.wrap(targets, (o) => {return new TargetStore(o)});
        return t;
    }

    update(creep, data)
    {
        // Creep isn't carrying anything of value UPDATE FOR MINERALS
        if (creep.carry.energy == 0)
            return false;
            
        var container = Game.getObjectById(data.id);
        if (! container)
            return false;

        // No more room in container for storage
        if (container.isFull())
            return false;
        
        var result = creep.transfer(container, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE)
        {
            result = creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        else if (result == OK)
        {
        //    console.log('STORING: Storing Energy');
        }
        
        return true;    
    }

    start(data)
    {
        Game.countersDB.increase(data.id, constants.ACTION_STORE, data.roomName);
    }

    stop(data)
    {        
        Game.countersDB.decrease(data.id, constants.ACTION_STORE, data.roomName);
    }
}

module.exports = ActionStore;