/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common.container');
 * mod.thing == 'a thing'; // true
 */

StructureContainer.prototype.isContainer = function()
{
    return true;
}

StructureContainer.prototype.isFull = function()
{
    return _.sum(this.store) >= this.storeCapacity;
}






module.exports =
{

};