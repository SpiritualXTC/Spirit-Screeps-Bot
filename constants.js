

ROLE_WORKER = 'worker';
ROLE_SCOUT = 'scout';
ROLE_OBSERVER = 'observer';

// ARMY
ROLE_TANK = 'tank';
ROLE_ATTACK = 'attacker';
ROLE_HEALER = 'healer';

ROLE_SETTLER = 'settler';


// Flag
FLAG_OBSERVE = 'observe'
FLAG_CLAIM  = 'claim'
// TODO: Flags for attack a room


module.exports = {}
module.exports.CONTROLLER_MAX_LEVEL = 8;




module.exports.ROLE_WORKER = ROLE_WORKER;
module.exports.ROLE_SCOUT = ROLE_SCOUT;
module.exports.ROLE_TANK = ROLE_TANK;
module.exports.ROLE_HEALER = ROLE_HEALER;
module.exports.ROLE_ATTACK = ROLE_ATTACK;


module.exports.ROLE_OBSERVER = ROLE_OBSERVER;
module.exports.ROLE_SETTLER = ROLE_SETTLER;


module.exports.ROLES = [
    ROLE_WORKER,
    ROLE_SCOUT,
    ROLE_TANK,
    ROLE_SETTLER,

    ROLE_OBSERVER,
]

module.exports.FLAG_OBSERVE = FLAG_OBSERVE;
module.exports.FLAG_CLAIM = FLAG_CLAIM
module.exports.FLAGS = [
    FLAG_OBSERVE,
    FLAG_CLAIM,
]

module.exports.ACTION_HARVEST   = 'harvest';
module.exports.ACTION_STORE     = 'store';
module.exports.ACTION_UPGRADE   = 'upgrade';
module.exports.ACTION_BUILD     = 'build';
module.exports.ACTION_REPAIR    = 'repair';
module.exports.ACTION_SEARCH    = 'search';
module.exports.ACTION_CLAIM     = 'claim';

module.exports.ACTION_DEFEND    = 'defend';



module.exports.ACTION_OBSERVE   = 'observe';


module.exports.ACTION_STATUS_WAIT      = 1;
module.exports.ACTION_STATUS_MOVING    = 2;


module.exports.ROOM_OBSERVE = 'investigate';
module.exports.ROOM_CLAIM = 'claim';


module.exports.TRACKING_SOURCE_HARVEST = 'harvestCount'