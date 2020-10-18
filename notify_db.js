

class NotifyDB
{
    constructor()
    {
        // For now we aren't caching anything
        //if (Memory.notify == undefined)
        //    Memory.notify = {}

        this.memory = {}
    }

    notifyClaim(roomName, controllerId)
    {

    }

    notifyRoomVisibility(roomName)
    {
        // We want the room to be come visible

    }
}


module.exports = NotifyDB;