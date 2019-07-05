module.exports = class Item {
  constructor(item) {
    if (item) {
      this.Title = item.Title;
      this.Description = item.Description;
      this.Image = item.Image;
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

  set Image(value) {
    this.logo_30x30 = value;
  }
  get Image() {
    return this.logo_30x30;
  }
  set ImageLink(value) {
    this.logo_30x30 = value;
  }
  get ImageLink() {
    return this.logo_30x30;
  }

	set Menu(value) {
		this.menu = value;
	}
	get Menu() {
		return this.menu;
	}

  set Yellow(value) {
    this.yellow = value;
  }
  get Yellow() {
    return this.yellow;
  }
}