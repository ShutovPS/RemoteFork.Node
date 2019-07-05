const PlayList = require("./playlist");

module.exports = class RootPlayList extends PlayList {
  constructor(playList) {
      super(playList);

      this.typeList = "start";
  }
}