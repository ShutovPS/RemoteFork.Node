const IItem = require("./item");

module.exports = class DirectoryItem extends IItem {
  constructor(item) {
    super(item);
    if (item) {
      if (item.Link) {
        this.Link = item.Link;
      }
    }
  }

  set Link(value) {
    this.playlist_url = value;
  }
  get Link() {
    return this.playlist_url;
  }
}
