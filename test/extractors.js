const expect = require("chai").expect;
const themeExtractor = require("../lib/extractors").theme;
const blipExtractor = require("../lib/extractors").blip;
const responseExtractor = require("../lib/extractors").response;

describe("Extractors", function() {
  describe("Theme", function(){
    it("should return an object with the extracted title", function() {
      const mockRow = {
        "title":"James"
      };
      const result = themeExtractor(mockRow);
      expect(result.title).to.equal("James");
    });
    it("should extract the lead", ()=> {
      const mockRow = {
        "lead":"this is the lead"
      };
      const result = themeExtractor(mockRow);
      expect(result.lead).to.equal("this is the lead");
    });
    it("should strip any other parameter in the object", ()=> {
      const mockRow = {
        "attribute": "tostrip"
      };
      const result = themeExtractor(mockRow);
      expect(result.attribute).to.equal(undefined);
    });
  });

  describe("Blip", ()=> {
    it("should strip any other parameter in the object", ()=> {
      const mockRow = {
        "attribute": "tostrip"
      };
      const result = blipExtractor(mockRow);
      expect(result.attribute).to.equal(undefined);
    });
  });

  describe("Response", ()=> {
    it("should strip any other parameter in the object", ()=> {
      const mockRow = {
        "attribute": "tostrip"
      };
      const result = responseExtractor(mockRow);
      expect(result.attribute).to.equal(undefined);
    });
  });
});
