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