var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {

            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }

            else {

                var repairitnow = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.hits < 650 && structure.hits > 0)
                    }
                });

                if (repairitnow.length > 0) {
                    if (creep.repair(repairitnow[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairitnow[0]);
                    }
                }
                else {
                    var repairit = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.hits < structure.hitsMax && structure.hits > 0 && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART)
                        }
                    });

                    var repairwall = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax && structure.hits > 0) ||
                            (structure.hits < 150000 && structure.hits > 0 && structure.structureType == STRUCTURE_WALL))
                        }
                    });
                    if (repairit.length > 0) {
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

module.exports = roleBuilder;