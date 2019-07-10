module.exports = class PlayList {
	constructor(playList) {
		this.all_local = "directly";

		this.Items = [];

		this.IsIptv = false;

		if (playList) {
			if (playList.items) {
				playList.items.forEach(function (element) {
					this.Items.push(element);
				});
			}

			if (item.Menu) {
			  item.Menu.forEach(function (element) {
				this.Menu.push(element);
			  });
			}

			this.Source = playList.Source;
			this.NextPageUrl = playList.NextPageUrl;
			this.IsIptv = playList.IsIptv;
			this.PlaylistName = playList.PlaylistName;
			this.Title = playList.Title;
			this.Navigate = playList.Navigate;
			this.Icon = playList.Icon;
			this.Url = playList.Url;
			this.Timeout = playList.Timeout;
			this.Notify = playList.Notify;
			this.Info = playList.Info;
			this.Style = playList.Style;
			this.Color = playList.Color;
			this.Command = playList.Command;
		}
	}

	sendResponse(res, headers) {
		if (!headers) {
			headers = {};
		}

		headers["Content-Type"] = "text/json; charset=utf-8";

		const json = JSON.stringify(this);

		res.writeHead(200, headers);
		res.end(json);
	}

	set Source(value) {
		this.Source = value;
	}
	get Source() {
		return this.Source;
	}

	set Items(value) {
		this.channels = value;
	}
	get Items() {
		return this.channels;
	}

	set NextPageUrl(value) {
		this.next_page_url = value;
	}
	get NextPageUrl() {
		return this.next_page_url;
	}

	set IsIptv(value) {
		this.is_iptv = value;
	}
	get IsIptv() {
		return this.is_iptv;
	}

	set PlaylistName(value) {
		this.playlist_name = value;
	}
	get PlaylistName() {
		return this.playlist_name;
	}

	set Description(value) {
		this.all_description = value;
	}
	get Description() {
		return this.all_description;
	}

	set Title(value) {
		this.title = value;
	}
	get Title() {
		return this.title;
	}

	set Navigate(value) {
		this.navigate = value;
	}
	get Navigate() {
		return this.navigate;
	}

	set Icon(value) {
		this.icon = value;
	}
	get Icon() {
		return this.icon;
	}

	set Url(value) {
		this.url = value;
	}
	get Url() {
		return this.url;
	}

	set Timeout(value) {
		this.timeout = value;
	}
	get Timeout() {
		return this.timeout;
	}

	set Notify(value) {
		this.notify = value;
	}
	get Notify() {
		return this.notify;
	}

	set Info(value) {
		this.info = value;
	}
	get Info() {
		return this.info;
	}

	set Menu(value) {
		this.menu = value;
	}
	get Menu() {
		return this.menu;
	}

	set Style(value) {
		this.style = value;
	}
	get Style() {
		return this.style;
	}

	set Color(value) {
		this.color = value;
	}
	get Color() {
		return this.color;
	}

	set Command(value) {
		this.cmd = value;
	}
	get Command() {
		return this.cmd;
	}
}
