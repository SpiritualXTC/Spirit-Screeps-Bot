/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room');
 * mod.thing == 'a thing'; // true
 */
 

 
 
var FIELD_EXIT_MASK = 0x0F;
var FIELD_EXIT_NORTH = 0x01;
var FIELD_EXIT_EAST = 0x02;
var FIELD_EXIT_SOUTH = 0x04;
var FIELD_EXIT_WEST = 0x08;


// ================================================================================
// PROPERTIES
// ================================================================================
Room.prototype.hasNorthExit = function()
{
    return this.memory.fields & FIELD_EXIT_NORTH;
}

Room.prototype.hasEastExit = function()
{
    return this.memory.fields & FIELD_EXIT_EAST;
}

Room.prototype.hasSouthExit = function()
{
    return this.memory.fields & FIELD_EXIT_SOUTH;
}

Room.prototype.hasWestExit = function()
{
    return this.memory.fields & FIELD_EXIT_WEST;
}
 
 


Room.prototype.init = function()
{
    if (this.memory.fields == undefined)
    {
        var fields = 0;
        
        var northExits = this.find(FIND_EXIT_TOP);
        var southExits = this.find(FIND_EXIT_BOTTOM);
        var eastExits = this.find(FIND_EXIT_RIGHT);
        var westExits = this.find(FIND_EXIT_LEFT);
        
        if (northExits.length != 0)
            fields |= FIELD_EXIT_NORTH;
        if (eastExits.length != 0)
            fields |= FIELD_EXIT_EAST;
        if (southExits.length != 0)
            fields |= FIELD_EXIT_SOUTH;
        if (westExits.length != 0)
            fields |= FIELD_EXIT_WEST;
            
        this.memory.fields = fields;
        
        console.log("Init room: " + this.name);
    }  
}

 
Room.prototype.update = function()
{
    // First Time Update - This needs to occur irrespective of whether the room is owned or not
    this.init();
    
    // Knowledge Update
    Game.knowledge.updateRoom(this.name)
    
    
    
    // All the workers that use this room as a home
    var workers = _.filter(Game.creeps, (c) => c.memory.role == 'worker' && c.memory.home === this.name);
    if (workers.length < 10)
    {
        console.log("Workers: " + workers.length);
        
        // Request a new spawn
        Game.notification.requestSpawn(this.name, "worker");
    }
}



module.exports = 
{

};