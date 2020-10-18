
// Needs updates!

class RoomTarget
{
    constructor(room, currentPosition, targetRoomName, exitFind)
    {
        this.targetRoomName = targetRoomName;
        this.room = room;
        this.currentPosition = currentPosition;
        this.exitFind = exitFind;
    }

    cost(creep)
    {
        
    }

    actionCost(creep)
    {   
        var r = Game.historyDB.getRoom(this.targetRoomName);
        if (r && r.lastOwner && r.lastOwner != Game.username)
        {
          //  console.log('Planning to search a potentially hostile zone: ' + this.targetRoomName + '. Owned by ' + r.lastOwner);
            return 0.1;
        }

        var f = Math.random()  + 1;

        console.log('Search: ' + this.targetRoomName + ", " + f);
        return f;
    }
}



class ActionSearch
{
    init(target) 
    {
        var exits = target.room.find(target.exitFind);
        
        var i = Math.floor(Math.random() * exits.length);
        var e = exits[i];

        var data = {};
        data.x = e.x;
        data.y = e.y;
        data.targetRoomName = target.room.name;
        data.action = 'search';
        return data;
    }

    update(creep, data)
    {
        var roomPos = new RoomPosition(data.x, data.y, data.targetRoomName);
        
        var distance = creep.distanceTo(roomPos);
        if (distance == 0)
        {
            return false;
        }
        var result = creep.moveTo(roomPos, {visualizePathStyle: {stroke: '#888888'}});
        return result == OK || result == ERR_TIRED;
    }

    start(data)
    {

    }

    stop(data)
    {

    }

    targets(creep)
    {
        var exits = Game.map.describeExits(creep.room.name)
        var targets = []
        for (var x in exits)
        {
            var rt = new RoomTarget(creep.room, creep.currentPosition, exits[x], parseInt(x))
            targets.push(rt);
        }

        return targets;
    }
}

module.exports = ActionSearch;