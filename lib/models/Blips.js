const TABLE_NAME = "Blips";

class Blips {
  constructor(db){
    this.db = db;
  }

  match(subject, filter){
    let itMatches = true;
    try {

      Object.keys(filter).forEach((key)=>{
        if(subject[key] === undefined){
          itMatches = false;
          return;
        }
        if(subject[key].toLowerCase() !== filter[key].toLowerCase()){
          itMatches = false;
          return;
        }
      });

      return itMatches;

    } catch(e){
      return false;
    }
  }


  async find(search){
    console.log(`Searching for ${JSON.stringify(search)}`);
    let data = await this.all();

    let filteredData = data.filter((row)=> {
      return this.match(row, search);
    });

    return filteredData;
  }

  async all(){
    return this.db.load(TABLE_NAME);
  }
}

module.exports = Blips;
