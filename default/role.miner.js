var roleMiner = {
    
        /** @param {Creep} creep **/
    run: function (creep) {
        
// if the miner has no specified source it will check for a free source        
        if (creep.memory.source == undefined){
console.log(creep.id);
            if (creep.id != undefined){
                for (let i in creep.room.memory.sources){
                    if(((Game.getObjectById(creep.room.memory.sources[i].minerID)) == null) ||
                        (Game.getObjectById(creep.room.memory.sources[i].minerID) == creep)){
console.log('new Miner for Source '+i+' with ID: '+creep.id);
                            creep.room.memory.sources[i].minerID = creep.id;
console.log('now saved in memory: '+creep.room.memory.sources[i].minerID);                           
                            creep.memory.source = creep.room.memory.sources[i].sourceID;
                            break;
                    }
                }
            }
// check if the miner actually found a source
            if (creep.memory.source == undefined){
                console.log(creep.name+': no free mines left in room: '+creep.room.name);
            }
        }
        
        
        var source = Game.getObjectById(creep.memory.source);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }  
    }
}

module.exports = roleMiner;