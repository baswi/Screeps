var roleBuilder = require('role.builder');

var roleDismantler = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        if (creep.memory.target == undefined) {
            creep.memory.target = '586e0e846b8cd2c752a0b398';
        }

        if (creep.memory.working) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_EXTENSION ||
                             structure.structureType == STRUCTURE_SPAWN ||
                             structure.structureType == STRUCTURE_TOWER)
                          && structure.energy < structure.energyCapacity)
                }
            });

            if (targets.length > 0) {

                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && !creep.fatigue) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                roleBuilder.run(creep);
            }
        }
        else {

            var target = Game.getObjectById(creep.memory.target);
            if (creep.dismantle(target) == ERR_NOT_IN_RANGE && !creep.fatigue) {
                creep.moveTo(target);
            }

        }
    }


};

module.exports = roleDismantler;