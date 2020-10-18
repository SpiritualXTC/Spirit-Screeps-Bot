

class QuadTreeNode
{
    constructor(left, top, right, bottom)
    {
        this._nodes = null;

        this._score = 0;

        this._terrain = 0;
    }


    add(x, y)
    {

    }

    split()
    {

    }
}

class QuadTree extends QuadTreeNode
{
    constructor(left, top, right, bottom)
    {
        super(left, top, right, bottom)
    }

    add(x, y)
    {
        console.log(x + ", " + y);
    }
}

module.exports = QuadTree;