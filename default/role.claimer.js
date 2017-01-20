module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep **/
    run: function (creep) {
        // if in target room
        if (creep.room.name != creep.memory.target) {
            // find exit to target room
            if (!creep.fatigue) {
                var exit = creep.room.findExitTo(creep.memory.target);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
        else {
            // try to claim controller
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE && !creep.fatigue) {
                // move towards the controller
                creep.moveTo(creep.room.controller);
            }
        }
    }
};