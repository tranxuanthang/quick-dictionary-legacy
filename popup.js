window.addEventListener('blur', function() {
    //chrome.runtime.sendMessage({type:'close_this_window'});
});
chrome.tabs.query(
	{currentWindow: true, active : true},
	function(tabArray){
		console.log(tabArray[0].windowId);
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				if (request.content == "request_winid")
				sendResponse({windowid: tabArray[0].windowId, tabid: tabArray[0].id});
			}
		);
	}
);
function externalLinks() {
  for(var c = document.getElementsByTagName("a"), a = 0;a < c.length;a++) {
    var b = c[a];
    b.getAttribute("href") && b.hostname !== location.hostname && (b.target = "_blank")
  }
}

function topFunction() {
    document.getElementById('main-content').scrollTop = 0;
}
console.log('popup.js is running');

function googletrans(query,lang){
	var url = 'https://translation.googleapis.com/language/translate/v2/?key=AIzaSyBtxmF6evva1IdtSqxsJ-1OSZKCGDGs0bg&source=&target='+lang+'&model=nmt&q='+query.trim();
	console.log(url);
	var xhReq = new XMLHttpRequest();
	xhReq.onreadystatechange = function() {
		if (xhReq.readyState == XMLHttpRequest.DONE) {
			var arr = JSON.parse(xhReq.responseText);
			var ggtranstext = arr.data.translations[0].translatedText;
			document.getElementById("result").textContent = '';
			var creatediv = document.createElement("div");
			var textinside = document.createTextNode(unescape(ggtranstext));
			creatediv.setAttribute("id", 'googletrans'); 
			creatediv.appendChild(textinside);
			document.getElementById("result").appendChild(creatediv);
		}
	}
	xhReq.open("GET", url, true);
	xhReq.send(null);
}

