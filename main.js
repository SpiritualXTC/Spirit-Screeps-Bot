
require('room')
require('structure.base')
require('structure.container')
require('structure.spawn')
require('structure.controller')
require('structure.storage')
require('structure.extension')
require('structure.tower');
require('construction')

require('source')
require('flag')

var Creep = require('creep')




var CreepDB = require('creep_db')
var ActionDB = require('action_db')
var HistoryDB = require('history_db')
var NotifyDB = require('notify_db')
var CounterDB = require('counters_db')

module.exports.loop = function()
{
    // Leet Hax
    if (Game.spawns)
        Game.username = Game.spawns[Object.keys(Game.spawns)[0]].owner.username
    else
        Game.usernamne = '[anon]'

    // Additional Memory Points
    if (Memory.structures == undefined)
        Memory.structures = {}
    if (Memory.sources == undefined)
        Memory.sources = {}
    if (Memory.sites == undefined)
        Memory.sites = {}

    // Create Database Memory Accessors
    Game.creepDB = new CreepDB();
    Game.actionDB = new ActionDB();
    Game.historyDB = new HistoryDB();
    Game.notifyDB = new NotifyDB();
    Game.countersDB = new CounterDB();

    // Update all rooms
    for (var name in Game.rooms)
    {   
        //console.log('Room = ' + name);
        Game.rooms[name].update();
    }

    // Update all structures
    for (var name in Game.structures)
    {
        Game.structures[name].update();
    }
    
    // Update all creeps
    for(var name in Game.creeps)
    {
        Game.creeps[name].update();
    }

    // Update all flags
    for (var name in Game.flags)
    {
        Game.flags[name].update();
    }

    // Display a counter next to sources
    for (var name in Memory.sources)
    {
        var source = Game.getObjectById(name);
        if (source)
            source.update();
    }

    // Cleanup any dead Creeps
    cleanUp(Memory.creeps, Game.creeps, Creep.cleanUp);
    cleanUp(Memory.structures, Game.structures);
    cleanUp(Memory.rooms, Game.rooms);
    cleanUp(Memory.flags, Game.flags);
}

function cleanUp(memoryObject, gameObject, callback)
{
    for (var id in memoryObject)
    {
        if (! gameObject[id])
        {   
            if (callback)
            {
                callback(memoryObject[id])                
            }

            delete memoryObject[id];
        }
    }
}
