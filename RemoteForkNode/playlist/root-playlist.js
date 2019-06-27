const PlayList = require("./playlist");

module.exports = class RootPlayList extends PlayList {
  constructor(items) {
      super(items);

      this.typeList = "start";
  }
}