

// ================================================================================
// UTILITY
// ================================================================================
StructureStorage.prototype.actionCost = function(creep, action)
{
    return -1;
}

StructureStorage.prototype.isContainer = function()
{
    return this.my;
}

StructureStorage.prototype.isFull = function()
{
    return _.sum(this.store) >= this.store.getCapacity();
}




module.exports = {

};