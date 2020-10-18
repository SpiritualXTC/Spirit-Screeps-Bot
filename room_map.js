
var Priority = require('priorityqueue')
var QuadTree = require('type.quadtree')

var IMPASSABLE_TERRAIN      = -100;     // Terrain here
var IMPASSABLE_STRUCTURE    = -20;      // Structure located here
var IMPASSABLE_CLEARWAY     = -10;      // Region surrounding buildings
var PASSABLE_BOUNDARY       = -5;       // Nothing should be built in a boundary region


var NEUTRAL                 = 0;        // Neutral region [Typically uncalculated]


var PASSABLE_PATHWAY        = 0x01;     // Key buildings involved with resources - Likely this region is used for worker pathing between resources
var PASSABLE_SAFEZONE       = 0x02;     // SafeZone from map edges




var ROOM_SIZE = 50;             // Size of a room
var BORDER_WIDTH = 2;           // Width of the unbuildable region



var FLAG_IMPASSABLE = 0x01;     // Structures / Terrain / Walls / etc


var EXIT_TOP = 0x01;
var EXIT_LEFT = 0x2;
var EXIT_BOTTOM = 0x04;
var EXIT_RIGHT = 0x08;



var SEARCH_TERRAIN_POS = 0x01;      // Near Terrain is good
var SEARCH_TERRAIN_NEG = 0x02;      // Near Terrain is bad

var SEARCH_BOUNDARY_POS = 0x10;     // Near Boundaries is good
var SEARCH_BOUNDARY_NEG = 0x20;     // Near Boundaries is bad

var SEARCH_RESOURCE_POS = 0x100;    // Near Resources is good
var SEARCH_RESOURCE_NEG = 0x200;    // Near Resources is bad


// Prebuilt Compbination of flags
var SEARCH_EXTENSION = SEARCH_TERRAIN_POS | SEARCH_BOUNDARY_NEG;
var SEARCH_SPAWN = 0;
var SEARCH_TOWER = SEARCH_BOUNDARY_POS | SEARCH_RESOURCE_NEG | SEARCH_TERRAIN_NEG;


var impassableRadius = 
{
    source: 3,
    mineral: 3,
    spawn: 2,
    extension: 2,
    tower: 5,
    road: 0,
    constructedWall: 0
};


class RoomMap
{
    constructor(r)
    {
        this.room = r

        this.offX = 0;
        this.offY = 0;
        this.sizeX = ROOM_SIZE;
        this.sizeY = ROOM_SIZE;
        this.tiles = [];
        this.tiles.length = this.sizeX * this.sizeY;

        var sources = this.room.find(FIND_SOURCES);
        var minerals = this.room.find(FIND_MINERALS);
        var storage = this.room.find(FIND_STRUCTURES, {filter: (s) => {return s.isContainer();}})

        var exits = this.room.find(FIND_EXIT);
    }

    getBucket()
    {

    }

    search(flags)
    {
        var queue = Priority.PriorityHighest();    

        var terrain = Game.map.getRoomTerrain(this.room.name);

        // 0 + 1, 
        // var qt = new QuadTree(1, 1, 48, 48);

        for (var y=0; y<this.sizeY; ++y)
        {
            for (var x=0; x<this.sizeX; ++x)
            {
                var value = terrain.get(x, y);
                if (value == TERRAIN_MASK_WALL || value == TERRAIN_MASK_SWAMP)
                    continue;
                
                var unbuildable_flags = LOOK_STRUCTURES | LOOK_CREEPS | LOOK_CONSTRUCTION_SITES;
                //var data = this.room.lookForAtArea(LOOK_CREEPS, x, y, x, y, true);
                var data = this.room.lookForAt(LOOK_CREEPS, x, y, true);
                if (data && data.length)
                {
                    this.room.visual.circle(x, y, {fill:'#ffff00', opacity:0.1, radius:1.5})
                    // qt.add(x, y);
                }
            }
        } 
    }

    draw()
    {
        this.room.visual.text(this.room.name, 1, 1)
        
        var terrain = Game.map.getRoomTerrain(this.room.name);
        for (var y=this.offY; y<this.sizeY; y++)
        {
            for (var x=this.offX; x<this.sizeX; x++)
            {
                var value = terrain.get(x, y);
                if (value == TERRAIN_MASK_WALL)
                    this.room.visual.circle(x, y, {fill:'#ff0000', opacity:0.5, radius:0.4})
                else if (value == TERRAIN_MASK_SWAMP)
                    this.room.visual.circle(x, y, {fill:'#88aa00', opacity:0.25, radius:0.4})
                else if (x == 0 || x == 49 || y == 0 || y == 49)
                    this.room.visual.circle(x, y, {fill:'#aa00aa', opacity:0.25, radius:0.4})
            }
        }

        this.room.visual.rect(0, 0, 1, 1, {fill:'#000000', opacity:1.0})
    }
}

module.exports.RoomMap = RoomMap