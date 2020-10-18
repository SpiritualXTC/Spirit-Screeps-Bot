/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('algorithm.gaussblur');
 * mod.thing == 'a thing'; // true
 */


//http://blog.ivank.net/fastest-gaussian-blur.html


function boxMatrix(sigma, n)
{
    var wIdeal = Math.sqrt((12 * sigma * sigma/n)+1);
    var wl = Math.floor(wIdeal);
    
    if (wl % 2 == 0)
        wl--;
        
    var wu = wl + 2;
    
    var mIdeal = ( (12 * sigma * sigma) - (n * wl * wl) - (4 * n * wl) - (3 * n)) / (-4 * wl - 4);
    
    var m = Math.round(mIdeal);
    
    var sizes = [];
    sizes.length = n;
    for (var i=0; i<n; ++i)
        sizes[i] = i < m ? wl : wu;
        
    return sizes;
}




function boxBlurH(srcGrid, width, height, blurRadius, getter, setter)
{
    for (var y=0; y<height; ++y)
    {
        // Duplicate of the row
        var rowCopy = [];
        //var rowCopy = srcGrid.slice(y * width, y * width + width);
        for (var x=0; x<width; ++x)
            rowCopy[x] = getter(srcGrid[y * width + x]);
        
        // This could be implemented in a more optimized version using a "moving window"
        for (var x=0; x<rowCopy.length; ++x)
        {
            var count = 0;
            var total = 0;
            
            for (var i=-blurRadius; i<=blurRadius; ++i)
            {
                var colIndex = x + i;
                if (colIndex < 0 || colIndex >= width)
                    continue;
                    
                ++count;
                total += rowCopy[colIndex];
            }
            
        //    var index = y * width + x;
        //    srcGrid[index] = total / count;
            setter(srcGrid[y * width + x], total / count);
        }
    }
}




function boxBlurV(srcGrid, width, height, blurRadius, getter, setter)
{
    for (var x=0; x<width; ++x)
    {
        // Duplicate of the column
        var colCopy = [];
        colCopy.length = height;
        
        for (var y=0; y<height; ++y)
        {
            //var index = y * width + x;
            //colCopy[y] = srcGrid[index];
            colCopy[y] = getter(srcGrid[y * width + x]);
        }
        
        for (var y=0; y<height; ++y)
        {
            var count = 0;
            var total = 0;
            
            for (var i=-blurRadius; i<=blurRadius; ++i)
            {
                var rowIndex = y + i;
                if (rowIndex < 0 || rowIndex >= height)
                    continue;
                    
                ++count;
                total += colCopy[rowIndex];
            }
            
        //    var index = y * width + x;
        //    srcGrid[index] = total / count;
            setter(srcGrid[y * width + x], total / count);
        }
        
        
        
    }
}



function boxBlur(srcGrid, width, height, radius, getter, setter)
{
    boxBlurH(srcGrid, width, height, radius, getter, setter);
    boxBlurV(srcGrid, width, height, radius, getter, setter);
}






module.exports = {
    box: boxBlur,
    boxHori: boxBlurH
};