/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common.construction');
 * mod.thing == 'a thing'; // true
 */

var tracking = require('api.tracking');

 
 
var buildingsLUT = {}
 
buildingsLUT[STRUCTURE_SPAWN] = 100;
buildingsLUT[STRUCTURE_EXTENSION] = 80;

// Storage / Resources
buildingsLUT[STRUCTURE_CONTAINER] = 40;
buildingsLUT[STRUCTURE_STORAGE] = 60;
buildingsLUT[STRUCTURE_EXTRACTOR] = 60;
buildingsLUT[STRUCTURE_LAB] = 60;
buildingsLUT[STRUCTURE_TERMINAL] = 60;
buildingsLUT[STRUCTURE_LINK] = 50;

// Offense / Defense
buildingsLUT[STRUCTURE_TOWER] = 80;
buildingsLUT[STRUCTURE_NUKER] = 50;
buildingsLUT[STRUCTURE_OBSERVER] = 40;

buildingsLUT[STRUCTURE_POWER_SPAWN] = 20;

// Misc
buildingsLUT[STRUCTURE_ROAD] = 5;
buildingsLUT[STRUCTURE_WALL] = 5;
buildingsLUT[STRUCTURE_RAMPART] = 5;

// NPC | Unable to build
buildingsLUT[STRUCTURE_PORTAL] = -1;
buildingsLUT[STRUCTURE_KEEPER_LAIR] = -1;
buildingsLUT[STRUCTURE_POWER_BANK] = -1;
buildingsLUT[STRUCTURE_CONTROLLER] = -1;
 
 
 
// ================================================================================
// UTILITY
// ================================================================================
ConstructionSite.prototype.actionCost = function(creep, action)
{
    if (creep.getRole() != 'worker' || action != 'build')
        return -1;
    
    // Basic Structures can only be built by a single creep at at a time to save on creeps gettinhg overly occupoied
    
    var currentBuilders = tracking.getTrackingData(this.id, 'build');
    
    if ((this.structureType == STRUCTURE_ROAD || 
        this.structureType == STRUCTURE_WALL || 
        this.structureType == STRUCTURE_RAMPART) &&
        (currentBuilders > 0))
        return -1;
    
       
    var tilesFree = this.room.getNonObstructedTerrainCount(this.pos.x, this.pos.y, 1);
    
    if (tilesFree - currentBuilders <= 0)
        return -1;
    

    return buildingsLUT[this.structureType] ? buildingsLUT[this.structureType] : -1;
}



ConstructionSite.prototype.getMemory = function(create)
{
    if (create && this.room.memory[this.id] == undefined)
        this.room.memory[this.id] = Object();
    
    return this.room.memory[this.id];
}


// ================================================================================
// EVENTS
// ================================================================================
ConstructionSite.prototype.onStartBuilding = function(actionData)
{
    tracking.updateTrackingCounter(this.id, 'build', 1);
    console.log('START BUILDING: ' + tracking.getTrackingData(this.id, 'build'));
}

ConstructionSite.prototype.onStopBuilding = function(actionData)
{
    console.log('STOP BUILDINGG: ' + tracking.getTrackingData(this.id, 'build'));
    tracking.updateTrackingCounter(this.id, 'build', -1);
}



module.exports = 
{

};