var constants = require('constants')
var Priority = require('priorityqueue')


var RoomMap = require('room_map');
const ActionObserve = require('./action.observe');

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


/* Initialises the Room */
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
        
        // console.log("Init room: " + this.name);
    } 
}


// ================================================================================
// HELPERS
// ================================================================================

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

// Get list of exits
Room.prototype.getExits = function()
{
    return Game.map.describeExits(this.name);
}

/* 
    findAvailableSources():
        - Find all sources in this room
        - Optionally include adjacent rooms
*/
Room.prototype.findAvailableSources = function(includeAdjacent)
{
    var sources = this.find(FIND_SOURCES, {filter: (s) => {return s.isHarvestable();}});
    
    if (includeAdjacent)
    {
        var exits = Game.map.describeExits(this.name)
        for (var name in exits)
        {
            var r = Game.rooms[exits[name]];
            if (r)
            {
                sources = sources.concat(r.findAvailableSources());
            }
        }
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

/* Updates the Room */
Room.prototype.update = function()
{

    // First Time Update - This needs to occur irrespective of whether the room is owned or not
    this.init();


    this.visual.text(this.name, 1, 1, {align:'left'})

    var history = Game.historyDB.getRoom(this.name);
    if (history && history.status)
    {
        this.visual.text(Array.from(history.status).join(' '), 1, 2, {align:'left'});
    }

    // History Update
    Game.historyDB.updateRoom(this)

    // Draw Couhnters
    var counters = Game.countersDB.getId(this.name);
    var idx = 0
    for (var action in counters)
    {
        var value = counters[action];
        this.visual.text(`${action} = ${value}`, 49, idx, {align:'right'});
        ++idx;
    }


    // Knowledge Update
    // Game.knowledge.updateRoom(this.name)
    // Room Updates and Initialisation ONLY apply if the room is mine
    if (! this.controller || ! this.controller.my)
        return;
    
    // Process the Auto Construction Map
    if (this.memory.updateTime == undefined)
    {
        this.memory.updateTime = 0;
    }
            

    const spawners = this.find(FIND_MY_SPAWNS);

    // Look at our exits, do we "own" these rooms?

    // Get Creep Database
    var targetQ = Priority.PriorityHighest();
    var creeps = Game.creepDB.getCreepDB();

    var totals = {}
    var limits = {}  // This really needs to be calculated
    limits[constants.ROLE_WORKER] = 30;    // (Number of sources + Number of minerals) Available tiles around those squares
    limits[constants.ROLE_OBSERVER] = 2;   // Number of exits  
    limits[constants.ROLE_SETTLER] = 1;    // Only ever 1
    limits[constants.ROLE_SCOUT] = 2;     // Number of exits + 2 

    limits[constants.ROLE_TANK] = 4;       // Number of exits * 2
       

    // Get Creep Counters
    for (var idx in constants.ROLES)
    {
        var role = constants.ROLES[idx];

        var c = _.filter(Game.creeps, (c) => c.memory.role == role && c.memory.home === this.name);
        totals[role] = c.length;


    }

    var i = 0;
    for (var idx in creeps)
    {
        var creep = creeps[idx];

        var role = creep.role;
        var tier = creep.tier;
        var cost = Game.creepDB.calcCost(creep.parts);
        
        var h = 1.0;
        var w = 1.0;

        // Don't even bother
        if (totals[role] >= limits[role] || limits[role] <= 0)
            continue;
        // Cost is greater than the capacity : We Do Not Want to Build
        if (cost > this.energyCapacityAvailable)
            continue;

        // Cost is higher than we have available, but waiting might be much more useful than spawning a weaker version now
        if (cost > this.energyAvailable)
            w = w * 0.75;

        
        
        var need =  limits[role] - totals[role];

        // We have less than half the needed amount
        if (need > totals[role])
            need = need * 4;

        //need = need * need;
        h = need;
        var c = h * w * tier
        // console.log('Cost = ' + c + ", Role = " + role + " [" + tier + "]");
        targetQ.push(c, creep);

        var s = `Role = ${role} [${tier}]. ${c}`; 
        this.visual.text(s, 1, 4 + i, {align:'left'});
        ++i;
    }

    var creep = targetQ.top();
    //console.log(creep.role);



    var observers = _.filter(Game.creeps, (c) => c.memory.role == constants.ROLE_OBSERVER && c.memory.home === this.name);
    var workers = _.filter(Game.creeps, (c) => c.memory.role == constants.ROLE_WORKER && c.memory.home === this.name);
    var scouts = _.filter(Game.creeps, (c) => c.memory.role == constants.ROLE_SCOUT && c.memory.home == this.name);
    var tanks = _.filter(Game.creeps, (c) => c.memory.role == constants.ROLE_TANK && c.memory.home == this.name);

    // TODO: Improve observer logic
    // TODO: Remove observer replace with scout.
    // TODO: Scouts will ONLY run the observe action when they target a flag! Nameing the flag is important
    var exits = this.getExits();
    var adjacent = []
    for (var idx in exits)
    {
        var exit = Game.rooms[exits[idx]];
        
        if (exit)
        {
            if (exit.controller.my)
                continue;
        }
        else
        {
            if (Game.historyDB.hasRoomStatus(exits[idx], constants.ROOM_OBSERVE))
               continue;
            var data = Game.actionDB.getAction(constants.ACTION_OBSERVE).init(exits[idx])
            if (! data)
                continue;
            var creep = Game.creepDB.getCreep('observer', this.energyAvailable);
            if (creep)
            {
                // TODO: 
                for (spawner in spawners)
                {
                    //break;
                    if (spawners[spawner].spawn(creep, data))
                        break;
                    else
                        console.log('failed to spawn observer')
                }
                break;
            }            
        }
    }



    // TODO: Need to work out "SCORES" for certain categories [DEFENSE, OFFENSE, WORKERS, ETC]
    // Spawn based on the score, not an arbiturary number :)

    // TODO: Do all this in a Priority Queue. Most important wins!
    // Count all the workers that use this room as a home



    /*
        Defense Needs [Tanks + Attack + Heals]
    
        Whereever there is resources or infrastructure and exits, there should be defense
    */
    
    //map = new RoomMap.RoomMap(this);
    
    //map.draw()

    var action = null;

    if (workers.length < 30)
    {
        console.log('Room: ' + this.name + ", Workers: " + workers.length);
        
        
        var creep = Game.creepDB.getCreep('worker', this.energyAvailable);
        if (creep)
        {
            // TODO: 
            for (spawner in spawners)
            {
                if (spawners[spawner].spawn(creep))
                    break;
                else
                    console.log('failed to spawn worker')
            }
        }
    }
    if (scouts.length < 1)
    {
        console.log('Room: ' + this.name + ", Workers: " + workers.length);

        var creep = Game.creepDB.getCreep('scout', this.energyAvailable);
        if (creep)
        {
            // TODO:
            for (spawner in spawners)
            {
                if (spawners[spawner].spawn(creep))
                    break;
                else
                    console.log('failed to spawn scout')
            }
        }
    }
    if (tanks.length < 4)
    {
        console.log('Room: ' + this.name + ", Tank: " + tanks.length);

        var creep = Game.creepDB.getCreep(constants.ROLE_TANK, this.energyAvailable);
        if (creep)
        {
            // TODO:
            for (spawner in spawners)
            {
                if (spawners[spawner].spawn(creep))
                    break;
                else
                    console.log('failed to spawn tank')
            }
        }
    }

    // var autoBuild = ['extension', 'spawn', 'tower', 'storage', 'container'];
    // var needToBuild = {};
    
    // for (var name in CONTROLLER_STRUCTURES)
    // {
    //     if (name == 'road' || name == 'constructedWall' || name == 'rampart')
    //         continue;
     
    //     var max = this.controller.getMaxStructureCount(name);
    //     if (max == 0)
    //         continue;
        
    //     var structures = this.find(FIND_STRUCTURES, {filter: (s) => {return s.structureType == name}});
    //     var sites = this.find(FIND_CONSTRUCTION_SITES, {filter: (s) => {return s.structureType == name}})
    //     var count = structures.length + sites.length;
        
    //     if (count == max)
    //         continue;
            
    //     needToBuild[name] = this.controller.getMaxStructureCount(name) - count;

    //     // console.log('Need to build ' + needToBuild[name] + ' ' + name)
    // }  
    

}




module.exports = 
{

};