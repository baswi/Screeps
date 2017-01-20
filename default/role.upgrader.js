var roleUpgrader = {

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
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE && !creep.fatigue) {
                creep.moveTo(creep.room.controller);
            }
        }
	    else {
	        creep.getEnergy();
        }
	}
};

module.exports = roleUpgrader;