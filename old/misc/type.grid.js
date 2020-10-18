/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('type.grid');
 * mod.thing == 'a thing'; // true
 */


/*
    Interpreter interface
    VALUE = interpreter(data, index);
*/



// Copies the srcData to the grid, via an interpreter function
function setData(srcData, interpreter)
{
    if (! srcData || srcData.length < this.grid.length)
        return false;
    
    
    for (var y=0; y<this.height; ++y)
    {
        for (var x=0; x<this.width; ++x)
        {
            var index = this.getIndex(x, y);
            
            this.grid[index] = interpreter(data, index);
        }
    }

    return true;  
}


function fill(value)
{
    this.tiles.fill(value);
}



function getIndex(x, y)
{
    return y * this.width + x;
}

function getValue(x, y)
{
    var index = y * this.width + x;
    
    return this.grid[index];
}

function setValue(x, y, value)
{
    var index = y * this.width + x;
    
    this.grid[index] = value;
}



// Makes a copy of the row
function getRow(y, interpreter)
{
    
}


// Makes a copy of the column
function getColumn(x, interpreter)
{
    
}




function Grid(w, h, data, interpreter)
{
    this.width = w;
    this.height = h;
    
    
    this.grid = [];
    this.grid.length = w * h;
    
    
    // Set Functions
    this.setData = setData;
    this.getValue = getValue;
    this.setValue = setValue;
    this.getRow = getRow;
    this.getColumn = getColumn;
    
    this.getIndex = getIndex;
    
    this.fill = fill;
    
    
    // Initialisation
    if (interpreter)
    {
        setData(data, interpreter);
    }

    return this;
}







module.exports = Grid;