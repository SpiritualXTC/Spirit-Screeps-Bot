const ActionBuild = require("./action.build");


class HistoryDB
{
    constructor()
    {
        if (Memory.history == undefined)
            Memory.history = {}

        this.memory = Memory.history;
    }

    getRoom(roomName)
    {
        return this.memory[roomName];
    }


    addRoomStatus(roomName, status)
    {
        var r = this.getRoom();
        if (r)
            r.status.add(status);
    }

    hasRoomStatus(roomName, status)
    {
        var r = this.getRoom();
        return r ? r.status.has(status) : false;
    }

    removeRoomStatus(roomName, status)
    {
        var r = this.getRoom();
        if (r)
            r.status.delete(status);
    }

    updateRoom(r)
    {
        if (this.memory[r.name] == undefined)
        {
            this.memory[r.name] = {}
        }

        var roomDB = this.memory[r.name];
        
        if (roomDB.status == undefined)
            roomDB.status = new Set();

        // Set the status. This is always updated
        
        if (! r.controller)
            roomDB.lastOwner = null;
        else if (r.controller.owner)
            roomDB.lastOwner = r.controller.owner.username
        else if (r.controller.reservation)
            roomDB.lastOwner = r.controller.reservation.username
        else
            roomDB.lastOwner = null;

        
        if (! roomDB.controller)
        {
            var controller = {}
            controller.x = r.controller.pos.x;
            controller.y = r.controller.pos.y;
            roomDB.controller = controller;
        }
        if (! roomDB.sources)
        {
            var sourcesDB = [];
            var sources = r.find(FIND_SOURCES);
            for (var i=0; i<sources.length; ++i)
            {
                var s = sources[i];
                sourcesDB.push({id: s.id, x: s.pos.x, y: s.pos.y});
            }            
            roomDB.sources = sourcesDB;
        }
        if (! roomDB.minerals)
        {
            var mineralsDB = []
            var minerals = r.find(FIND_MINERALS);
            for (var i=0; i<minerals.length; ++i)
            {
                var m = minerals[i]
                mineralsDB.push({id: m.id, x: m.pos.x, y: m.pos.y});
            }
            roomDB.minerals = mineralsDB;
        }

        
    }
}

module.exports = HistoryDB;