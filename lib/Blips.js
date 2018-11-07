const TABLE_NAME = "Blips";

class Blips {
  constructor(db){
    this.db = db;
  }

  async all(){
    return this.db.load(TABLE_NAME);
  }
}

module.exports = Blips;
