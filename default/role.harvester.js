var roleUpgrader = require('role.upgrader');

var roleHarvester = {

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


        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	    }

	    if(creep.memory.working) {
	        var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
	            // the second argument for findClosestByPath is an object which takes
	            // a property called filter which can be a function
	            // we use the arrow operator to define it
	            filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION
                             || s.structureType == STRUCTURE_TOWER)
                             && s.energy < s.energyCapacity
	        });

	        if (structure == undefined) {
	            structure = creep.room.storage;
	        }

	        // if we found one
	        if (structure != undefined) {
	            // try to transfer energy, if it is not in range
	            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && !creep.fatigue) {
	                // move towards it
	                creep.moveTo(structure);
	            }
	        }
            else{
                roleUpgrader.run(creep);
            }
        }
	    else {
	        creep.getEnergy();
        }
    }


};

module.exports = roleHarvester;