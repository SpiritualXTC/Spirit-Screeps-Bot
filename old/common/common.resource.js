/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common.resource');
 * mod.thing == 'a thing'; // true
 */


Resource.prototype.actionCost = function(creep, action)
{
    if (creep.getRole() != 'worker' || action != 'pickup')
        return -1;
    
    return 150;
}

module.exports = {

};