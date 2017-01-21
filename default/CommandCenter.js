/*********************************************************************************************************************************************************/
/*********************************************************************************************************************************************************/
// Control-Variables
/*TODO
 *      Every creep has the following 2 memory-Entries:
 *      useContainer & useSource
 *      if one of them is false the creep will not use it to get energy from
 *  build a way to manage this entries
 */

    // clean the Memory.creeps every x Ticks
var cleanCreepIntervall = 1500;
    // if true Towers will repair
var letTowersRepair = false;

    // put in the Room-Name and the Spawn-Name. As soon as claimNow = true the Spawn will build claimer until claimNow = false
var claimThisRoom = undefined;
var fromThisSpawn = undefined;
var claimNow = false;

// if you want to send a creep to another room put here the name of the creep and the room and set sendCreep to true
var sendToRoomName = undefined;
var sendCreepName = undefined;
var sendCreep = false;

// set the minCreeps for the specified room (default setting for a newly scanned room is 1 harvester and 1 upgrader)
// for a longDistanceHarvester you need to save like this:: longDistanceHarvester: {targetRoomName: number, otherTargetRoomName: number... }
var roomToSetMinCreepsFor = 'W76S9';
var setThisMinCreeps = { harvester: 0, builder: 1, miner: 2, upgrader: 1, wallBuilder: 1, lorry: 1, longDistanceHarvesters: { } }
var setMinCreepsNow = false;

// configure the wallbuilding-behaviour of a room
var roomToConfigWallbuilding = 'W76S9';
var wallHits = 20000;
var maxWallMultiplier = 15;
var startingWallMultiplier = 1;
var configWallSettings = false;

// let the room check if there are any containers at the sources (used by miners & lorries)
var roomToCheckForContainers = 'W76S9';
var startTheMiningContainerCheck = false;

// let the room check if there are any containers that should be supplied with energy
var roomToCheckForEnergyReceivingContainers = 'W76S9';
var startTheReceivingContainersCheck = false;



/*********************************************************************************************************************************************************/
/*********************************************************************************************************************************************************/
// Requirements
require('prototype.creep');
require('prototype.spawn');
require('prototype.tower');
var memCtrl = require('memoryControl');

//Control-Functions
var cmdCenter = {

    checkForMiningContainers: function(){
        if(startTheMiningContainerCheck){
            memCtrl.checkRoomSourcesForContainer(roomToCheckForContainers);
        }
    },

    checkForEnergyReceivingContainers: function(){
        if (startTheReceivingContainersCheck) {
            memCtrl.checkRoomForContainerToDeliverEnergyTo(roomToCheckForEnergyReceivingContainers);
        }
    },

    timeToConfigTheWallSettings: function() {
        if (configWallSettings) {
            memCtrl.setThisRoomsWallConstructionBehaviour(roomToConfigWallbuilding, wallHits, maxWallMultiplier, startingWallMultiplier);
        }
    },

    shouldWeSetARoomsMinCreeps: function(){
        if(setMinCreepsNow){
            memCtrl.setThisRoomsMinCreepsValues(roomToSetMinCreepsFor, setThisMinCreeps);
        }
    },

    shouldAnyCreepGoToAnyOtherRoom: function(){
        if (sendCreep) {
            memCtrl.sendThisCreepToAnotherRoom(sendCreepName, sendToRoomName);
        }
    },

    anyClaimWishes: function(){
        if(claimNow){
            memCtrl.activateThisSpawnToClaimThisRoom(fromThisSpawn, claimThisRoom);
        }
    },

    cleanCreepsMemory: function () {
        if ((Game.time % cleanCreepIntervall)==0) {
            memCtrl.cleanCreepMemory();
        }
    },

    letCreepsDoTheirJob: function () {
        for (let name in Game.creeps) {
            // run creep logic
            Game.creeps[name].runRole();
        }
    },

    activateSpawnsIfNecessary: function() {
        // for each spawn
        for (let spawnName in Game.spawns) {
            // run spawn logic
            Game.spawns[spawnName].spawnCreepsIfNecessary();
        }
    },

// TODO
// save Towers in the Room-Memory so you don't have to iterate over all the towers all the time
    doNecessaryDefensiveActions: function() {
        // iterate through every owned room
        for (let name in Game.rooms) {
            let room = Game.rooms[name];
            let hostile = room.find(FIND_HOSTILE_CREEPS);
            // if there is a Hostile in the room
            if(hostile.length){
                // notify me
                Game.notify(`Enemy spotted in room ${name}`);
                // and use the towers in the room to defend
                var towers = room.find(FIND_MY_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_TOWER
                });
                for (let tower of towers) {
                    tower.defend();
                }
            }
        }
    },

    shallTowersHelpToRepair: function () {
        // if Towers should help to Repair
        if (letTowersRepair) {
            // get all Towers
            for (let name in Game.rooms) {
                var towers = Game.rooms[name].find(FIND_MY_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_TOWER
                });
                // and let them help to Repair
                for (let tower of towers) {
                    tower.helpRepairing();
                }
            }
        }
    }

};

module.exports = cmdCenter;