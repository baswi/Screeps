// create a new function for StructureTower
StructureTower.prototype.defend =
    function () {
        // find closest hostile creep
        let closestHostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // if found attack it
        if (closestHostile) {
            this.attack(closestHostile);
        }
    };

StructureTower.prototype.helpRepairing =
    function () {
        let closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
                                && structure.structureType != STRUCTURE_WALL
                                && structure.structureType != STRUCTURE_RAMPART
        });
        if (closestDamagedStructure) {
            this.repair(closestDamagedStructure);
        }
    }