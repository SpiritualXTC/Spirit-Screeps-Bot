/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common.storage');
 * mod.thing == 'a thing'; // true
 */
 


// ================================================================================
// UTILITY
// ================================================================================
StructureStorage.prototype.actionCost = function(creep, action)
{
    return -1;
}

StructureStorage.prototype.isContainer = function()
{
    return this.my;;
}

StructureStorage.prototype.isFull = function()
{
    return _.sum(this.store) >= this.storeCapacity;
}




module.exports = {

};