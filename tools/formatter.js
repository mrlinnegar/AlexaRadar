var fs = require("fs");
var content = fs.readFileSync("data.json");
var radar = JSON.parse(content);

var striptags = require('striptags');

function pick(obj, keys) {
    return keys.map(k => k in obj ? {[k]: obj[k]} : {})
               .reduce((res, o) => Object.assign(res, o), {});
}

const props = ['id', 'quadrant', 'ring', 'name', 'description', 'movement'];


radar.blips.forEach((blip)=> {
  let data = [];
  let pickedBlip = pick(blip, props);
  Object.keys(pickedBlip).forEach((k)=> {
    let string = striptags(pickedBlip[k]).split('"').join('\\"');
    data.push(`"${string}"`);
  })
  console.log(data.join(", "));
});
