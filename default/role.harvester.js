var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if(creep.memory.returning && creep.carry.energy == 0) {
            creep.memory.returning = false;
	    }
	    if(!creep.memory.returning && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.returning = true;
	    }

	    if(creep.memory.returning) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity)
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else{
                roleUpgrader.run(creep);
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
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1]);
                }
            }
        }
    }
    
    
};

module.exports = roleHarvester;