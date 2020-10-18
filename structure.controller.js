var constants = require('constants');

StructureController.prototype.ticksToDownGradeMax = function()
{
    return CONTROLLER_DOWNGRADE[this.level];
}

StructureController.prototype.getMaxStructureCount = function(structureType)
{
    return CONTROLLER_STRUCTURES[structureType][this.level];
}

StructureController.prototype.update = function()
{
    var upgrade = Game.countersDB.get(this.id, constants.ACTION_UPGRADE);

    this.room.visual.text(upgrade, this.pos.x + 1, this.pos.y);
}

module.exports = 
{

};