var constants = require('constants');
var utilities = require('utilities');

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

class TargetConstruction
{
    constructor(construction)
    {
        this.construction = construction;
    
    }

    data()
    {
        var data = {}
        data.id = this.construction.id
        data.action = constants.ACTION_BUILD;
        data.roomName = this.construction.roomName;

        return data;
    }

    cost(creep)
    {   
//        console.log('CONSTRUCT: ' + this.construction.structureType + ", " + buildingsLUT + ", " + buildingsLUT[STRUCTURE_CONTAINER]);
        if (! buildingsLUT[this.construction.structureType])
            return -1;


        // Basic Structures can only be built by a single creep at at a time to save on creeps getting overly occupied
        var currentBuilders = Game.countersDB.get(this.construction.id, constants.ACTION_BUILD);
        if (currentBuilders == undefined)
            return buildingsLUT[this.construction.structureType];
        
        if ((this.construction.structureType == STRUCTURE_ROAD || 
            this.construction.structureType == STRUCTURE_WALL || 
            this.construction.structureType == STRUCTURE_RAMPART) &&
            (currentBuilders > 0))
            return -1;
        
        var tilesFree = this.construction.room.getNonObstructedTerrainCount(this.construction.pos.x, this.construction.pos.y, 1);
        

        if (tilesFree - currentBuilders <= 0)
            return -1;

        var w = buildingsLUT[this.construction.structureType] / (currentBuilders + 1);
        console.log('CONSTRUCT: ' + w);

        return w;
    }

    // TEMP: Remove this at a later point
    actionCost(creep, action)
    {
        return this.cost(creep)
    }
}



class ActionBuild
{
    targets(creep)
    {
        var r = creep.room;
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
            return null;

        var t = utilities.wrap(creep.room.findAvailableBuildingSites(), (o) => {return new TargetConstruction(o)});
        return t
        //return creep.room.findAvailableBuildingSites();
    }

    update(creep, data)
    {
        var site = Game.getObjectById(data.id);
        if (! site)
            return false;
        
        var distance = creep.distanceTo(site);
        var result = OK;
        
        if (distance == 1)
        {
            result = creep.build(site);
        }
        else
        {
            result = creep.moveTo(site, {visualizePathStyle: {stroke: '#00ffff'}});
            if (result != OK && result != ERR_TIRED)
                console.log('BUILD: UNable to move to construction site ' + result);
        }
        
        return (result == OK || result == ERR_TIRED) && site.progress < site.progressTotal && creep.carry.energy > 0;
    }

    start(data)
    {
        /*
        // Send Start Events
        var site = Game.getObjectById(data.buildId);
        if (! site)
            return false; 
        site.onStartBuilding(data)
        */
       Game.countersDB.increase(data.id, constants.ACTION_BUILD, data.roomName);
    }

    stop(data)
    {
        /*
        // Send Stop Events   
        var site = Game.getObjectById(data.bd);
        if (! site)
            return false;
        site.onStopBuilding(data);
        */
       Game.countersDB.decrease(data.id, constants.ACTION_BUILD, data.roomName);
    }

    /*
    init(target)
    {
        var data = {}
        data.action = 'build'
        data.buildId = target.id;
        return data;
    }
    */
}

module.exports = ActionBuild