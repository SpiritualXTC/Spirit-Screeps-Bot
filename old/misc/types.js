/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('types');
 * mod.thing == 'a thing'; // true
 */
 
 
/*
    TODO:
    Priority DataType where only the "best" choice is stored. Only involves storing a single item and doesn't require any lists :)
*/
 

var priorityQueue = require('type.priorityqueue');
var rectangle = require('type.rectangle');
var region = require('type.region');
var grid = require('type.grid');

// Only Care about 1 value, the one with the highest priority
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


module.exports = 
{
    PriorityQueue: priorityQueue,
    PriorityHighest: PriorityHighest,
    PriorityLowest: PriorityLowest,
    
    Rectangle: rectangle,
    Region: region,
    Grid: grid
};