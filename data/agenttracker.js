/**
 * A class for tracking agent data for each generation
 */
class AgentTracker {
    constructor() {
        this.currentGeneration = -1;
        this.generations = [];
        this.avgFitness = [];
        this.addNewGeneration();
    }

    /**
     * Setup for new generation
     */
    addNewGeneration() {
        this.currentGeneration++;
        this.generations[this.currentGeneration] = {
            oldest: 0,
            ages: [],
            maxEnergy: 0,
            minEnergy: Number.MAX_VALUE,
            energy: [],
            avgEnergySpent: 0,
            speciesFitness: [],
            avgFitness: 0,
            avgPercDead: 0,
            avgPredWinnerBonus: 0,
            totalPreyHuntedCount: 0,
            totalTicksOutOfBounds: 0,
            totalTicksOutOfBounds_Prey: 0,
            totalTicksOutOfBounds_Predator: 0,
            totalCaloriesConsumedAsPrey: 0,
            totalFoodConsumptionCount: 0,
            speciesFoodConsumptionCount: [],
            speciesSuccessfulHuntCount: [],
            speciesTotalTickOutOfBound: [],
        };
    }

    /**
     * Private method
     * @param {object} agent agent object
     */
    addAge(agent) {
        this.generations[this.currentGeneration].oldest = Math.max(
            agent.age,
            this.generations[this.currentGeneration].oldest
        );
        this.generations[this.currentGeneration].ages.push(agent.age);
    }

    /**
     * Private method
     * @param {object} agent agent object
     */
    addEnergy(agent) {
        this.generations[this.currentGeneration].maxEnergy = Math.max(
            agent.energy,
            this.generations[this.currentGeneration].maxEnergy
        );
        this.generations[this.currentGeneration].minEnergy = Math.min(
            agent.energy,
            this.generations[this.currentGeneration].minEnergy
        );
        this.generations[this.currentGeneration].energy;
    }

    /**
     *
     * @param {obj} data object containing species id and fitness {speciesId, fitness}
     */
    addSpeciesFitness(data) {
        this.generations[this.currentGeneration].speciesFitness.push(data);
    }

    addAvgFitness(data) {
        this.generations[this.currentGeneration].avgFitness = data;
    }

    addAvgPercDead(data){
        this.generations[this.currentGeneration].avgPercDead = data;
    }

    addAvgEnergySpent(data){
        this.generations[this.currentGeneration].avgEnergySpent = data;
    }

    addAvgPredWinnerBonus(data){
        this.generations[this.currentGeneration].avgPredWinnerBonus = data;
    }

    /**
     * A general helper method to push data to
     * @param {str} attribute name of the field or attribute we want to push data to
     * @param {obj} data object containing species id and the attribute (as the name of attribute) we want to push to {speciesId : int, "attribute": data}
     */
    addSpeciesAttribute(attribute, data) {
        this.generations[this.currentGeneration][attribute].push(data);
    }

    /**
     * A general helper method to replace existing data in a field
     * @param {str} attribute name of the field or attribute we want to replace the data with
     * @param {obj} data the data we want to replace
     */
    setAttribute(attribute, data) {
        this.generations[this.currentGeneration][attribute] = data;
    }

    /**
     * A general helper method to add data to
     * @param {str} attribute name of the field or attribute we want to add data to
     * @param {obj} data the data we want to add to existing data
     */
    addToAttribute(attribute, data) {
        this.generations[this.currentGeneration][attribute] += data;
    }

    /**
     * Public method
     * @param {object} agent agent object
     */
    processAgent(agent) {
        this.addEnergy(agent);
        this.addAge(agent);
    }

    getAgeData() {
        const maxAges = this.generations.map((obj) => obj.oldest);
        // for mean and median we do not use all agents
        // we use only the agents from previous generations and now new agents
        // this is because half of all agents ages will be 0, thus leading to boring data
        // by filtering out agents with age 0 we ignore all new agents
        const topHalfAges = this.generations.map((obj) =>
            obj.ages.filter((age) => age != 0)
        );
        const medianAges = topHalfAges.map((ages) => getMedian(ages));
        const meanAges = topHalfAges.map((ages) => getMean(ages));
        return {
            oldest: maxAges,
            medians: medianAges,
            means: meanAges,
        };
    }

    getEnergyData() {
        const minEnergies = this.generations.map((obj) => obj.minEnergy);
        const maxEnergies = this.generations.map((obj) => obj.maxEnergy);
        const medianEnergies = this.generations.map((obj) =>
            getMedian(obj.energy)
        );
        return {
            mins: minEnergies,
            maxes: maxEnergies,
            medians: medianEnergies,
        };
    }

    getFitnessData() {
        return this.generations.map((obj) => obj.speciesFitness);
    }

    getAvgFitnessData() {
        return this.generations.map((obj) => obj.avgFitness);
    }

    /**
     * A general helper method to get data from a field or attribute of the current generation
     * @param {str} attribute name of the field or attribute we want to get data
     * @return {obj} the data we want to get
     */
    getCurrentGenAttriBute(attribute){
        let res =  this.generations[this.currentGeneration][attribute];
        return res;
    }


    getAvgEnergySpentData(){
        return this.generations.map((obj) => obj.avgEnergySpent);
    }

    getAvgPredWinnerBonusData(){
        return this.generations.map((obj) => obj.avgPredWinnerBonus);
    }

    getAvgPercDeadData(){
        return this.generations.map((obj) => obj.avgPercDead);
    }
    /**
     * Retrieve information of a certain attribute as a list
     * @param {str} attribute name of the attribute to retrieve
     * @returns {obj} the information of the attribute stores in agent tracker
     */
    getAgentTrackerAttributesAsList(attribute) {
        let res =  this.generations.map((obj) => obj[attribute]);
        return res;
    }

   
}
