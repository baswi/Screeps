/***MEMORY:
 *          source = the source that shall be mined
 *          container = if undefined mine and put the energy on the ground. If it has a object-ID go to that (container) and harvest
 ***/
var roleMiner = {

        /** @param {Creep} creep **/
    run: function (creep) {
        // TODO
        // put all the memory checking and setting parts into the memoryControl
// if the miner has no specified source it will check for a free source
        if (creep.memory.source == undefined && creep.id != undefined) {
            for (let i in creep.room.memory.sources) {
                if (!creep.room.memory.sources[i].mining) {
                    console.log('Room ' + creep.room.name + ' Source ' + i + ' mining set to: ' + creep.room.memory.sources[i].mining);
                }
                // check if this source shall be mined. When yes check if it is free
                    if (creep.room.memory.sources[i].mining &&
                        (((Game.getObjectById(creep.room.memory.sources[i].minerID)) == null) ||
                        (Game.getObjectById(creep.room.memory.sources[i].minerID) == creep))) {
                            // save new miner into the room memory
                            creep.room.memory.sources[i].minerID = creep.id;
                            // save the source in the creeps memory
                            creep.memory.source = creep.room.memory.sources[i].sourceID;
                        // are there any containers next to the source?
                            let container = creep.room.memory.sources[i].container;
                            if (container != undefined) {
                                creep.memory.container = container;
                            }
                            break;
                    }
                }
// check if the miner actually found a source
            if (creep.memory.source == undefined){
                console.log(creep.name+': no free mines left in room: '+creep.room.name);
            }
        }


        var source = Game.getObjectById(creep.memory.source);
        // should the creep mine into a container?
        if (creep.memory.container != undefined) {
            let container = Game.getObjectById(creep.memory.container);
            // if creep is on top of the container
            if (creep.pos.isEqualTo(container.pos)) {
                // harvest source
                creep.harvest(source);
            }
                // if creep is not on top of the container
            else {
                // move towards it
                if (!creep.fatigue) {
                    creep.moveTo(container);
                }
            }
        }
        // otherwise just harvest and put the Energy on the ground
        else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            if (!creep.fatigue) {
                creep.moveTo(source);
            }
        }
    }
}

module.exports = roleMiner;