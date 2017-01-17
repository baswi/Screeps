var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.returning && creep.carry.energy == 0) {
            creep.memory.returning = false;
	    }
	    if(!creep.memory.returning && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.returning = true;
	    }

	    if(creep.memory.returning) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
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

module.exports = roleUpgrader;