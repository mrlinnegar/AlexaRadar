const TABLE_NAME = "Themes";

class Themes {
  constructor(db){
    this.db = db;
  }

  async all(){
    return this.db.load(TABLE_NAME);
  }
}

module.exports = Themes;
