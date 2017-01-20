var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var memCtrl = require('memoryControl');


var roleWallBuilder = {

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
            // variables to check if the walls and ramparts are build to the set level
            let hitsAmount = creep.room.memory.wallConfigs.wallHits;
            let multiplier = creep.room.memory.wallConfigs.wallMultiplier;
            let maxMultiplier = creep.room.memory.wallConfigs.wallMaxMultiplier;
            let repairTo = hitsAmount * multiplier;
            // find walls and ramparts that need to be repaired
            let repairwall = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_RAMPART && structure.hits < repairTo && structure.hits < structure.hitsMax ||
                            (structure.hits < repairTo && structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax)))
                }
            });
            // if found repair them
            if (repairwall.length > 0) {
                if (creep.repair(repairwall[0]) == ERR_NOT_IN_RANGE && !creep.fatigue) {
                    creep.moveTo(repairwall[0]);
                }
            }
            // if there are more repairing rounds to go, switch to next round
            else if(multiplier<maxMultiplier){
                memCtrl.incrementRoomsWallMultiplier(creep.room.name);
            }
            else {
                roleBuilder.run(creep);
            }
        }
        else {
            creep.getEnergy();
        }
    }
};

module.exports = roleWallBuilder;