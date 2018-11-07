const Spreadsheet = require("./lib/Spreadsheet");
const Blips = require("./lib/Blips");
const Themes = require("./lib/Themes");
const Responses = require("./lib/Responses");

const load = async ()=>{

  let db = new Spreadsheet();
  let blips = new Responses(db);

  try {
    let  blipData = await blips.all();
    console.log(blipData)
  } catch (e) {
    console.log(e);
  }
}
load();
