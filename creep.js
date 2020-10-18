



// The creep currently has no actions assigned to it, and isn't doing anything
Creep.prototype.isIdle = function()
{
    return ! this.memory.actions || this.memory.actions.length == 0;
}


// Gets the Creeps Role
Creep.prototype.getRole = function()
{
    return this.memory.role;
}

// Gets the Current Action
Creep.prototype.getAction = function()
{
    // Return the Current Action!
    if (this.memory.current)
        return this.memory.current;
    
    if (this.memory.initAction)
    {
        var action = this.memory.initAction;
        delete this.memory.initAction;
        return action;
    }

    // We don't have a current action.
    return Game.actionDB.determineAction(this, this.role);
}

// Calculates the distance to a room position
Creep.prototype.distanceTo = function(roomPos)
{
    var p = roomPos.pos == undefined ? roomPos : roomPos.pos;
    
    // This really should be conducted some level of pathfinding but YOLO
    var dx = Math.abs(p.x - this.pos.x);
    var dy = Math.abs(p.y - this.pos.y);
    
    return Math.max(dx, dy);
    
    // Calculates Manhattan distance to a another object -- This is NOT the most accurate distance to be using
    //return Math.abs(roomPos.pos.x - this.pos.x) + Math.abs(roomPos.pos.y - this.pos.y); 
}

// Calculates a weight based on a given action/target
Creep.prototype.calcActionWeight = function(action, target)
{

    // REMOVE

    // Ignore searches for now
    if (action == 'search')
        return 1
 
    if (! target.room)
    {
        // Either the room don't matter, or it needs to be implemented
        return 1;
    }
        
    if (this.memory.home == target.room.name)
        return 1;

    // TODO: May need to lower this a little, but it should be higher than 1/2
    if (this.room.name == target.room.name)
        return 0.9;
    
    var mul = 1.0;
    //if (this.)

    var distance = Game.map.getRoomLinearDistance(this.memory.home, target.room.name, false);
    return mul / (distance + 1);
}


// ================================================================================
// PROCESS
// ================================================================================
Creep.prototype.update = function()
{
    // Reset All the Memory of the Worker :: Do NOT activate this yet :)
    var role = this.getRole();
    
    //delete this.memory.actions;

    if (! role)
    {
        // suicide?
        return;
    }
    
    var track = false;
    if (this.name == 'worker_18964')
    {
        console.log('HI')
        track = true;
    }

    // Run the creeps actions
    var actionData = this.getAction();
    if (actionData)
    {
        if (track)
            console.log('Action: ' + actionData.action);
        
        var action = Game.actionDB.getAction(actionData.action);
        if (action)    
        {
            if (this.memory.current == undefined)
            {
                this.memory.current = actionData
                action.start(actionData);
            }

            var result = action.update(this, actionData);
            if (! result)
            {
                action.stop(actionData);
                this.memory.current = undefined;
            }
        }
    }
    else
    {
        if (track)
            console.log('IDLING');

        // console.log(this.name + ' is idling')
    }
}

function cleanUp(mem)
{
    if (mem.current)
    {
        var action = Game.actionDB.getAction(mem.current.action);
        if (action)    
        {
            action.stop(mem.current);
            console.log('Stopping action for dead creep' + action)
        }
    }
}

module.exports = {
    cleanUp: cleanUp,
}