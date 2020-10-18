/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('api.visual');
 * mod.thing == 'a thing'; // true
 */
 
 

function _addCircle(x, y, radius, ticks, roomName, updater)
{
    
}

function _addLine(x1, y1, x2, y2, roomName, updater)
{
    
}

function _addRect(top, left, bottom, right, roomName, updater)
{
    
}
 
function _addText(x, y, s, ticks, roomName, updater)
{
    
}



function _render()
{
    // Iterate through memory object, calling the updater - I don't know how the updater will work yet as it can't be a function pointer
    
}

 
function Visual(memK)
{
    this.memory = memK;
    
    
    this.addCircle = _addCircle;
    this.addLine = _addLine;
    this.addRect = _addRect;
    this.addText = _addText;
    
    
    this.update = _render;
    
    return this;
}

module.exports = Visual;
