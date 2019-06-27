const DirectoryItem = require("./directory-item");

module.exports = class SearchItem extends DirectoryItem {
  constructor(item) {
    super(item);
    
    this.search_on = "search_on";
  }
}