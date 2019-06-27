module.exports = class Item {
  constructor(item) {
    if (item) {
      if (item.Title) {
        this.Title = item.Title;
      }
      if (item.Description) {
        this.Description = item.Description;
      }
      if (item.ImageLink) {
        this.ImageLink = item.ImageLink;
      }
    }
  }

  set Title(value) {
    this.title = value;
  }
  get Title() {
    return this.title;
  }

  set Description(value) {
    this.description = value;
  }
  get Description() {
    return this.description;
  }

  set ImageLink(value) {
    this.logo_30x30 = value;
  }
  get ImageLink() {
    return this.logo_30x30;
  }
}