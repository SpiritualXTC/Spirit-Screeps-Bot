

function wrap(list, cb)
{
    var out = []
    for (var i=0; i<list.length; ++i)
    {
        out.push(cb(list[i]))
    }
    return out;
}




module.exports = {
    wrap: wrap,
}