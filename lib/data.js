'use strict';

const GoogleSpreadsheet = require('google-spreadsheet');
const token = process.env.SHEET_TOKEN;

const extractTheme = require("./extractors").theme;
const extractResponse = require("./extractors").response;
const extractBlip = require("./extractors").blip;


function rowsToBlips(rows){
  let blips = [];
  rows.forEach((row)=> {
    blips.push(extractBlip(row));
  });
  return blips;
}

function rowsToThemes(rows){
  let themes = [];
  rows.forEach((row)=> {
    themes.push(extractTheme(row));
  });
  return themes;
}

function rowsToResponses(rows) {
  let responses = {};
  rows.forEach((row)=> {
    let response = extractResponse(row);
    responses[response.intent] = { 'message' : response.message, 'reprompt': response.reprompt};
  });
  return responses;
}

function loadInfo(){
  const spreadsheet = new GoogleSpreadsheet(token); // Sheet ID (visible in URL)

  return new Promise((resolve, reject)=> {
      spreadsheet.getInfo((sheetError, info) => {
        if(sheetError){
          reject(sheetError)
        }
        resolve(info);
      });
  });
}

function loadRows(info, sheetTitle){
  const sheet = info.worksheets.filter(sheet => { return sheet.title === sheetTitle });
  if(!sheet[0]) {
    throw new Error("No data source");
  }
  const rowOptions = {
    limit  : 100000,
    offset : 0
  }

  return new Promise((resolve, reject) => {
    sheet[0].getRows(rowOptions, (rowsError, rows) => {
      if (rowsError) {
        reject(rowsError);
      }
      resolve(rows);
    });
  });
}

const loadBlips = async function() {
  const data = await loadInfo()
                      .then((info)=> { return loadRows(info, "Blips")})
                      .then(rowsToBlips);
  return data;

}

const loadThemes = async function() {
  const data = await loadInfo()
                      .then((info)=> { return loadRows(info, "Themes")})
                      .then(rowsToThemes);
  return data;
}


const loadResponses = async () => {
  const data = await loadInfo()
                      .then((info)=> { return loadRows(info, "Responses")})
                      .then(rowsToResponses);
  return data;
}


module.exports.loadBlips = loadBlips;
module.exports.loadThemes = loadThemes;
module.exports.loadResponses = loadResponses;
