chrome.runtime.onMessage.addListener( 
    function(request, sender, sendResponse) { 
        if (request.method == "getSelection") {
            sendResponse({data: window.getSelection().toString()});
		console.log("send a");}
    }
)



chrome.storage.local.get("quickButton", function (result) {
	if (result.quickButton==1 || typeof result.quickButton === "undefined"){
		var s = document.createElement('script');
		var creatediv = document.createElement("div");
		creatediv.setAttribute("id", 'quickButton');
		creatediv.setAttribute("style", 'display: none;');
		document.getElementsByTagName("body")[0].appendChild(creatediv);
		
		var link = document.getElementById('quickButton');
		// onClick's logic below:
		link.addEventListener('mousedown', function() {
			setTimeout(function() {
				document.dispatchEvent(new CustomEvent('RW759_connectExtension', {
					detail: "F*CK YA"
				}));
			}, 0);
		});
		
		
		document.addEventListener('mousedown', HideQuickButtonOnMouseDown, false);
		function HideQuickButtonOnMouseDown(event) {
			var quickButton = document.getElementById('quickButton');
			if (event.target.id !== "quickButton") quickButton.setAttribute("style", 'display: none;');
		}
		document.addEventListener('mouseup', function () {setTimeout(function() {ShowQuickButton();}, 50)}, false);
		
		/* From https://stackoverflow.com/a/26495188 */
		function getSelectionCoords() {
			var sel = document.selection, range, rect;
			var x = 0, y = 0;
			if (sel) {
				if (sel.type != "Control") {
					range = sel.createRange();
					range.collapse(true);
					x = range.boundingLeft;
					y = range.boundingTop;
				}
			} else if (window.getSelection) {
				sel = window.getSelection();
				if (sel.rangeCount) {
					range = sel.getRangeAt(0).cloneRange();
					if (range.getClientRects) {
						range.collapse(true);
						if (range.getClientRects().length>0){
							rect = range.getClientRects()[0];
							x = rect.left;
							y = rect.top;
						}
					}
					// Fall back to inserting a temporary element
					if (x == 0 && y == 0) {
						var span = document.createElement("span");
						if (span.getClientRects) {
							// Ensure span has dimensions and position by
							// adding a zero-width space character
							span.appendChild( document.createTextNode("\u200b") );
							range.insertNode(span);
							rect = span.getClientRects()[0];
							x = rect.left;
							y = rect.top;
							var spanParent = span.parentNode;
							spanParent.removeChild(span);

							// Glue any broken text nodes back together
							spanParent.normalize();
						}
					}
				}
			}
			return { x: x, y: y };
		}


		function ShowQuickButton() {
			txtSel = getSelection().toString();
			txtSel = txtSel.toLowerCase();
			console.log('mouse released txtSel: '+txtSel);
			var quickButton = document.getElementById('quickButton');
			if (!txtSel || txtSel == "") {
				if (quickButton){
					quickButton.setAttribute("style", 'display: none;');
				}
			} else {
				var coords = getSelectionCoords();
				//console.log(coords.x + ", " + coords.y);
				//console.log('works '  +chrome.extension.getURL('icon.png'));
				quickButton.setAttribute("style", 'height: 16px; width: 16px; background-image: url("'+chrome.extension.getURL('/img/icon.png')+'"); background-size: 16px; color:#000000; position:absolute; top:' + (coords.y + window.pageYOffset - 20) + 'px; left:' + (coords.x + window.pageXOffset) + 'px; padding:0px; z-index:10000; border-radius:2px;');
				quickButton.setAttribute("data-selected-text", txtSel);
			}
		}
		document.addEventListener('RW759_connectExtension', function(e) {
			var quickButton = document.getElementById('quickButton');
			var Selected = encodeURIComponent(quickButton.getAttribute('data-selected-text'));
			var URL = 'popup-w.html?text='+Selected;
			//chrome.runtime.sendMessage({type:'cleanWindow'});
			chrome.runtime.sendMessage({type:'open_new_window',content: URL});
			
		});
	}
});