function core(selection,result) {
	console.log(JSON.stringify(result));
	setTimeout(function() { document.getElementById('searchInput').focus(); }, 150);
	/* Get ?text= content from current URL */
	var url_string = window.location.href;
	var urlcurrent = new URL(url_string);
	var word = urlcurrent.searchParams.get("text");
	var gettext = encodeURIComponent(word);
	var gettext = gettext.replace(/_/g, ' ');
	var lang = urlcurrent.searchParams.get("lang") || '';
	primlang = result.primlang || 'vi';
	secolang = result.secolang || '';
	if(lang.length!=2)lang= primlang;
	
	wiktionarylang = document.getElementById('wiktionarylang');
	wiktionarylang.textContent = '';
	var primlink = document.createElement('a');
	primlink.setAttribute("target", '_self');
	var textnode = document.createTextNode(primlang);
	primlink.appendChild(textnode);
	primlink.href = '?text='+gettext+'&lang='+primlang;
	wiktionarylang.appendChild(primlink);
	if(lang==primlang)primlink.setAttribute("style", 'font-weight: bold;');
	
	if(secolang != ''){
		var textnode = document.createTextNode(' | ');
		wiktionarylang.appendChild(textnode);
		var secolink = document.createElement('a');
		secolink.setAttribute("target", '_self');
		var textnode = document.createTextNode(secolang);
		secolink.appendChild(textnode);
		secolink.href = '?text='+gettext+'&lang='+secolang;
		wiktionarylang.appendChild(secolink);
		if(lang==secolang)secolink.setAttribute("style", 'font-weight: bold;');
	}
	document.getElementById("lang").setAttribute("value", lang);
	
	if (gettext == 'null' || gettext === ''){
		query = selection;
	} else {
		query = gettext;
	}
	
	
	var thisisname = query;
	
	if(urlcurrent.searchParams.get('nolower')==1){
		thisisnamewithouturlencode = decodeURIComponent(thisisname).trim();
		thisisname = encodeURIComponent(decodeURIComponent(thisisname).trim());
		document.getElementById("nolower").setAttribute("value", '1'); 
	} else {
		thisisnamewithouturlencode = decodeURIComponent(thisisname).toLowerCase().trim();
		thisisname = encodeURIComponent(decodeURIComponent(thisisname).toLowerCase().trim());
	}
	
	
	/* If the selected text is too looooong... */
	if (thisisname!= "" && thisisname != "null") {
		var qlength = 1500;
		if (thisisname.length > qlength) {
			var showname = thisisnamewithouturlencode.substring(0, qlength)+"...";
		} else {
			var showname = thisisnamewithouturlencode;
		}
		
		
		document.getElementById("searchInput").setAttribute("value", showname); 
		
		document.getElementById("result").textContent = chrome.i18n.getMessage("popup_getting_result");
		
		
		if (thisisname.length > 1500) {
			document.getElementById("result").textContent = chrome.i18n.getMessage("popup_error_text_too_long");
		} else if (thisisname.length > 48) {
			googletrans(thisisname,lang);
		} else {
			var url = 'https://'+lang+'.wiktionary.org/w/api.php?action=parse&format=json&contentmodel=wikitext&redirects=true&prop=text&page='+thisisname;
			console.log(url);
			var xhReq = new XMLHttpRequest();
			xhReq.onreadystatechange = function() {
				if (xhReq.readyState == XMLHttpRequest.DONE) {
					var arr = JSON.parse(xhReq.responseText);
					var error = arr.error;
					
					
					if (typeof error != 'undefined'){
						document.getElementById("result").textContent = chrome.i18n.getMessage("popup_wiktionary_not_found");
						googletrans(thisisname,lang);
					} else {
						var html = arr.parse.text["*"];
						var replace = "\"//"+lang+".wiktionary.org";
						var re = new RegExp(replace,"g");
						html = html.replace(re , "\"https://"+lang+".wiktionary.org");
						html = html.replace(/\"\/\/upload.wikimedia.org/g , "\"https://upload.wikimedia.org");
						html = html.replace(/\"\/\/commons.wikimedia.org/g , "\"https://commons.wikimedia.org");
						html = html.replace(/\"\/static\//g , "\"https://"+lang+".wiktionary.org/static/");
						html = html.replace(/\"\/wiki\/(.*?)\"/g , "\""+location.pathname+"?nolower=1&lang="+lang+"&text=$1\"");
						html = html.replace(/\"\/wiki\//g , "\"https://"+lang+".wiktionary.org/wiki/");
						html = html.replace(/\"\/w\//g , "\"https://"+lang+".wiktionary.org/w/");
						
						
						/* sanitize the output */
						var parser = new HtmlWhitelistedSanitizer(true);
						var sanitizedHtml = parser.sanitizeString(html);
						document.getElementById("result").innerHTML = sanitizedHtml;
						
						var elements = document.querySelectorAll('.NavFrame');
						for ( var i=elements.length; i--; ) {
							elements[i].textContent = chrome.i18n.getMessage("popup_more_information");
							var node = document.createElement('a');
							var textnode = document.createTextNode("https://"+lang+".wiktionary.org/wiki/"+thisisname);
							node.appendChild(textnode);
							node.href = "https://"+lang+".wiktionary.org/wiki/"+thisisname;
							elements[i].appendChild(node);
						}
						externalLinks();
						document.getElementById('totop').addEventListener('click', topFunction, false);
					}
				}
			}
			xhReq.open("GET", url, true);
			xhReq.send(null);
		}

	} else {
		document.getElementById("result").textContent = chrome.i18n.getMessage("popup_no_selected_text");
	}
}

var getting = chrome.storage.local.get(null,function(result) {
	console.log(result.primlang);
	var querying = chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT}, 
	function(tab) {
		chrome.tabs.sendMessage(tab[0].id, {method: "getSelection"}, 
		function(response){
			if (typeof response !== 'undefined') {
				window.onload = core(response.data,result);
			} else {
				window.onload = core('',result);
			}
		});
	});
});