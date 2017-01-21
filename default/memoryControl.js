var memCtrl = {
// TODO
    //** create a function that writes all possible roles in the rooms memory
    //** create a function that writes all Towers into the Room Memory
    //** to send creeps from room to room write the target room into the memory (see builder)


    checkAllRoomsMemory: function () {
        for (let name in Game.rooms) {
            var room = Game.rooms[name];
            memCtrl.checkRoomMemory(room);
        }
    },

    checkRoomMemory: function (room) {
        if (room.memory.scanned == undefined || !room.memory.scanned) {
            // get room sources and save their IDs in the room-Memory
            var sources = room.find(FIND_SOURCES);
            var roomsources = [];
            for (var i in sources) {
            // set mining to true if the source shall be mined by a miner
                roomsources[i] = { sourceID: sources[i].id, mining: true, minerID: null, container: undefined };
            }
            // Initialize room-Memory
            room.memory.sources = roomsources;
            // wallConfigs will be used to build walls in defined steps
            room.memory.wallConfigs = { wallHits: 1000, wallMaxMultiplier: 10, wallMultiplier: 1 };
            // default minCreeps settings
            room.memory.minCreeps = { harvester: 1, builder: 0, miner: 0, upgrader: 0, wallBuilder: 0, lorry: 0, longDistanceHarvesters: {} };
            // Initialize the target containers
            room.memory.containerForEnergy = [];
            room.memory.scanned = true;
        }
    },

    checkRoomForContainerToDeliverEnergyTo: function (roomName) {
        let room = Game.rooms[roomName];
        if (room.memory.containerForEnergy == undefined) {
            room.memory.containerForEnergy = [];
        }
        let writeToMemory = [];
        let containers = room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
                      && s.id != room.memory.sources[0].container
                      && s.id != room.memory.sources[1].container
        });
        if (containers != null) {
            for (let container in containers) {
                writeToMemory.push(containers[container].id);
            }
            room.memory.containerForEnergy = writeToMemory;
        }
    },

    checkRoomSourcesForContainer: function (roomName) {
        let room = Game.rooms[roomName];
        let sources = room.memory.sources;
        for (let source in sources){
            let container = Game.getObjectById(room.memory.sources[source].sourceID).pos.findInRange(FIND_STRUCTURES, 1, {
                filter: s => s.structureType == STRUCTURE_CONTAINER
            })[0];
            if (container != undefined) {
                room.memory.sources[source].container = container.id;
            }
            else {
                room.memory.sources[source].container = undefined;
            }
        }
    },

    resetRoomMemory: function (room){
        room.memory.scanned = false;
        memCtrl.checkRoomMemory(room);
    },

    resetAllRoomsMemory: function () {
        for (let name in Game.rooms) {
            var room = Game.rooms[name];
            memCtrl.resetRoomMemory(room);
        }
    },

    cleanCreepMemory: function () {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },

    sendThisCreepToAnotherRoom: function (creepName, roomName) {
        Game.creeps[creepName].memory.target = roomName;
    },

    activateThisSpawnToClaimThisRoom: function (spawnName, roomName) {
        Game.spawns[spawnName].memory.claimRoom = roomName;
    },

    setThisRoomsMinCreepsValues: function (roomName, Roles) {
        Game.rooms[roomName].memory.minCreeps = Roles;
    },

    setThisRoomsWallConstructionBehaviour: function (roomName, wallHitsAmount, maxMultiplier, actualMultiplier) {
        Game.rooms[roomName].memory.wallConfigs = { wallHits: wallHitsAmount, wallMaxMultiplier: maxMultiplier, wallMultiplier: actualMultiplier };
    },

    incrementRoomsWallMultiplier: function (roomName) {
        Game.rooms[roomName].memory.wallConfigs.wallMultiplier = ++Game.rooms[roomName].memory.wallConfigs.wallMultiplier;
    }

}

module.exports = memCtrl;