var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');


var roleWallBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }
     
     
        if (creep.memory.building) {
            var repairwall = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax) ||
                                (structure.hits < 300000 && structure.structureType == STRUCTURE_WALL))
                            }
                        });
                        
            if (repairwall.length > 0) {
                if (creep.repair(repairwall[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairwall[0]);
                }     
            }
            else {
                roleBuilder.run(creep);
            }
        }
        else {
            var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
                filter: (e) => e.amount > 50
            });

            if (dropenergy) {
                if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropenergy);
                }
            }
            else {
                //harvest if no dropped energy
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }            
        }
    }
};

module.exports = roleWallBuilder;