/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common.controller');
 * mod.thing == 'a thing'; // true
 */
 
 var CONTROLLER_MAX_LEVEL = 8;



StructureController.prototype.ticksToDownGradeMax = function()
{
    return CONTROLLER_DOWNGRADE[this.level];
}

StructureController.prototype.getMaxStructureCount = function(structureType)
{
    return CONTROLLER_STRUCTURES[structureType][this.level];
}



StructureController.prototype.actionCost = function(creep, action)
{
    // This Structure cannot be harmed
    
    // TODO: It can however be downgraded
    if (creep.getRole() != 'worker' || action != 'upgrade')
        return -1;

    var controller = creep.room.controller;
    
    // Controller is unclaimed ?? TODO: Confirm
    if (controller.level == 0)
        return -1;
    
    
    var decay = controller.ticksToDowngrade / controller.ticksToDownGradeMax();
        
    // At MAX CONTROLLER LEVEL and theres heaps of time still before a downgrade occurs
    // It can be upgraded, but only if there is quite literally nothing else todo
    if (controller >= CONTROLLER_MAX_LEVEL && decay > 0.50)
        return 0;
    
    var max = 100;
    var min = 0;

    // Slightly Higher Probabilities when decaying than normal
    if (decay <= 0.1)
        return 100;
    else if (decay <= 0.4)
        return 60;
    else if (decay <= 0.9)
        return 40;
    else if (decay <= 0.95)
        return 10;
    
    // Don't Raise this above 1... otherwise it can take priority from other things way to easily
    return 1;
}


module.exports = {

};