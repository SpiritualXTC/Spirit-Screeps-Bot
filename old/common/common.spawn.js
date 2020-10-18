/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common.spawner');
 * mod.thing == 'a thing'; // true
 */
 
 /*
    DEPRECATED
 */
 
 
var tracking = require('api.tracking');
 
 // Register "Unit" Types
 
//var roleWorker = require('role.worker');

//var roleWorker = require('creep.worker');

var roles = require('creeps');



// ================================================================================
// UTILITY
// ================================================================================
StructureSpawn.prototype.actionCost = function(creep, action)
{
    if (creep.carry.energy <= 0)
        return -1;
    
    // Is it Empty?
    if (action == 'store' && this.energy < this.energyCapacity)
    {
        var counter = tracking.getTrackingData(this.id, 'store');
        
        if (counter == undefined)
            return 100;
        
        return 50 / counter + 50;
    }
    
    return -1;
}

StructureSpawn.prototype.isContainer = function()
{
    console.log('HI!')
    // MY spawner is a container, enemy's spawns are NOT
    return this.my;
}

StructureSpawn.prototype.isFull = function()
{
    return this.energy >= this.energyCapacity;
}






StructureSpawn.prototype.requestSpawn = function(role)
{
    if (this.spawning)
        return false;
    
    if (! this.internal)
        this.internal = {};
       
    if (this.internal.spawn)
        return false;
        
    this.internal.spawn = role;
    //console.log('SPAWN: ' + role);
    return true;
}



// Recieveing a renew request from a creep
StructureSpawn.prototype.renewCost = function(creep)
{
    return 1;
}

StructureSpawn.prototype.renewRequest = function(creep)
{
    // Only allow [4]? creeps to be renewed at once?
    return false;
}



// ================================================================================
// PROCESS
// ================================================================================
StructureSpawn.prototype.update = function()
{
    if (! this.spawning && this.internal)
    {
    
        // Renew :: Renewing happens before an object is attempted to spawn
        // And when creeps are waiting for a respawn, then spawning should probably be delayed
        
        
        // Spawn
        if (this.internal.spawn)
        {
            var room = this.room;
            
            var urgency = 0.0;
            var maxEnergy = this.room.energyCapacityAvailable;
            
            
            
            var roleName = this.internal.spawn;
            var role = roles[roleName];
            
            var name = roleName + "_" + Game.time;
            
            var parts = role.getPartsList(room, 0.0);;
             
            
            
            
            
        
            if (parts)
            {
            //    console.log(parts.length + ", " + parts);
                var result = this.spawnCreep(parts, name, {memory: {role:roleName}});
                
                if (result != OK)
                {
                    console.log("Unable to spawn "  +  result + ", " + parts + ", " + name);
                }
            }
        }
    }
}


// ================================================================================
// EVENTS
// ================================================================================
 

module.exports = 
{

};