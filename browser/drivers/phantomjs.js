steal('steal/browser', 'steal/browser/server.js', function(){
	var page;
	steal.browser.phantomjs = function(options){
		steal.browser.apply(this, arguments)
		DATA = "";
		this.type = 'phantomjs';
		this.options = options;
		this._startServer();
	}
	steal.browser.phantomjs.prototype = new steal.browser();
	steal.extend(steal.browser.phantomjs.prototype, {
		_startServer: function(){
			spawn(this.simpleServer)
		},
		open: function(page){
			var page = this._appendParamsToUrl(page);
			spawn(function(){
				runCommand("sh", "-c", "phantomjs steal/browser/drivers/phantomLauncher.js "+page)
			})
			this._poll();
			return this;
		},
		_poll: function(){
			var keepPolling = true;
			if(DATA.length){
				eval("var res = "+decodeURIComponent(unescape(DATA)))
				// parse data into res
				for (var i = 0; i < res.length; i++) {
					evt = res[i];
					if (evt.type == "done") {
						keepPolling = false;
						quit();
					}
					else {
						this.trigger(evt.type, evt.data);
					}
				}
			}
			DATA = "";
			// keep polling
			if (keepPolling) {
				java.lang.Thread.currentThread().sleep(200);
				arguments.callee.apply(this);
			}
		}
	})
})