var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // if target is defined and creep is not in target room
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            if (!creep.fatigue) {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.target);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            // return the function to not do anything else
            return;
        }

        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working) {

            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE && !creep.fatigue) {
                    creep.moveTo(target);
                }
            }

            else {

                var repairitnow = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.hits < 650 && structure.hits > 0)
                              || (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax))
                    }
                });

                if (repairitnow.length) {
                    if (creep.repair(repairitnow[0]) == ERR_NOT_IN_RANGE && !creep.fatigue) {
                        creep.moveTo(repairitnow[0]);
                    }
                }
                else {
                    var repairit = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.hits < structure.hitsMax && structure.hits > 0 && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART)
                        }
                    });

                    if (repairit.length) {
                        if (creep.repair(repairit[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(repairit[0]);
                        }
                    }
                    else {
                        roleUpgrader.run(creep);
                    }
                }
            }
        }


	    else {
            creep.getEnergy();
        }
    }
};

module.exports = roleBuilder;