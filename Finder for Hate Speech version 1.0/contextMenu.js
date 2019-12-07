/**
* @author Sebastian Voigt
*
* contextMenu.js is for using the contextMenu
*/

/**
* Sends selected text and show the response 
* @property {string} responsePrediction - label for hate or no hate in alert box
* @property {string} responseProbability - show the % 
*/
function checkText(info,tab) {
	selectedText = info.selectionText.replace(/["']/g, "");
	var xhr = new XMLHttpRequest();
	var baseUrlPredict = "https://demo.datexis.com/nohate/predict";
	xhr.open("POST", baseUrlPredict, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	var textToJson = '{"query": "' + selectedText + '", "lang": "' + info.menuItemId + '", "model": "ft", "source": "extension"}';
		xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
				var jsonResponse = JSON.parse(xhr.responseText);
				var responsePrediction = jsonResponse.prediction;
				var responseProbability = jsonResponse.probability;
				var predictionText = "Prediction";
				var probabilityText = "Probability";
				
				if (responsePrediction == "nohate" || responsePrediction == 0) {
					responsePrediction = "No Hate";
				} else {
					responsePrediction = "Hate";
				}
				responseProbability = responseProbability * 100 + "%";
				alert("Prediction: " + responsePrediction + "\n" + "Probability: " + responseProbability);
			}
		}
	xhr.send(JSON.stringify(JSON.parse(textToJson)));
}

chrome.contextMenus.create({
  title: "Check for HATE (EN): %s",
  id: "en",  
  contexts:["selection"], 
  onclick: checkText
});

chrome.contextMenus.create({
  title: "Check for HATE (DE): %s",
  id: "de",  
  contexts:["selection"], 
  onclick: checkText
});