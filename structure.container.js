

StructureContainer.prototype.isContainer = function()
{
    return true;
}

StructureContainer.prototype.isFull = function()
{
    //return _.sum(this.store) >= this.getCapacity();
    return this.store[RESOURCE_ENERGY] >= this.store.getCapacity(RESOURCE_ENERGY);
}

module.exports =
{

};