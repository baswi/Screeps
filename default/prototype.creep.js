var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    wallBuilder: require('role.wallBuilder'),
    miner: require('role.miner'),
    longDistanceHarvester: require('role.longDistanceHarvester'),
    lorry: require('role.lorry'),
    claimer: require('role.claimer'),
    dismantler: require('role.dismantler'),
    meleeFighter: require('role.meleeFighter')
};

Creep.prototype.runRole =
    function () {
        roles[this.memory.role].run(this);
    };

/** @function */
Creep.prototype.getEnergy =
    function () {
        // make sure the needed memory is set up
        if (this.memory.useContainer == undefined) {
            this.memory.useContainer = true;
        }
        if (this.memory.useSource == undefined) {
            this.memory.useSource = true;
        }
        /** @type {StructureContainer} */
        let container;
        // is there dropped energy around the creep?
        var dropenergy = this.pos.findInRange(FIND_DROPPED_ENERGY, 2, {
            filter: (e) => e.amount > 10
        });
        // if there is some dropped energy
        if (dropenergy.length) {
            // go and get it
            if (this.pickup(dropenergy[0]) == ERR_NOT_IN_RANGE && !this.fatigue) {
                this.moveTo(dropenergy[0]);
            }
        }
        // if the Creep should look for containers
        else if (this.memory.useContainer) {
            // find closest container
            container = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                             s.store[RESOURCE_ENERGY] > 0
            });
            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE && !this.fatigue) {
                    // move towards it
                    this.moveTo(container);
                }
            }
        }
        // if no container was found and the Creep should look for Sources
        if (container == undefined && this.memory.useSource) {
            // find closest source
            var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

            // try to harvest energy, if the source is not in range
            if (this.harvest(source) == ERR_NOT_IN_RANGE && !this.fatigue) {
                // move towards it
                this.moveTo(source);
            }
        }
    };