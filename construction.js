
var SITE_BUILDING_COUNT = 'build'
var buildingsLUT = {}
 
buildingsLUT[STRUCTURE_SPAWN] = 80;
buildingsLUT[STRUCTURE_EXTENSION] = 60;

// Storage / Resources
buildingsLUT[STRUCTURE_CONTAINER] = 30;
buildingsLUT[STRUCTURE_STORAGE] = 50;
buildingsLUT[STRUCTURE_EXTRACTOR] = 60;
buildingsLUT[STRUCTURE_LAB] = 60;
buildingsLUT[STRUCTURE_TERMINAL] = 60;
buildingsLUT[STRUCTURE_LINK] = 50;

// Offense / Defense
buildingsLUT[STRUCTURE_TOWER] = 80;
buildingsLUT[STRUCTURE_NUKER] = 30;
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
// PROPERTY
// ================================================================================
ConstructionSite.prototype.hasProperty = function(prop)
{
    if (Memory.sites[this.id] == undefined)
        return false;
    return Memory.sites[this.id][prop] != undefined;
}

ConstructionSite.prototype.setProperty = function(prop, value)
{
    if (Memory.sites[this.id] == undefined)
        Memory.sites[this.id] = {}
    Memory.sites[this.id][prop] = value
}

ConstructionSite.prototype.getProperty = function(prop)
{
    if (Memory.sites[this.id] == undefined)
        return undefined;
    return Memory.sites[this.id][prop]
}


// ================================================================================
// UTILITY
// ================================================================================
/*
ConstructionSite.prototype.actionCost = function(creep, action)
{
    if (creep.getRole() != 'worker' || action != 'build')
        return -1;
    
    if (! buildingsLUT[this.structureType])
        return -1;

    // Basic Structures can only be built by a single creep at at a time to save on creeps getting overly occupoied
    var currentBuilders = this.getProperty(SITE_BUILDING_COUNT)
    if (currentBuilders == undefined)
        return buildingsLUT[this.structureType];
    
    if ((this.structureType == STRUCTURE_ROAD || 
        this.structureType == STRUCTURE_WALL || 
        this.structureType == STRUCTURE_RAMPART) &&
        (currentBuilders > 0))
        return -1;
    
    var tilesFree = this.room.getNonObstructedTerrainCount(this.pos.x, this.pos.y, 1);
    
    if (tilesFree - currentBuilders <= 0)
        return -1;
    return buildingsLUT[this.structureType] / (currentBuilders + 1);
}
*/



// ================================================================================
// EVENTS
// ================================================================================
ConstructionSite.prototype.onStartBuilding = function(actionData)
{
    var count = 0;
    if (this.hasProperty(SITE_BUILDING_COUNT))
        count = this.getProperty(SITE_BUILDING_COUNT);
    this.setProperty(SITE_BUILDING_COUNT, count + 1);
}

ConstructionSite.prototype.onStopBuilding = function(actionData)
{
    if (this.hasProperty(SITE_BUILDING_COUNT))
    {
        var count = this.getProperty(SITE_BUILDING_COUNT);
        if (count > 0)
            this.setProperty(SITE_BUILDING_COUNT, count - 1)
    }
}