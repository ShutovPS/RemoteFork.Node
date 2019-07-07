const DirectoryItem = require("./directory-item");

module.exports = class SearchItem extends DirectoryItem {
  constructor(item) {
    super(item);
    
    this.playlist_url = "payd_password";
    this.type = "password";
  }

  set Description(value) {
    this.search_on = value;
    super.Description = value;
  }
}