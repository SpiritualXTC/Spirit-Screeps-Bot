var constants = require('constants');

class TargetController
{
    constructor(controller)
    {
        this.controller = controller;
        this.room = controller.room;
    }

    data()
    {
        var data = {}
        data.action = constants.ACTION_UPGRADE;
        data.id = this.controller.id;
        data.status = 0;
        data.roomName = this.controller.room.name;
        return data;
    }

    cost(creep)
    {
        var controller = this.controller;
        
        // Controller is unclaimed ?? TODO: Confirm
        if (controller.level == 0)
            return -1;
        
        var decay = controller.ticksToDowngrade / controller.ticksToDownGradeMax();
        // At MAX CONTROLLER LEVEL and theres heaps of time still before a downgrade occurs
        // Upgrading raises the GCL but not much else
        if (controller >= constants.CONTROLLER_MAX_LEVEL && decay > 0.50)
            return 50;

        // Slightly higher probabilities when decaying than normal
        var weight = 1;
        if (decay <= 0.1)
            weight = 150;
        else if (decay <= 0.8)
            weight = 100;
        else if (decay <= 0.9)
            weight =  95;
        else
            weight =  90;
        
        // Double if it's being ignored
        var counter = Game.countersDB.get(controller.id, constants.ACTION_UPGRADE);
        if (counter == 0)
            weight *= 2;
        else
            weight = weight / (counter * 0.5);

        return weight;
    }

    // TEMP: Remove this at a later point
    actionCost(creep, action)
    {
        return this.cost(creep)
    }
}


class ActionUpgrade
{
    targets(creep)
    {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
            return null;
    
        var targets = []
    
        if (creep.room.controller && creep.room.controller.my)
            targets.push(new TargetController(creep.room.controller))
        
        if (creep.memory.home != creep.room.name)
        {
            var room = Game.rooms[creep.memory.home];
            if (room && room.controller && room.controller.my)
                targets.push(new TargetController(room.controller))
        }
        return targets;
    }

    start(data)
    {
        Game.countersDB.increase(data.id, constants.ACTION_UPGRADE, data.roomName);
    }

    stop(data)
    {
        Game.countersDB.decrease(data.id, constants.ACTION_UPGRADE, data.roomName);
    }

    update(creep, data)
    {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(creep.room.controller,  {visualizePathStyle: {stroke: '#aaaaff'}});
        }
        else
        {
            
        }
      
        return creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
    }

}

module.exports = ActionUpgrade;