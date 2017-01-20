var cmdCenter = require('CommandCenter');
var memCtrl = require('memoryControl');

module.exports.loop = function () {

    // check if Memory.creeps has unused entries and delete them if found
    cmdCenter.cleanCreepsMemory();
    // Initializes the Memory.room -> should be changed to not do it every tick to maybe when a room is claimed or so
    memCtrl.checkAllRoomsMemory();
    // check if any Room needs defensive measures
    cmdCenter.doNecessaryDefensiveActions();
    // config the settings defining the wall-building
    cmdCenter.timeToConfigTheWallSettings();
    // are there any containers near the sources?
    cmdCenter.checkForMiningContainers();
    // are there any containers that should be supplied with energy?
    cmdCenter.checkForEnergyReceivingContainers();
    // work work
    cmdCenter.letCreepsDoTheirJob();
    // shall we claim something?
    cmdCenter.anyClaimWishes();
    // set or change a rooms min creeps. This affects the possible spawning of new creeps
    cmdCenter.shouldWeSetARoomsMinCreeps();
    // MORE work work
    cmdCenter.activateSpawnsIfNecessary();
    // let Rooms help each other
    cmdCenter.shouldAnyCreepGoToAnyOtherRoom();
    // let Towers help to repair if active
    cmdCenter.shallTowersHelpToRepair();

}