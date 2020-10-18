/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.map');
 * mod.thing == 'a thing'; // true
 */
 
var types = require('types');
var blur = require('algorithm.blur');

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

// PROCESS FLAGS


// Prebuilt Compbination of flags
var SEARCH_EXTENSION = SEARCH_TERRAIN_POS | SEARCH_BOUNDARY_NEG;
var SEARCH_SPAWN = 0;
var SEARCH_TOWER = SEARCH_BOUNDARY_POS | SEARCH_RESOURCE_NEG | SEARCH_TERRAIN_NEG;


// Var SEARCH_ROAD = 0; // This shouldn't happen via this class. Road Searching should be done elsewhere


/*
    50x50 = 2500 = 2.5 KB! -- what can these be cached down too?
    
    If flags can be optimized to at most 4 flags .... then it can be precached, however some flags would be dynamic
    
    One terrain cache optimzation could be (Stored in a string)
    Each character represents the NUMBER of blocks until the next change TERRAIN<->OPEN -- will also require storing the opening block
    This could allow an entire row being stored as 2 characters if their is no change.

    Alternatively. Assume START with open-area, if the first index happens to be terrain .. well then store 0 to start :)
    Also don't segment by row, allows for multiple rows to be summed up by a single character. Super Long Blocks will need to a 0 change added
*/

// TEMP: DEBUG
var hex = [];
hex.length = 256;
for (var i=0; i<hex.length; ++i)
{
    var s = Number(i).toString(16);    
    if (s.length == 1)
        s = '0' + s;
        
    hex[i] = s;
}




function Tile()
{
    this.flag = 0;
    this.terrain = 0;
    this.boundary = 0;
    this.resource = 0;
    
    return this;
}




// ================================================================================
// GETTERS / SETTERS
// ================================================================================
function getTerrainCost(tile)
{
    return tile.terrain;
}

function setTerrainCost(tile, value)
{
    tile.terrain = value;
}


/*
// Radius is treated as a square for now. Later it will be treated as maximum difference (x+y > radius+1) ... or something
function setBounds(grid, pos, radius)
{
    if (radius == undefined)
        radius = 1;
    

    for (var y = pos.y - radius; y <= pos.y + radius; ++y)
    {
        for (var x = pos.x - radius; x <= pos.x + radius; ++x)
        {
            
            if (x < 0 || y < 0 || x >= ROOM_SIZE || y >= ROOM_SIZE)
                continue;
                
            var index = (y * ROOM_SIZE) + x;
            if (grid[index] >= NEUTRAL)
            {
            //    console.log("(" + x + ", " +  y + ")");
                grid[index] = FLAG_TERRAIN;
            }
        }
    }
}

function addStructureBounds(grid, posList)
{
    if (! posList)
        return;
    
    for (var i=0; i<posList.length; ++i)
    {
        var lookup = posList[i].structureType;
        
        var radius = 1; 
        
        if (radiusMap[lookup] != undefined)
            radius = radiusMap[lookup];
        
        setBounds(grid, posList[i].pos, radius);
    }
}

function addPathway(grid, p1, p2, value)
{
    // TODO: The outer sections of the pathway don't necessarily need to be A PATHWAY
    var r = types.Rectangle();
    r.left = Math.max(Math.min(p1.x, p2.x) - 2, 0);
    r.top = Math.max(Math.min(p1.y, p2.y) - 2, 0);
    r.right = Math.min(Math.max(p1.x, p2.x) + 2, ROOM_SIZE);
    r.bottom = Math.min(Math.max(p1.y, p2.y) + 2, ROOM_SIZE);
    
    for (var y = r.top; y <= r.bottom; ++y)
    {
        for (var x = r.left; x <= r.right; ++x)
        {
            var index = (y * ROOM_SIZE) + x;
            if (grid[index] >= NEUTRAL)
            {
                grid[index] = PASSABLE_PATHWAY;
            }
        }
    }
}
*/


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


function makeImpassable(location, objType)
{
    var radius = 1;
    
    var p = location.pos != undefined ? location.pos : location;
    
    if (impassableRadius[objType] != undefined)
        radius = impassableRadius[objType];
    
    for (var y = p.y - radius; y <= p.y + radius; ++y)
    {
        for (var x = p.x - radius; x <= p.x + radius; ++x)
        {
            var d = Math.abs(x - p.x) + Math.abs(y - p.y);
            if (d > radius)
                continue;
            
            var tile = this.getTile(x, y);
            
            if ( tile && (tile.flag & FLAG_IMPASSABLE) == 0)    
            {
                // Distance Check
                // This should probably be UNBUILDABLE ?
                tile.flag |= FLAG_IMPASSABLE;
            }
        }
    }
}

 


function calcBoundaryCost(x, y, flags)
{
    var totalCost = 0;
    if (flags & EXIT_TOP)
    {
        var c = ROOM_SIZE - y;
        
        totalCost += (c * c) / 50;
    }
    
    if (flags & EXIT_BOTTOM)
    {
        var c = y;
        
        //totalCost += c;
        totalCost += (c * c) / 50;
    }
    
    if (flags & EXIT_LEFT)
    {
        var c = ROOM_SIZE - x;
        //totalCost += c;
        totalCost += (c * c) / 50;
    }
    
    if (flags & EXIT_RIGHT)
    {
        var c = x;
        //totalCost += c;
        totalCost += (c * c) / 50;
    }
    
    // Highest Possible Number is 200
    
    return Math.floor(totalCost);// Math.round(totalCost * 16);
}


