const TABLE_NAME = "Responses";

class Responses {
  constructor(db){
    this.db = db;
  }

  async all(){
    let rows = await this.db.load(TABLE_NAME);
    let responses = {};
    rows.forEach((response)=> {
      responses[response.intent] = { 'message' : response.message, 'reprompt': response.reprompt};
    });
    return responses;
  }
}

module.exports = Responses;
