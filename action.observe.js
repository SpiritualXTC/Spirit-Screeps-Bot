/*
    Special Action, which moves to a targetted room... and then just moves around the room randomly. 
    Entire purpose is too "lock" the room down so we can have eyes on it
*/
var constants = require('constants');

class ActionObserve 
{
    init(target) 
    {
        var data = {}
        data.action = 'observe';
        data.roomName = target;

        var r = Game.historyDB.getRoom(target);
        if (r && r.controller)
        {
            data.x = r.controller.x;
            data.y = r.controller.y;
        }
        else
        {
            data.x = 25;
            data.y = 25;
        }
        return data;
    }

    update(creep, data)
    {

        if (creep.room.name != data.roomName)
        {
            console.log(data.roomName);
            var rp = new RoomPosition(data.x, data.y, data.roomName);

            var result = creep.moveTo(rp);
        }
        else
        {
            var result = creep.moveTo(data.x, data.y);
        }

        

        return true;
    }

    start(data)
    {
        console.log('START OBSERVE');
        Game.historyDB.addRoomStatus(constants.ROOM_OBSERVE);
    }

    stop(data)
    {
        console.log('STOP OBSERVE');
        Game.historyDB.removeRoomStatus(constants.ROOM_OBSERVE);
    }

    targets(creep)
    {
        return null;
    }
}

module.exports = ActionObserve;