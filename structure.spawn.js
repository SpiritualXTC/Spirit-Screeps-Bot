/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */

 require('creep_db')


 StructureSpawn.prototype.actionCost = function(creep, action)
 {
    //if (creep.carry.energy <= 0)
    if (creep.store[RESOURCE_ENERGY] <= 0)
        return -1;
    if (this.isFull())
        return -1;
     
    // Is it Empty?
    if (action == 'store' && ! this.isFull())
    {
        var counter = this.getProperty('store');
        if (counter == undefined)
            return 100;
        
        var f = this.getPercentageFull();
        if (f < 50.0)
            return (75 + f / 2.0) / ((counter/2) + 1);

        return (50 / (counter + 1)) + 50;
    }
     
    return -1;
 }

StructureSpawn.prototype.isContainer = function()
{
    // MY spawner is a container, enemy's spawns are NOT
    return this.my;
}

StructureSpawn.prototype.isFull = function()
{
    return this.store[RESOURCE_ENERGY] >= this.store.getCapacity(RESOURCE_ENERGY);
}

StructureSpawn.prototype.getPercentageFull = function()
{
    return this.store[RESOURCE_ENERGY] / this.store.getCapacity(RESOURCE_ENERGY) * 100;
}

StructureSpawn.prototype.spawn = function(creep_data, action=null)
{
    if (this.spawning)
        return false;

    // Spawn a Creep
    var cost = Game.creepDB.calcCost(creep_data.parts);
    if (this.room.energyAvailable <= cost)
        return false;

    var name = creep_data.role + "_" + Game.time;
    var result = this.spawnCreep(creep_data.parts, name, {memory: {role: creep_data.role, home: this.room.name, initAction: action}});
    
    if (result != OK)
    {
        console.log("Unable to spawn "  +  result + ", " + creep_data.parts + ", " + name);
        return false;
    }
    
    return true;
}

module.exports = 
{

};