const Spreadsheet = require("./lib/Spreadsheet");
const Blips = require("./lib/models/Blips");
const Themes = require("./lib/models/Themes");
const Responses = require("./lib/models/Responses");

const load = async ()=>{

  let db = new Spreadsheet();
  let blips = new Blips(db);

  try {
    const quadrant = "tools";
    const ring = "hold";

    const search = {
    "quadrant": "tools",
    "ring": "hold"
};
//    const search = { quadrant, ring };
    let  data = await blips.find(search);



    if(data.length === 0){
      speechText = `there are currently no ${quadrant} in ${ring}`;
    } else if(data.length === 1) {
      speechText = `${data[0].title} is in ${ring} <break time="1s"/> ${data[0].lead}`;
    } else {
      let responses = [`there are currently ${data.length} ${quadrant} in ${ring}. They are: `];

      data.forEach((blip)=> {
        console.log(blip);
        responses.push(`${blip.title}, `);
      });
      responses.push(". What would you like to know more about?");

      speechText = responses.join(' ');

    }
    console.log(speechText);
  } catch (e) {
    console.log(e);
  }
}
load();
