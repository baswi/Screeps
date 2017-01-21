var memCtrl = require('memoryControl');

module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
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

        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
            // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // find closest spawn, extension or tower which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.structureType == STRUCTURE_EXTENSION
                             || s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_TOWER)
                             && s.energy < s.energyCapacity
            });

            if (structure == undefined) {
                let containers = [];
                for (let cID in creep.room.memory.containerForEnergy) {
                    let container = Game.getObjectById(creep.room.memory.containerForEnergy[cID]);
                    if (container == null) {
                        memCtrl.checkRoomForContainerToDeliverEnergyTo();
                    }
                    else if (container != null && container.store[RESOURCE_ENERGY] < container.storeCapacity) {
                        containers.push(container);
                    }
                }
                structure = creep.pos.findClosestByPath(containers);
            }

            if (structure == null || structure == undefined) {
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
        }
            // if creep is supposed to get energy
        else {

            // look if there is energy on the ground
            var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
                filter: (e) => e.amount > 100
            });
            if (dropenergy) {
                if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE && !creep.fatigue) {
                    creep.moveTo(dropenergy);
                }
            }
            else {
                // is there a miningContainer to get energy from
                let container = undefined;
                if (creep.room.memory.sources.length > 1) {
                    // if there are 2 chose the one that is storing more energy
                    let energySource1 = Game.getObjectById(creep.room.memory.sources[0].container);
                    let energySource2 = Game.getObjectById(creep.room.memory.sources[1].container);
                    if (energySource1 != null && energySource2 != null) {
                        energySource1 = Game.getObjectById(creep.room.memory.sources[0].container).store[RESOURCE_ENERGY];
                        energySource2 = Game.getObjectById(creep.room.memory.sources[1].container).store[RESOURCE_ENERGY];
                        if (energySource1 > energySource2) {
                            container = Game.getObjectById(creep.room.memory.sources[0].container);
                        }
                        else {
                            if (energySource2 != 0) {
                                container = Game.getObjectById(creep.room.memory.sources[1].container);
                            }

                        }
                    }

                }
                else if (creep.room.memory.sources.length == 1){
                    container = Game.getObjectById(creep.room.memory.sources[0].container);
                    if (container == null) {
                        container = undefined;
                    }
                    else if (Game.getObjectById(creep.room.memory.sources[0].container).store[RESOURCE_ENERGY]) {
                        container = undefined;
                    }
                }


                if (container == undefined) {
                    container = creep.room.storage;
                    // if everything is empty have a look at the rest of the containers (if there are any?!?)
                    if (container == undefined || container.store[RESOURCE_ENERGY] == 0) {
                        container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                                         s.store[RESOURCE_ENERGY] > 0
                        });
                    }
                }

                // if one was found
                if (container != undefined) {
                    // try to withdraw energy, if the container is not in range
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && !creep.fatigue) {
                        // move towards it
                        creep.moveTo(container);
                    }
                }
            }
        }
    }
};