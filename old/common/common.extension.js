/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common.extension');
 * mod.thing == 'a thing'; // true
 */
 
var tracking = require('api.tracking');
 


// ================================================================================
// UTILITY
// ================================================================================
StructureExtension.prototype.actionCost = function(creep, action)
{
    if (creep.carry.energy <= 0)
        return -1;
    
    // Is it Empty?
    if (action == 'store' && this.energy < this.energyCapacity)
    {
        var counter = tracking.getTrackingData(this.id, 'store');

        return counter == undefined || counter == 0 ? 100 : -1;
    }
    
    return -1;
}


StructureExtension.prototype.isContainer = function()
{
    // MY extension is a container, enemy's spawns are NOT
    return this.my;
}

StructureExtension.prototype.isFull = function()
{
    return this.energy >= this.energyCapacity;
}




module.exports = {

};