function searchLocation(searchFlags)
{
    
    if (searchFlags == 0)
        return undefined;
    
    var queue = types.PriorityHighest();
    
    for (var y=0; y<ROOM_SIZE; ++y)
    {
        for (var x=0; x<this.sizeX; ++x)
        {
            var tile = this.tiles[y * ROOM_SIZE + x];
            
            if ( (tile.flag & FLAG_IMPASSABLE) == 0)
            {
                var c = 0;
                
                if (searchFlags & SEARCH_TERRAIN_POS)
                    c += tile.terrain;
                else if (searchFlags & SEARCH_TERRAIN_NEG)
                    c -= tile.terrain;
                    
                if (searchFlags & SEARCH_BOUNDARY_POS)
                    c += tile.boundary;
                else if (searchFlags & SEARCH_TERRAIN_NEG)
                    c -= tile.terrain;
                
                queue.push(c, y * ROOM_SIZE + x);                   
            }
        }
    }
    
    
    var index = queue.pop();
    if (index == undefined)
        return undefined;
    
    var x = Math.floor(index % ROOM_SIZE);
    var y = Math.floor(index / ROOM_SIZE);
    
    
    var p = this.room.getPositionAt(x, y);
    
    return p;
}

function getTile(x, y)
{
     if (x < 0 || x >= ROOM_SIZE ||
        y < 0 || y >= ROOM_SIZE)
        return undefined;
    
    return this.tiles[y * ROOM_SIZE + x];
}

function RoomMap(room)
{
    if (! room)
        return null;
    
    this.room = room;
    this.offX = 0;
    this.offY = 0;
    this.sizeX = ROOM_SIZE;
    this.sizeY = ROOM_SIZE;
    this.tiles = [];
    this.tiles.length = this.sizeX * this.sizeY;
    
    //this.tiles.fill();
    this.getTile = getTile;
    this.searchLocation = searchLocation;
    this.makeImpassable = makeImpassable;
    
    
    // TODO: Rewrite this to store into the cache
    // Add Impassable regions
    var data = this.room.lookForAtArea(LOOK_TERRAIN, this.offY, this.offX, this.sizeX, this.sizeY, true);
    
    for (var i=0; i<data.length; ++i)
    {
        var d = data[i];
        
        var index = (d.y * this.sizeX) + d.x;
        
        this.tiles[index] = new Tile();
        
        if (d.type == 'terrain' && d.terrain == 'wall')
        {
            this.tiles[index].flag = FLAG_IMPASSABLE;
            this.tiles[index].terrain = 255;
        }
    }

    // TODO: Load from Cache

    // Blur the terrain
    blur.box(this.tiles, 50, 50, 1, getTerrainCost, setTerrainCost);




    var structures = this.room.find(FIND_STRUCTURES);
    for (var i=0; i<structures.length; ++i)
    {
        var structure = structures[i];
        
        if (structure.structureType == 'rampart')
            continue;
        
        this.makeImpassable(structure, structure.structureType);
    }
    
    var sites = this.room.find(FIND_CONSTRUCTION_SITES);
    for (var i=0; i<sites.length; ++i)
    {
        var site = sites[i];
        
        if (site.structureType == 'rampart')
            continue;
        
        this.makeImpassable(site, site.structureType);
    }
    

    // Add Boundaries
    var boundaryFlags = 0;
    if (this.room.hasNorthExit())
        boundaryFlags |= EXIT_TOP;

    if (this.room.hasSouthExit())
        boundaryFlags |= EXIT_BOTTOM;

    if (this.room.hasWestExit())
        boundaryFlags |= EXIT_LEFT;
    
    if (this.room.hasEastExit())
        boundaryFlags |= EXIT_RIGHT;
    
    for (var y=0; y<ROOM_SIZE; ++y)
    {
        for (var x=0; x<ROOM_SIZE; ++x)
        {
            var index = y * ROOM_SIZE + x;
            var tile = this.tiles[index];
            
            if (x < BORDER_WIDTH || x >= ROOM_SIZE - BORDER_WIDTH ||
                y < BORDER_WIDTH || y >= ROOM_SIZE - BORDER_WIDTH)
                tile.flag |= FLAG_IMPASSABLE;
            

            if ((tile.flag & FLAG_IMPASSABLE) == 0)
            {
                tile.boundary = calcBoundaryCost(x, y, boundaryFlags)
            }
        }
    }





    if (true)
    {
        for (var y = 0; y < this.sizeY; ++y)
        {
            var ty = y + this.offY;
            
            for (var x = 0; x < this.sizeX; ++x)
            {
                var tx = x + this.offX;
                var index = (y * this.sizeX) + x;            
                
                var colour = '#00ff00';
                
            
                var tile = this.tiles[index];
                
                var flag = tile.flag;
                var terrainCost = tile.terrain != undefined ? tile.terrain : 0;
                var boundaryCost = tile.boundary;
                
    
                
            //    if (terrainCost > 0)
             //       terrainCost += 50;
         //       if (terrainCost > 90)
           //         terrainCost = 90;
                
                terrainCost = terrainCost.toFixed();
                boundaryCost = boundaryCost.toFixed();
                
                var terrainHex = hex[terrainCost];
                var boundaryHex = hex[boundaryCost];
                
                if ((flag & FLAG_IMPASSABLE) != 0)
                    colour = '#ff0000';
                else
                    colour = '#' + terrainHex + boundaryHex + '00';
                
            //    this.room.visual.rect(tx, ty, 1, 1, {fill:colour, opacity:0.5});
                this.room.visual.circle(tx, ty, {fill:colour, opacity:0.5, radius:0.5});
            //    this.room.visual.text(boundaryHex, tx, ty, {color:'black'});
      
            }
        }
    }

    return this;    
}
 


 
 
module.exports = 
{
    RoomMap: RoomMap,
    SEARCH_EXTENSION: SEARCH_EXTENSION
};


