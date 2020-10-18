
// ================================================================================
// UTILITY
// ================================================================================
StructureTower.prototype.actionCost = function(creep, action)
{
    if (creep.getRole() == 'worker')
    {
        if (action == 'store' && ! this.isFull())
        {
            var counter = this.getProperty('store');
            if (counter == undefined)
                return 100;
            
            // TODO: Either Remove this. Or make it variable if the room is under attack
            // TODO: Once creeps are working other rooms this may not be so relevant as there could be much more creeps
            if (counter >= 2)
                return -1;
            
            return 50 / counter + 50;
        }
        // TODO: Repair (Could be from the generic standpoint)
    }
    
    // TODO: Enemy Targeting
    
    return -1;
}


StructureTower.prototype.isContainer = function()
{
    // MY towers are containers, ENEMY containers however are NOT
    return this.my;
}


StructureTower.prototype.isFull = function()
{
    return this.store[RESOURCE_ENERGY] >= this.store.getCapacity(RESOURCE_ENERGY);
}


StructureTower.prototype.update = function()
{
    if (this.energy == 0)
        return;
        
    // TODO: Look for 'HELP' requests. This will be a list on the room
    // TODO: Process based on lowest HP for walls
    // TODO: Process based on lowest/closest HP for enemies
    
    var closestHostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) 
    {
        this.attack(closestHostile);
    }  
    /*
    var closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
    });
    if(closestDamagedStructure) 
    {
        this.repair(closestDamagedStructure);
    }
    */
      
}

module.exports = {};