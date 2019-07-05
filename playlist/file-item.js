const IItem = require("./item");

module.exports = class FileItem extends IItem {
  constructor(item) {
    super(item);
    
    if (item) {
      this.Link = item.Link;
    }
  }

  set Link(value) {
    this.stream_url = value;
  }
  get Link() {
    return this.stream_url;
  }
}