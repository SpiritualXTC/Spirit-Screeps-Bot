
Flag.prototype.update = function()
{
    if (! this.memory)
        this.memory = {'ticks': 10};

    this.memory.ticks -= 1;


    if (this.memory.ticks <= 0)
    {   
        console.log('remove flag: ' + this.name)
        this.remove()
    }
}

module.exports = {

};