/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common.creep');
 * mod.thing == 'a thing'; // true
 */
 
var types = require('types');




var actions = require('actions');
var roles = require('creeps');



// Action Management -- THis allows actions to contain their own memory rather than relying on all actions being memory effecient and not adding new shit all the time
// =================
// Adds an Action to the List of Actions
Creep.prototype.addAction = function(data)
{
    if (! data || ! data.action)
        return;
    
    if (! this.memory.actions)
        this.memory.actions = [];
    
    // Push to front of array 
    
    // TODO: Event Models are conducted here
    this.memory.actions.unshift(data);
    
    // Send an Event
    actions.startAction(data);
    
    return true;
}

// Completes and Removes the Current Action
Creep.prototype.completeAction = function()
{   
    // TODO: Event Models are conducted here
    this.memory.actions.splice(0, 1);
}

// The creep currently has no actions assigned to it, and isn't doing anything
Creep.prototype.isIdle = function()
{
    return ! this.memory.actions || this.memory.actions.length == 0;
}

// Gets the Current Action
Creep.prototype.getAction = function()
{
    if (! this.memory.actions || ! this.memory.actions.length)
        return null;    // This is when AI needs to be done
        
    // Always get the first action
    return this.memory.actions[0];
}

// Gets the Creeps Role
Creep.prototype.getRole = function()
{
    return this.memory.role;
}








// ================================================================================
// UTILITY
// ================================================================================

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


Creep.prototype.findAction = function(actionList)
{
    var a = actions.determineAction(this, actionList);
    
    if (a)
        this.addAction(a);
    else
        console.log("CREEP: Sitting idle, No Actions - " + this.name);  
        
    return a;
}


// ================================================================================
// PROCESS
// ================================================================================
Creep.prototype.update = function()
{
    // Reset All the Memory of the Worker :: Do NOT activate this yet :)
    var role = roles[this.getRole()];
   
    if (! role)
    {
        // suicide?
        return;
    }
   
    // Update Role
    if (role.update)
        role.update(this);

    // Run the creeps actions
    var actionData = this.getAction();
    
    // Idle? Find an action to perform
    if (! actionData)
        actionData = this.findAction(role.actionList);
    
    if (actionData)
    {
        var action = actions.getAction(actionData.action);
        if (action)    
        {
            var result = action.update(this, actionData);
        
            if (! result)
            {
                actions.stopAction(actionData);
                this.completeAction();
            }
        }
    }
}



// ================================================================================
// EVENTS
// ================================================================================



module.exports = 
{

};