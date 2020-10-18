/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('type.priorityqueue');
 * mod.thing == 'a thing'; // true
 */
 


/*
    Basic Priority Queue
    
    Current Version MAY not exist across 'ticks'
*/

function PriorityQueue()
{
    this._queue = []
    
    this.push = function(value, priority)
    {
        // TODO: Use something faster for this array... HEAP?
        
        var pos = 0;
        for (pos=0; pos<this._queue.length; ++pos)
        {
            var item = this._queue[pos];
            if (item.priority < priority)
                break;
        }
        
        this._queue.splice(pos, 0, {value:value, priority:priority});  
    }
        
    this.pop = function()
    {
        if (this._queue.length == 0)
            return null;
        
        var item = this._queue[0];
        this._queue.splice(0, 1);
        
        return item.value;
    }
    
    this.length = function()
    {
        return this._queue.length;
    }

    this.toString = function()
    {
        var s = "";
        for (var i=0; i<this._queue.length; ++i)
        {
            s += this._queue[i].priority + "\t= " + this._queue[i].value + "\n";
        }
        
        return s;
    }
    
    return this;
}


function PriorityHighest()
{
    this.priority = -1;
    this.value = null;
    
    this.push = function(priority, value)
    {
        if (this.priority == -1 || priority > this.priority)
        {
            this.priority = priority;
            this.value = value;
        }
    }
    
    this.pop = function()
    {
        var value = this.value;
        this.priority = -1;
        this.value = null;
        
        return value;
    }
    
    this.top = function()
    {
        return this.value;
    }
    
    return this;
}

// Only care about 1 value, the one with the lowest priority
function PriorityLowest()
{
    this.priority = -1;
    this.value = null;
    
    this.push = function(priority, value)
    {
        if (this.priority == -1 || priority < this.priority)
        {
            this.priority = priority;
            this.value = value;
        }
    }
    
    this.pop = function()
    {
        var value = this.value;
        this.priority = -1;
        this.value = null;
        
        return value;
    }
    
    this.top = function()
    {
        return this.value;
    }
    
    return this;
}


module.exports = {
    PriorityQueue: PriorityQueue,
    PriorityHighest: PriorityHighest,
    PriorityLowest: PriorityLowest,
}