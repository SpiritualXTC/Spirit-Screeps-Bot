
var Priority = require('priorityqueue');

var constants = require('constants')

var ActionHarvest = require('action.harvest');
var ActionStore = require('action.store');
var ActionUpgrade = require('action.upgrade');
var ActionBuild = require('action.build');
var ActionRepair = require('action.repair');
var ActionSearch = require('action.search');
var ActionDefend = require('action.defend');
var ActionObserve = require('action.observe');
var ActionClaim = require('action.claim');

class Target
{
    constructor(o)
    {

    }

    data()
    {
        var data = {}

        return data;
    }

    cost(creep)
    {
        return -1;
    }

    // TEMP: Remove this at a later point
    actionCost(creep, action)
    {
        return this.cost(creep)
    }
}

class Action 
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



var roles = {};
roles[constants.ROLE_WORKER] = [constants.ACTION_HARVEST, constants.ACTION_STORE, constants.ACTION_UPGRADE, constants.ACTION_BUILD, constants.ACTION_REPAIR];
roles[constants.ROLE_SCOUT] = [constants.ACTION_SEARCH, 'visibility'];
roles[constants.ROLE_TANK] = [constants.ACTION_DEFEND];

roles[constants.ROLE_OBSERVER] = []
roles[constants.ROLE_SETTLER] = []


// Action Management
var actions = {};
actions[constants.ACTION_HARVEST]  = new ActionHarvest();
actions[constants.ACTION_STORE]    = new ActionStore();
actions[constants.ACTION_UPGRADE]  = new ActionUpgrade();
actions[constants.ACTION_BUILD]    = new ActionBuild();
actions[constants.ACTION_REPAIR]   = new ActionRepair();
actions[constants.ACTION_SEARCH]   = new ActionSearch();

actions[constants.ACTION_DEFEND]    = new ActionDefend();

actions[constants.ACTION_OBSERVE]   = new ActionObserve();
actions[constants.ACTION_CLAIM]     = new ActionClaim();


actions['visibility']    = new Action(); // TODO
// actions[actionHome.action]      = actionHome;
// actions[actionPickup.action]    = actionPickup;

function ActionDB()
{

}

ActionDB.prototype.getAction = function(action)
{
    return actions[action];
}

ActionDB.prototype.determineAction = function(creep)
{
    var r = creep.room;

    var availableTargets = [];
    
    role = creep.getRole()
    role_actions = roles[role]

    var targetQ  = Priority.PriorityHighest();
    
    for (var idx in role_actions)
    {       
        action = role_actions[idx];

        var a = Game.actionDB.getAction(action)
        if (a.targets)
        {
            var targetList = a.targets(creep);

            // Were any targets available for this action?
            if (targetList && targetList.length > 0)
            {
                availableTargets = availableTargets.concat(targetList);
                for (var i=0; i<targetList.length; ++i)
                {
                    var t = targetList[i];
                    
                    if (! t)
                    {
                        console.log('ACTIONS: No Target defined');
                    }
                    
                    // Calculate the Heuristic
                    var c = 1;
                    if (t.actionCost)
                        c = t.actionCost(creep, action);
                                        
                    // Add to the "Queue"
                    if (c != -1)
                    {
                        // Add the Multiplier
                        var w = creep.calcActionWeight(action, t);

                        targetQ.push(c * w, {action: action, target: t});
                    }
                }
            }
        }
    }
    
    var targetAction = targetQ.top();
    if (targetAction)
    {
        // TODO: Tie the action to the target
        var target = targetAction.target;

        if (target.data)
        {
            return target.data();
        }        

        
        var action = actions[targetAction.action];        
        if (target && action && action.init)
        {


            var data = action.init(target);
            if (data)
            {    
                // Append the Action type
                // data.action = action.action;
                return data;
            }
        }
        
        
    }
    return null;
}


module.exports = ActionDB