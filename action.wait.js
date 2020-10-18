
var constants = require('constants')

class TargetWaitRoom
{

}


class ActionWait
{
    init(target) 
    {
        console.log('logging')
        return null;
    }

    update(creep, data)
    {

    }

    start(data)
    {

    }

    stop(data)
    {

    }

    targets(creep)
    {
        if (action == constants.ROLE_WORKER)
            return null;

        if (action == constants.ROLE_SCOUT)
        {
            // TODO: Look if the room we are in has a notify on it
            

        }

        return null;
    }
}


module.exports = ActionWait