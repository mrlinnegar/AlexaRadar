const TABLE_NAME = "Blips";

class Blips {
  constructor(db){
    this.db = db;
  }

  async find(search){
    let data = await this.all();

    let filteredData = data.filter((row)=> {
      return (row.quadrant === search.quadrant &&
              row.ring === search.ring);
    });

    return filteredData;
  }

  async all(){
    return this.db.load(TABLE_NAME);
  }
}

module.exports = Blips;
