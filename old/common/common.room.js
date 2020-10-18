/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common.room');
 * mod.thing == 'a thing'; // true
 */

// TODO: Add functionality for doing certain searches and caching the results (May improve on some cycles / CPU Usage)

/*
    DEPRECATED
*/

var types = require('types');
var actions = require('actions');
var cache = require('room.cache');


var roomMap = require('room.map');

var FIELD_EXIT_MASK = 0x0F;
var FIELD_EXIT_NORTH = 0x01;
var FIELD_EXIT_EAST = 0x02;
var FIELD_EXIT_SOUTH = 0x04;
var FIELD_EXIT_WEST = 0x08;




Room.prototype.actionCost = function(creep, action)
{
    if (action != 'search')
        return -1;
    
}



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

Room.prototype.getSector = function()
{
    var sections = this.name.match(/^W(\d+)N(\d+)$/);
    
    return {x: sections[1], y: sections[2]};
}


// ================================================================================
// HELPERS
// ================================================================================

// Gets list of all the sources in the room that can be harvested
Room.prototype.findAvailableSources = function(ignoreList)
{
    var sources = this.find(FIND_SOURCES, {filter: (s) => {return s.isHarvestable();}});
    
    if (ignoreList)
    {
        // TODO: Implement the Ignore List -- This could be a string or array of strings
        
        // Anything that is in this list should NOT be in the sources list
    } 
    
    return sources;
}

Room.prototype.findAvailableMinerals = function()
{
    var minerals = this.find(FIND_MINERALS);
}


// Gets a list of types of storage containers in this room
Room.prototype.findAvailableContainers = function()
{
    var containers = this.find(FIND_STRUCTURES, {filter: (s) => {return s.isContainer() && ! s.isFull();}});
    
    return containers;
}


// Gets a list of building sites in this room
Room.prototype.findAvailableBuildingSites = function()
{
    var sites = this.find(FIND_CONSTRUCTION_SITES);
    
    return sites;
}

// Gets a list of dropped resources in this room
Room.prototype.findDroppedResources = function()
{
    var resources = this.find(FIND_DROPPED_RESOURCES);
    return resources;
}

Room.prototype.distanceTo = function(destRoom)
{
    // Dest Room COULD be just a name
    // Dest Room COULD also be a room
    var destSector = null;
    
    if (typeof destRoom === 'string')
    {
        var sections = this.name.match(/^W(\d+)N(\d+)$/);
        destSector = {x: sections[1], y: sections[2]};
    }
    else
        destSector = room.getSector();
        
    // Calculate the sector distance
    var srcSector = this.getSector();
    
    var dx = parseInt(srcSector.x) - parseInt(destSector.x);
    var dy = parseInt(srcSector.y) - parseInt(destSector.y);
    
    return Math.abs(dx) + Math.abs(dy);
}

/*
// DEPRECATRED THE 'getAction()' aspect
// TODO: Creeps need a 'homeRoom' value when they spawn. Destines where they go home while adventuring
// This function needs to look at the homeRoom value
Room.prototype.getWorkerCount = function(action)
{
    if (action)
    {
        //var workers = _.filter(Game.creeps, (creep) => creep.room.id == this.id && creep.memory.role == 'worker' && (creep.memory.actions && creep.memory.actions.length > 0 && creep.memory.actions[creep.memory.actions.length-1] == action));
        // TODO: This doesn't look at PRIMARY action. Only CURRENT action
        var workers = _.filter(Game.creeps, (creep) => creep.room.id == this.id && creep.memory.role == 'worker' && creep.getAction() == action);
        return workers ? workers.length : 0;
    }
    
    var workers = _.filter(Game.creeps, (creep) => creep.room.id == this.id && creep.memory.role == 'worker');
    return workers.length;
}
*/




Room.prototype.getOpenTerrainCount = function(x, y, radius)
{
    return -1;
}

Room.prototype.getNonObstructedTerrainCount = function(x, y, radius)
{
    var terrain = this.lookForAtArea(LOOK_TERRAIN, y - radius, x - radius, y + radius, x + radius, true);
    var open = 0;
    for (var i=0; i<terrain.length; ++i)
    {
        var t = terrain[i];
        
        if (t.type == 'terrain' && t.terrain == 'plain')
        {
            var obj = this.lookAt(t.x, t.y)
        
            // TODO: This isn't 100% Correct
            // Requires ability to analyse all objects on the terrain, and decide whether it's obstructed or not.
            // Ramparts for example shouldn't be included.
            // Creeps should be optional -- depending on what is beiong looked at
            // Structures aren't optional
            if (obj.length == 1)    // Accounts for the Terrain Object
                ++open;
        }
    }
    
    return open;
}

Room.prototype.getObstructedTerrainCount = function(x, y, radius)
{
    var r = radius * 2 + 1;
    return (r * r) - this.getNonObstructedTerrainCount(x, y, radius);
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
        
        // Add this room to the Knowledge DB
    }  
    
    // Knowledge! Knowledge of hte room can be done here
    
    // IMPROVE: Cleaner / Faster implementation
    if (! Game.knowledge.getRoom(this.name))
    {
        console.log('No Knowledge of htis room');
        Game.knowledge.addRoom(this);
    }
    
    
}

