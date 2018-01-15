function saveOptions(e) {
	e.preventDefault();
	if(document.querySelector("#primlang").value!=document.querySelector("#secolang").value && document.querySelector("#primlang").value!=''){
		chrome.storage.local.set({
			primlang: document.querySelector("#primlang").value,
			secolang: document.querySelector("#secolang").value,
			quickButton: document.querySelector('input[name="quickButton"]:checked').value
		});
		document.getElementById("error").textContent = '';
		document.getElementById("note").textContent = chrome.i18n.getMessage("config_success");
		setTimeout(function() {document.getElementById("note").textContent = '';}, 1800);
	} else if (document.querySelector("#primlang").value!=document.querySelector("#secolang").value) {
		document.getElementById("error").textContent = chrome.i18n.getMessage("config_error_1");
		document.getElementById("note").textContent = '';
		setTimeout(function() {document.getElementById("error").textContent = '';}, 1800);
		restoreOptions();
	} else {
		document.getElementById("error").textContent = chrome.i18n.getMessage("config_error_2");
		document.getElementById("note").textContent = '';
		setTimeout(function() {document.getElementById("error").textContent = '';}, 1800);
		restoreOptions();
	}
}

function restoreOptions() {

	function onError(error) {
		console.log(`Error: ${error}`);
	}
	chrome.storage.local.get("primlang", function (result) {
		document.querySelector("#primlang").value = result.primlang || "vi";
		});
	chrome.storage.local.get("secolang",
		function(result){
		document.querySelector("#secolang").value = result.secolang || "";
		});
	chrome.storage.local.get("quickButton", function (result) {
		if(result.quickButton == 0) {
		  document.getElementById("quickButtonNo").checked = true;
		}else {
		  document.getElementById("quickButtonYes").checked = true;
		}
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.getElementById("goback").addEventListener("click", function(){window.history.go(-1); return false;},false);