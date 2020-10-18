var constants = require('constants');

var SOURCE_HARVEST_COUNT = 'harvestCount'


// ================================================================================
// PROPERTY
// ================================================================================
Source.prototype.hasProperty = function(prop)
{
    if (Memory.sources[this.id] == undefined)
        return false;
    return Memory.sources[this.id][prop] != undefined;
}

Source.prototype.setProperty = function(prop, value)
{
    if (Memory.sources[this.id] == undefined)
        Memory.sources[this.id] = {}
    Memory.sources[this.id][prop] = value
}

Source.prototype.getProperty = function(prop)
{
    if (Memory.sources[this.id] == undefined)
        return undefined;
    return Memory.sources[this.id][prop]
}



// ================================================================================
// UTILITY
// ================================================================================
Source.prototype.actionCost = function(creep, action)
{
    if (action != 'harvest')
        return -1;
    
    var r = Game.historyDB.getRoom(this.targetRoomName);
    if (r && r.lastOwner && r.lastOwner != Game.username)
    {
        console.log('Planning to search a potentially hostile zone: ' + r.lastOwner);
        return -1;
    }

    var avail = this.room.getNonObstructedTerrainCount(this.pos.x, this.pos.y, 1);
    
    var count = this.getProperty(SOURCE_HARVEST_COUNT)
     if (count >= avail)
         return -1;
    
    return 100;
}

/*
    isHarvestable() -> bool:
        - Whether the source is harvestable or not.
        
        - Has the source enough energy to harvest?
        - Is there any available space to harvest? Currently only looks at terrain
*/
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
    var count = 0;
    if (this.hasProperty(SOURCE_HARVEST_COUNT))
        count = this.getProperty(SOURCE_HARVEST_COUNT);
    this.setProperty(SOURCE_HARVEST_COUNT, count + 1);
}

Source.prototype.onStopHarvesting = function(actionData)
{
    if (this.hasProperty(SOURCE_HARVEST_COUNT))
    {
        var count = this.getProperty(SOURCE_HARVEST_COUNT);
        if (count > 0)
            this.setProperty(SOURCE_HARVEST_COUNT, count - 1)
    }
}


Source.prototype.update = function(actionData)
{
    var count = Game.countersDB.get(this.id, constants.ACTION_HARVEST);
    this.room.visual.text(count, this.pos.x + 1, this.pos.y)
}


module.exports = 
{

};