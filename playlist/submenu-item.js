const IItem = require("./item");

module.exports = class SubmenuItem extends IItem {
  constructor(item) {
    super(item);

    this.Items = [];

    if (item) {
      if (item.Items) {
        item.Items.forEach(function (element) {
          this.Items.push(element);
        });
      }
      this.Items = item.Items;
    }

    this.playlist_url = "submenu";
  }

  set Items(value) {
    this.submenu = value;
  }
  get Items() {
    return this.submenu;
  }
}
