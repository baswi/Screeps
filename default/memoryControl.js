var memCtrl = {
    
    checkAllRooms: function () {
        for (let name in Game.rooms) {
            var room = Game.rooms[name];
            memCtrl.checkRoom(room);
        }
    },

    checkRoom: function (room) {
        if (room.memory.scanned == undefined) {
            room.memory.scanned = false;
        }
        if (!room.memory.scanned) {
            // get room sources and save their IDs in the room-Memory
            var sources = room.find(FIND_SOURCES);
            var roomsources = [];
            for (var i in sources) {
                roomsources[i] = { sourceID: sources[i].id, minerID: null };
            }
            // Initialize room-Memory
            room.memory.sources = roomsources;
            // roomMultiplier will be used to build walls in defined steps
            room.memory.wallMultiplier = 1;
            room.memory.scanned = true;
        }
    },

    recheckRoom: function (room){
        room.memory.scanned = false;
        memCtrl.checkRoom(room);
    },

    recheckAllRooms: function () {
        for (let name in Game.rooms) {
            var room = Game.rooms[name];
            memCtrl.recheckRoom(room);
        }
    },

    deleteDeadCreeps: function () {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }

}

module.exports = memCtrl;