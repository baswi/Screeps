
var meleeFighter = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let flag = Game.flags.attackFlag;

        if (creep.pos.roomName === flag.pos.roomName) {
            let spawn, hostileCreep, hostileBuilding, target;

            if ((spawn = creep.room.find(FIND_HOSTILE_SPAWNS)[0]) != undefined) {
                target = spawn;
            }
            else if ((hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)) != undefined) {
                target = hostileCreep;
            }
            else if ((hostileBuilding = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter: (s) => s.structureType != STRUCTURE_CONTROLLER})) != undefined){
                target = hostileBuilding;
            }

            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }

        }
        else {
            creep.moveTo(flag)
        }

    }
};

module.exports = meleeFighter;