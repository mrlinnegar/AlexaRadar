'use strict';

const GoogleSpreadsheet = require('google-spreadsheet');
const token = process.env.SHEET_TOKEN;

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
  const filteredSheets = info.worksheets.filter(sheet => { return sheet.title === sheetTitle });
  if(filteredSheets.length < 1) {
    throw new Error("No data source");
  }
  const sheet = filteredSheets[0];

  const rowOptions = {
    limit  : 1000,
    offset : 0
  }

  return new Promise((resolve, reject) => {
    sheet.getRows(rowOptions, (rowsError, rows) => {
      if (rowsError) {
        reject(rowsError);
      }
      resolve(rows);
    });
  });
}

function reject(obj, keys) {
    return Object.keys(obj)
        .filter(k => !keys.includes(k))
        .map(k => Object.assign({}, {[k]: obj[k]}))
        .reduce((res, o) => Object.assign(res, o), {});
}



class Spreadsheet {
    constructor(sheet_token){
      this.sheet_token = sheet_token;
    }

    filterProperties(rows){
        const properties = ["_xml", "_links", "save", "del"];
        let data = [];
        rows.map((row)=> {
          data.push(reject(row, properties));
        });
        return data;
    }

    async load(dataType) {
      const data = await loadInfo()
                          .then((info)=> { return loadRows(info, dataType)})
                          .then((rows)=> {
                            return this.filterProperties(rows);
                          });
      return data;
    }
}

module.exports = Spreadsheet;
