/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common.source');
 * mod.thing == 'a thing'; // true
 */

var tracking = require('api.tracking');



// ================================================================================
// UTILITY
// ================================================================================
Source.prototype.actionCost = function(creep, action)
{
    if (creep.getRole() != 'worker' || action != 'harvest')
        return -1;
    
    
    var avail = this.room.getNonObstructedTerrainCount(this.pos.x, this.pos.y, 1);
    var count = tracking.getTrackingData(this.id, 'harvest');
    
    if (count >= avail)
        return -1;
    
    return 100;
}

Source.prototype.isHarvestable = function()
{
    if (this.energy == 0)
        return false;
    
    // Number of spots available at this source location
    var avail = this.room.getNonObstructedTerrainCount(this.pos.x, this.pos.y, 1);
    
    return avail != 0;
}

// ================================================================================
// EVENTS
// ================================================================================
Source.prototype.onStartHarvesting = function(actionData)
{
    tracking.updateTrackingCounter(this.id, 'harvest', 1);
//    console.log('START HARVEST: ' + tracking.getTrackingData(this.id, 'harvest'));
}

Source.prototype.onStopHarvesting = function(actionData)
{
//    console.log('STOP HARVEST: ' + tracking.getTrackingData(this.id, 'harvest'));
    tracking.updateTrackingCounter(this.id, 'harvest', -1);
}





module.exports = 
{

};