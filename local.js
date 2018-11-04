const dataSource = require("./lib/data");

const load = async ()=>{
  try {
    const blipData = await dataSource.loadResponses();
    console.log(blipData);

  } catch (e){
    console.warn(e);
  }
}

load();
