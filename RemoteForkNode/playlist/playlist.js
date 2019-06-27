module.exports = class PlayList {
	constructor(items) {
		this.Items = [];
		this.IsIptv = false;

		if (items) {
            const channels = this.Items;

			items.forEach(function(element) {
				channels.push(element);
			});
		}
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
}
