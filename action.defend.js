

class DefendPosition
{
    constructor(pos)
    {
        
        //this.rp = pos;

        if (pos.x == 0 || pos.x == 49)
        {
            // East / West
            this.x = pos.x == 0 ? 3 : 46;
            this.y = pos.y;
        }
        if (pos.y == 0 || pos.y == 49)
        {
            // South /  North
            this.x = pos.x;
            this.y = pos.y == 0 ? 3 : 46;
        }

        
        //console.log(this.rp)
    }

    cost(creep)
    {
        console.log('DEFEND: implement cost ')
        return 1;
    }

    actionCost(creep, action)
    {
        // TODO Need to generate a matrix of someform or another and cache it.
        // Then need to apply other elements to it
        return Math.random();
    }

}


class ActionDefend
{
    init(target) 
    {
        var data = {}
        data.x = target.x;
        data.y = target.y;
        data.action = 'defend';
        return data;
    }

    update(creep, data)
    {        
        var distance = creep.distanceTo(data);
        var result = OK;
        
        // TODO: Determine if room has invaders!
        //  Look in notifyDB for current room and home room.
        //  If any enemies ... todo what?

        if (distance > 0)
            result = creep.moveTo(data.x, data.y, {visualizePathStyle: {stroke: '#00ffff'}});

        return true;
    }

    start(data)
    {

    }

    stop(data)
    {

    }

    targets(creep)
    {
        var exits = creep.room.find(FIND_EXIT);
        
        
        var targets = [];
        for (var idx in exits)
        {
            var target = new DefendPosition(exits[idx])
            targets.push(target);
        }

        return targets;
    }
}

module.exports = ActionDefend;