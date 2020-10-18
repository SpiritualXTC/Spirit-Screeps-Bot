/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common.world');
 * mod.thing == 'a thing'; // true
 */
var types = require('types');




function World(region)
{
    this.minX = region.minX;
    this.minY = region.minY;
    this.maxX = region.maxX;
    this.maxY = region.maxY;
    
    // Populate
    this.rooms = {};
    
    
    
    // Scan Game.Rooms for knowledge
    for (var roomName in Game.rooms)
    {
        var room = Room(Game.rooms[roomName]);
        
        var sources = this.find(FIND_SOURCES);
        var minerals = this.find(FIND_MINERALS);
        
        var r = {};
        
        r.sourcesLength = sources.length;
        r.mineralsLength = minerals.length;
    
        r.sources = [];
        r.minerals = [];
     
        for (var source in sources)
        {
            var s = {};
            s.energyCapacity = source.energyCapacity;
            r.sources.push(s);
        }
        
        for (var mineral in minerals)
        {
            var m = {};
            m.mineralType = mineral.mineralType;
            r.minerals.push(m);
        }
     
    }
    
    
    // Scan Knowledge base for extra information :: Make sure to NOT scan a room that has been scanned from Game
    for (var y=this.minY; y<=this.maxY; ++y)
    {
        for (var x=this.minX; x<=this.maxX; ++x)
        {
            var roomName = 'W' + x + 'N' + y;
            if (Game.rooms[roomName])
                continue;
            
                // Search in Knowledge Bank
            var kdb = Game.knowledge;
            var room = kdb.getRoom(roomName)
            if (! room)
            {
                // TODO: Dummy room for no knowledge
                
                continue;
            }
            
            // Populate the room information with whatever we can
            
        }
    }
}







// Builds a Map of the World
module.exports.buildWorldMap = function()
{
    // TODO: Define a Region map from the Max/Min of all owned rooms
    // TODO: Expand the Max/Min by N rooms.
    // TODO: Define information about each room
    
    var region = types.Region();
    
    // Define a region of the map from the Max/Min of all owned rooms
    for (var roomName in Game.rooms)
    {
        var room = Game.rooms[roomName];
        var sector = room.getSector();
        region.updateRegion(sector.x, sector.y);
    }
    
    // Expansion
    region.expand(2);
    
    // Create World
    return World(region);
}

 
