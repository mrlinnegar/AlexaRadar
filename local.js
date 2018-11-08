const Spreadsheet = require("./lib/Spreadsheet");
const Blips = require("./lib/models/Blips");
const Themes = require("./lib/models/Themes");
const Responses = require("./lib/models/Responses");

const load = async ()=>{

  let db = new Spreadsheet();
  let blips = new Blips(db);

  try {
    const quadrant = "tools";
    const ring = "assess";
    const search = { quadrant, ring };
    let  blipData = await blips.find(search);
    console.log(blipData)
  } catch (e) {
    console.log(e);
  }
}
load();
