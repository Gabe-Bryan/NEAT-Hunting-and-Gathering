let socket = null;
let downloader = 0;
if (window.io) {
	socket = io.connect('http://73.225.31.4:8888');
	console.log("Database connected!");
}

socket.on("find", (data) => {
    console.log("processing query...");
    if(data.length == 0) {
        console.warn("Warning: data collection queried is empty");
        console.warn(data);
        return;//Prevent errors
    }
    if(data[data.length - 1].has_genomes){
        console.log("yesssss!");
        gameEngine.population.loadFromGenomeList(data[data.length - 1]);
    }else{
        if(data.length > 0) parseData(data);
        else console.log("Empty Data...");
    }
    console.log("finished query.");
});

const downloadData = (e) => {
    //Get relevant variables
    db = document.getElementById("db").value;
    db_collection = document.getElementById("db_collection").value;

    console.log(`db: ${db}\ncollection: ${db_collection}`);
    socket.emit("find", 
    {
        db: db, 
        collection: db_collection
    });
    console.log("Download successfully");
}

const downloadGenomes = () => {
    console.log(`db: ${params.GENOME_DB}\ncollection: ${params.GENOME_DB_COLLECTION}`);
    socket.emit("find", 
    {
        db: params.GENOME_DB, 
        collection: params.GENOME_DB_COLLECTION
    });
    console.log("downloaded genomes");
}

const saveGenomes = () => {
    let genomes = gameEngine.population.agentsAsList().map(x => x.genome);
    let saveInfo = {
        has_genomes: true,
        generation: PopulationManager.GEN_NUM,
        date: Date()
    };
    console.log(genomes);
    logData(genomes, params.GENOME_DB, params.GENOME_DB_COLLECTION, saveInfo);
}

const parseData = (data) => {
    // agentTrackerAttributesToCollect.forEach(attr =>{
    //     download(attr + '_' + db + "_" + db_collection + ".csv", serializeData(data, attr, true));
    // });

    //Only download these for conveniency
    download("totalCaloriesConsumedAsPrey_" + db + "_" + db_collection + ".csv", serializeData(data, "totalCaloriesConsumedAsPrey", true));
    download("totalFoodConsumptionCount_" + db + "-" + db_collection + ".csv", serializeData(data, "totalFoodConsumptionCount", true));
    download("totalPreyHuntedCount_" + db + "-" + db_collection + ".csv", serializeData(data, "totalPreyHuntedCount", true));
    download("totalTicksOutOfBounds_" + db + "-" + db_collection + ".csv", serializeData(data, "totalTicksOutOfBounds", true));
    

    // download("AvgRawFitness-" + db + "-" + db_collection + ".csv", serializeData(data, "avgFitness", true));
    // download("Consumption-" + db + "-" + db_collection + ".csv", serializeData(data, "consumption", true));
    // download("PercDead-" + db + "-" + db_collection + ".csv", serializeData(data, "avgPercDead", true));
    // download("PredWinnerBonus-" + db + "-" + db_collection + ".csv", serializeData(data, "avgPredWinnerBonus", true));
    // download("EnergySpent-" + db + "-" + db_collection + ".csv", serializeData(data, "avgEnergySpent", true));
}

const download = (filename, text) => {
    if(!text) {console.log(text); return;}
    
    let pom = document.createElement('a');
    downloader++;
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
    pom.remove();
    pom = null;
    console.log("Downloading: " + filename);
}

const serializeData = (data, key, avgColumn = false) => {
    if(!data[0][key]) return undefined;
    let str = "";
    let j = 0;
    let foundRow = true;
    do{
        if(j == 0){
            for(let i = 0; i < data.length; i++){
                str += "Trial " + (i+1);
                if(i+1 < data.length) str += ",";
            }
            if(avgColumn) str+= ",Average";
            str += "\n";
            j++;
        }else{
            foundRow = false;
            ds = "";
            let total = 0;
            for(let i = 0; i < data.length; i++) {
                if(j < data[i][key].length){
                    let v = data[i][key][j];
                    ds += v;
                    total += v;
                    foundRow = true;
                }else{
                    //console.log(data[i][key].length);
                }
                if(i < data.length - 1){
                    ds += ",";
                }
            }
            if(foundRow) {
                str += ds;
                if(avgColumn) str += "," + total/data.length;
                str += "\n";
            }
            j++;
        }
    }while(foundRow);
    return str;
}

