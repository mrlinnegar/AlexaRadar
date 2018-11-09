const expect = require("chai").expect;
const Blips = require("../lib/models/Blips");

describe("Blips", function() {
    let mockDB, blips;

    beforeEach(()=> {
      mockDB = {"load": ()=> { return "MOCK"} };
      blips = new Blips(mockDB);
    });

    describe("match", ()=> {

      it("should return true if the the properties of an object match", ()=> {
        let objectA = { "name": "James"};
        let objectB = { "name" : "James"};

        expect(blips.match(objectA, objectB)).to.be.true;
      });


      it("should return false if the the properties of an object don't match", ()=> {
        let objectA = { "name": "James"};
        let objectB = { "name" : "New"};

        expect(blips.match(objectA, objectB)).to.be.false;
      });

      it("should return false if one property doesn't match", ()=> {
        let objectA = { "name": "James", "cheese": "cheddar"};
        let objectB = { "name" : "New", "cheese": "brie"};
        expect(blips.match(objectA, objectB)).to.be.false;
      });

      it("should return true if all properties match", ()=> {
        let objectA = { "name": "James", "cheese": "cheddar"};
        let objectB = { "name" : "James", "cheese": "cheddar"};
        expect(blips.match(objectA, objectB)).to.be.true;
      });

      it("should be case insensitive", ()=> {
        let subject = { "name": "James"};
        let filter = { "name" : "james"};
        expect(blips.match(subject, filter)).to.be.false;
      });

      it("should return false if a subject property is undefined", ()=> {
        let subject = { "name": "James"};
        let filter = { "name" : "james", "cheese": "Cheddar"};
        expect(blips.match(subject, filter)).to.be.false;
      });


    });

    describe("all", ()=> {
      it("should call", async () => {
          let data = await blips.all();
          expect(data).to.equal("MOCK");
      });
    });

});
