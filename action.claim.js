


class TargetController
{
    constructor(controller)
    {

    }

    init()
    {
        var data = {}

        return data;
    }

    cost(creep, action)
    {
        return -1;
    }

    // TEMP
    actionCost(creep, action)
    {
        return this.cost(creep, action)
    }
}


class ActionClaim
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
        return null;
    }
}


module.exports = ActionClaim;