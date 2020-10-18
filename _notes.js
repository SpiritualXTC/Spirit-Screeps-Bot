

// ================================================================================
// THIS IS NOT A MODULE
// ================================================================================

/*

TODO:
+ Support for Sub Actions
    - Actions like Guard/Patrol/Follow/Search should also be able to make a decision to attack and/or move
    - Actions such as renew/recyle should also be able to store
+ Support for auto building of structures (This requires the C++ WASM module support, for better performance)
+ Remove some of the deprecated code.
+ Decorate files so classes have their functions categorised
+ WASM may not be supported for private servers yet, only on the PTR
+ Support for stuff in the cache :: No-idea how this is going to work.
    - Only thing definate is that the cache needs to be updated frequently (say, once a minute) to remove old data
    - If something is added, timestamp needs to be set, so knowledge of removal can be done
    - If something si accessed, timestamp needs to be updated, so it doesn't get removed at the next junction
    - Some data may hold more value than otrher data so consequently it may be better to store a 'timeToLive' function that decrements every cache.update()
      Which in turn is only updated once every minute or so
      This will allow for less overall storage and NOT caring when the data was actually added
+ Persistant Visual Aids
    - Visual object for repeated drawing over a period of time. 
    - Each object has a TTL that decrements every tick
    - Include support for low level animations (all stateless based directly off the tick count)
    - Needs to track the room to draw in (or all rooms -- or just the viewable room?)
+ Cache the Room Terrain (for OWNED rooms only)
+ Auto place Storage and Containers and Turrets
+ Allow a non-owned room to request a guardian

UNITS:
+ Workers
    - Add support for harvesting from an 'UNKNOWN' location -- an unknown location is a location from the KnowledgeDB that is currently invisible
        Once the worker is in the appropriate room, the location becomes known and is therefore the same as before
+ Scouts
    - Improved room selection
+ Medics
+ Tanks
+ Melee
+ Ranged
+ Settler
+ Guard
    - Tanky unit that acts more as a mobile turret than an attack unit


ACTIONS:
+ Attack    : Attack a creep
+ Heal
+ Guard / Follow / Defend [Should these be the same?]
+ Patrol
+ GuardRequest
+ GuardRelease
+ Claim
+ PickUp
- Scout
    - Better room selection
- Harvest
    - Better source selection, including sources in NEARBY rooms that are currently known (This is currently an implied action built from ActionSearch)
    - Include Harvesting of minerals
+ Recycle
+ Renew

ROOMS:
+ Build a 'Road Map' to ease up the pathfinding for workers

KNOWLEDGE:
+ Room Hostility
+ Room Resource Value
    - Number of sources/minerals vs percentage of swampland in the room [lots of swampland makes moving around harvest areas annoying/slow]

*/

// ================================================================================
// THIS IS NOT A MODULE
// ================================================================================

NEW THINGS:
Only the Room class is valid, and api.knowledge