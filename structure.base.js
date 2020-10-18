
var STRUCTURE_STORAGE_COUNT = 'store'
var STRUCTURE_REPAIR_COUNT = 'repair'


// ================================================================================
// PROPERTY
// ================================================================================
Structure.prototype.hasProperty = function(prop)
{
    if (Memory.structures[this.id] == undefined)
        return false;
    return Memory.structures[this.id][prop] != undefined;
}

Structure.prototype.setProperty = function(prop, value)
{
    if (Memory.structures[this.id] == undefined)
        Memory.structures[this.id] = {}
    Memory.structures[this.id][prop] = value
}

Structure.prototype.getProperty = function(prop)
{
    if (Memory.structures[this.id] == undefined)
        return undefined;
    return Memory.structures[this.id][prop]
}

// ================================================================================
// STATUS
// ================================================================================
Structure.prototype.isContainer = function()
{
    return false;
}

Structure.prototype.isFull = function()
{
    // The base Structure cannot store anything.
    return true;
}




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





Structure.prototype.update = function()
{
    
}

module.exports = {

};