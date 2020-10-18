
class CountersDB
{
    constructor()
    {
        if (Memory.counters == undefined)
            Memory.counters = {}

        this.memory = Memory.counters;
    }

    increase(id, action, roomName)
    {
        // Lazy-Instantiation
        if (! this.memory[id])
            this.memory[id] = {};

        if (! this.memory[id][action])
            this.memory[id][action] = 0;

        this.memory[id][action] += 1;

        if (roomName)
            this.increase(roomName, action, undefined);

        return this.memory[id][action];
    }

    decrease(id, action, roomName)
    {
        if (! this.memory[id])
            return 0;
        if (! this.memory[id][action])
            return 0;

        this.memory[id][action] -= 1;
        var value = this.memory[id][action];
        
        // Self Delete
        if (this.memory[id][action] <= 0)
            delete this.memory[id][action];
        if (Object.keys(this.memory[id]).length == 0)
            delete this.memory[id]

        if (roomName)
            this.decrease(roomName, action, undefined);

        return value;
    }

    get(id, action)
    {
        if (! this.memory[id])
            return 0;
        if (! this.memory[id][action])
            return 0;        

        return this.memory[id][action];
    }

    /* 
        Return all counters for this ID
    */
    getId(id)
    {
        if (! this.memory[id])
            return null;
        return this.memory[id]
    }
}



module.exports = CountersDB