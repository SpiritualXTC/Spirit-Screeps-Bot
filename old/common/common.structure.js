/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common.structure');
 * mod.thing == 'a thing'; // true
 */

var tracking = require('api.tracking');



// ================================================================================
// UTILITY
// ================================================================================
Structure.prototype.actionCost = function(creep, action)
{
    // TODO: General costs
    
    // TRY to get all Structures to return a value b/w: 0 and 100 or -1 (for bad action)
    if (action == 'repair' && this.hit < this.hitsMax)
    {
        return Math.floor(this.hit / this.hitsMax) * 100;
    }
    
    
    return -1;
}

Structure.prototype.isContainer = function()
{
    return false;
}

Structure.prototype.isFull = function()
{
    // The base Structure cannot store anything.
    return true;
}



// ================================================================================
// PROCESS
// ================================================================================


// TODO: Most Structures will probably not require an update -- so this could be a waste of cycles
// However: It may still use less cycles to call an empty function, than it is to search for all the structures that would require an update and then update
Structure.prototype.update = function()
{
    // Do Nothing
    

    
}









// ================================================================================
// EVENTS
// ================================================================================

Structure.prototype.onStartStoring = function(actionData)
{
    tracking.updateTrackingCounter(this.id, 'store', 1);
    //console.log('START STORING: ' + tracking.getTrackingData(this.id, 'store'));
}

Structure.prototype.onStopStoring = function(actionData)
{
    tracking.updateTrackingCounter(this.id, 'store', -1);
    //console.log('START STORING: ' + tracking.getTrackingData(this.id, 'store'));
}

Structure.prototype.onStartRepairing = function(actionData)
{
    tracking.updateTrackingCounter(this.id, 'repair', 1);
}

Structure.prototype.onStopRepairing = function(actionData)
{
    tracking.updateTrackingCounter(this.id, 'repair', -1);
}




// ================================================================================
// STATIC
// ================================================================================

function getOptimalSpawnLocation()
{
    // Assume NOTHING can spawn in the boundary area -- this will allow for optimzation, but also doesn't make sense to spawn something on the border of a room
    
    // Therefore valid Room AutoSpawn size is 32x32
    // Recursive validate each division for it's usefulness for a building (Offset is 4 squares left/top)
    
}

function getAutoSpawnCount()
{
    return 0;
}


module.exports = {

};