var stab = Number(0);
browser.runtime.onMessage.addListener(function(request) {
    if (request.type === 'open_new_window') {
		chrome.runtime.sendMessage({content: "request_winid"}, function(response2) {
			if (response2) {
				console.log('that fucker named '+response2.tabid);
				//chrome.tabs.remove(request.tabid);
				chrome.tabs.update(response2.tabid,{
					url: chrome.extension.getURL(request.content)
				});
				chrome.windows.update(response2.windowid, {
					focused: true
				});
			}
			else {
				var gettingInfo = browser.runtime.getPlatformInfo();
				gettingInfo.then(createWindow);
				function createWindow(info){
					console.log(info.os);
					if(info.os=='linux'){
						chrome.windows.create({
							url: chrome.extension.getURL(request.content),
							type: 'normal',
							height: 550,
							width:550,
							top: 800,
							left: 800
						});
					} else {
						browser.windows.create({
							url: chrome.extension.getURL(request.content),
							type: 'popup',
							height: 550,
							width:550,
							top: 0,
							left: 0
						});
					}
				}
			}
		});
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'close_this_window') {
        console.log('okay sure close '+sender.tab.id);
		chrome.tabs.remove(sender.tab.id);
	}
});