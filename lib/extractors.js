module.exports.theme = function(row){
  let theme = {};

  theme.title = row.title;
  theme.lead = row.lead;

  return theme;
}


module.exports.response = function(row){
  let response = {};

  response.intent = row.intent;
  response.message = row.message;
  response.reprompt = row.reprompt;

  return response;
}

module.exports.blip = function(row){
    let blip = {};

    blip.quadrant = row.quadrant;
    blip.title = row.title;
    blip.lead = row.lead;
    blip.description = row.description;
    blip.ring = row.ring;
    blip.new = (row.new === "TRUE");

    return blip;
}
