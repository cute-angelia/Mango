const component = () => {
	return {
		progress: 1.0,
		generating: false,
		scanning: false,
		scanDeduped: 0,
		scanTitles: 0,
		scanMs: -1,
		themeSetting: '',

		init() {
			this.getProgress();
			setInterval(() => {
				this.getProgress();
				this.getScanStatus();
			}, 5000);
			this.getScanStatus();

			const setting = loadThemeSetting();
			this.themeSetting = setting.charAt(0).toUpperCase() + setting.slice(1);
		},
		themeChanged(event) {
			const newSetting = $(event.currentTarget).val().toLowerCase();
			saveThemeSetting(newSetting);
			setTheme();
		},
		scan() {
			if (this.scanning) return;
			this.scanning = true;
			this.scanMs = -1;
			this.scanDeduped = 0;
			this.scanTitles = 0;
			$.post(`${base_url}api/admin/scan`)
				.then(data => {
					this.scanning = data.scanning;
					this.scanDeduped = data.deduped;
					this.scanMs = data.milliseconds;
					this.scanTitles = data.titles;
					this.getScanStatus();
				})
				.catch(e => {
					alert('danger', `Failed to trigger a scan. Error: ${e}`);
				})
				.always(() => {
					this.getScanStatus();
				});
		},
		getScanStatus() {
			$.get(`${base_url}api/admin/scan_status`)
				.then(data => {
					this.scanning = data.scanning;
					this.scanDeduped = data.deduped;
					this.scanMs = data.milliseconds;
					this.scanTitles = data.titles;
				});
		},
		generateThumbnails() {
			if (this.generating) return;
			this.generating = true;
			this.progress = 0.0;
			$.post(`${base_url}api/admin/generate_thumbnails`)
				.then(() => {
					this.getProgress()
				});
		},
		getProgress() {
			$.get(`${base_url}api/admin/thumbnail_progress`)
				.then(data => {
					this.progress = data.progress;
					this.generating = data.progress > 0;
				});
		},
	};
};
