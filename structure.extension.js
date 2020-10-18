

// ================================================================================
// UTILITY
// ================================================================================
StructureExtension.prototype.actionCost = function(creep, action)
{
    if (creep.carry.energy <= 0)
        return -1;
    
    // Is it Empty?
    if (action == 'store' && ! this.isFull())
    {
        var counter = this.getProperty('store');
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
    return this.store[RESOURCE_ENERGY] >= this.store.getCapacity(RESOURCE_ENERGY);
}

module.exports = {

};