Room.prototype.updateCache = function()
{
    
}



/*
    Room AI / Management Happens Here
*/
Room.prototype.update = function()
{
    // Reset
    //this.memory = {};
    
    
    // First Time Update - This needs to occur irrespective of whether the room is owned or not
    this.init();
    
    // Room Updates and Initialisation ONLY apply if the room is mine
    if (! this.controller || ! this.controller.my)
        return;
    
    // Process the Auto Construction Map
    if (this.memory.updateTime == undefined)
    {
        this.memory.updateTime = 0;
    }
        
    
    // Process the Terrain Cache
    if (this.memory.cache == undefined)
    {
        this.memory.cache = {};
    }
    


    
    
    
    // Interal Tracking
    this.internal = {};
    this.internal.repair = [];
    this.internal.renew = types.PriorityLowest();
    
    
    if (this.memory.cache)
    {
        this.internal.cache = cache(this, this.memory.cache);
    }
    
    
    
    
    
    
    // Store Workers in this room :: This needs to look for all workers that use this room as their 'home'
    // TODO: Look into a 'onDeath' event
    
    //this.internal.workers2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');
    
    this.internal.workers = _.filter(Game.creeps, (c) => c.memory.role == 'worker' && c.memory.home === this.name);
    
 

    if (this.internal.workers.length <= 40)
    {
        // TODO: Update the workers so they can build bigger ones
        this.requestSpawn('worker');
    }    
    
    // TODO: Can Creep/Structure Death be tracked?
    
    
    
    // This should be done by the faction update
    this.internal.scouts = _.filter(Game.creeps, (creep) => creep.getRole() == 'scout');
    if (this.internal.scouts.length <= 1)
    {
    //    console.log('Scouts = ' + this.internal.scouts.length);
        this.requestSpawn('scout');
    }
    
    
    
    
    // Add information to knowledge base -- although where that is stored is another question :P
 
    // AUTO BUILDING CONSTRUCTION
    

    
    // Spawn Buildings automatically
    // TODO: This Doesn't need to update every tick. Once every 10 seconds would suffice
    

    
    
    
    
    // Update Timer
    --this.memory.updateTimer;
    if (this.memory.updateTimer <= 0)
    {
        //var noBuild = ['road', 'constructedWall', 'rampart'];
        var autoBuild = ['extension', 'spawn', 'tower', 'storage', 'container'];
        var needToBuild = {};
        
        for (var name in CONTROLLER_STRUCTURES)
        {
            if (name == 'road' || name == 'constructedWall' || name == 'rampart')
                continue;
         
            var max = this.controller.getMaxStructureCount(name);
            if (max == 0)
                continue;
            
            var structures = this.find(FIND_STRUCTURES, {filter: (s) => {return s.structureType == name}});
            var sites = this.find(FIND_CONSTRUCTION_SITES, {filter: (s) => {return s.structureType == name}})
            var count = structures.length + sites.length;
            
            if (count == max)
                continue;
                
            needToBuild[name] = this.controller.getMaxStructureCount(name) - count;
        }        
        
        var required = _.sum(needToBuild);
    //    console.log('Required Buildings: ' + required);
        
        
        if (needToBuild['extractor'] > 0)
        {
            // Special Case :: Only one can be built, and it's always on the mineral location
        }
        
        
        var rm = roomMap.RoomMap(this);  
        
        if (needToBuild['extension'] > 0)
        {
            var p = rm.searchLocation(roomMap.SEARCH_EXTENSION);
        
            if (p)
            {
                this.visual.circle(p.x, p.y, {fill:'#0000ff', opacity:0.5, radius:2});
                result = this.createConstructionSite(p, 'extension');
                if (result != OK)
                {
                    console.log('Unable to create construction site: ' + result)
                }
            }
        }
        
        
        // Short Timer for now
        this.memory.updateTimer = 5;
        
        // TODO: Maybe add some crap to the cache for storing visuals over a longer period than a single tick -- very quick update cycle
        // Alternative. See Notes.
    }

    
    // TODO: Road Construction
  //  

}

Room.prototype.requestSpawn = function(role)
{
    // Currently --- a ROOM contains a list of 
    //this.internal.spawn = types.PriorityLowest();
    
    // Find Spawners
    var spawners = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_SPAWN);
    
    if (spawners)
        spawners[0].requestSpawn(role);
}

// Controls a queue of renew requests
Room.prototype.renewRequest = function(creep)
{
    if (this.internal.renewRequests >= 4)
        return false;
        
    ++this.internal.renewRequests;
    
    // Find Spawners
    var spawnerQ = types.PriorityLowest();
    
    var spawners = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_SPAWN);
    
    // Select the spawner best able to conduct the renewal request
    for (var i=0; i<spawners.length; ++i)
    {
        var s = spawners[i];
        
        var cost = s.renewCost(creep);
        if (cost != -1)
            spawnerQ.push(creep.distanceTo(s) * cost, s);
    }
    
    var spawner = spawnerQ.pop();
    if (! spawner)
    {
        console.log("Unable to renew currently");
        return false;
    }
    
    return spawner.renewRequest(creep);
}







module.exports = 
{


};




