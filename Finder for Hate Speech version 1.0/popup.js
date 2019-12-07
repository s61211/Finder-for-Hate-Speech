/**  
* @author Sebastian Voigt
*
* popup.js is the javascript for using the icon
*
* On window load
* @ description On window load
* @ property {object} xhr
* @ property {object} baseUrlPredict
* @ property {object} baseUrlLabel
*/
window.onload = function(){
	
	/** 
	* Get marked text from tabs and make a string
	* @description Get marked text from tabs and make a string
	*/
	chrome.tabs.executeScript( {
		code: "window.getSelection().toString();"
	}, 

	/**
	* Get marked string at position 0
	* Show the string in HTML
	* @description Get marked string at position 0
	* @description Show the string in HTML
	* @param {string} selection - selected text
	* @property {string} selectedText - starts from the beginning of the selected text
	* 
	*/
	function(selection) {
		selectedText = selection[0];
		document.getElementById("showText").innerHTML = selection[0];
	},
	);
	
	var xhr = new XMLHttpRequest();
	var baseUrlPredict = "https://demo.datexis.com/nohate/predict";
	var baseUrlLabel = "https://demo.datexis.com/nohate/label";
	
	/**
	* Send text and get the response
	* Replace all " and ' with nothing
	* Changed the HTML and styled it
	* Show the response in the changed HTML
	* @description Send text and get the response
	* @description changed the HTML and styled it
	* @param {string} selection - selected text
	* @property {string} language
	* @property {string} textToJson - is late the json 
	*/
	document.getElementById("send").onclick = function sendTextAndResponse(selection) {
		languageSelector = document.getElementById("languageSelection");
		selectedText = selectedText.replace(/["']/g, "");
		xhr.open("POST", baseUrlPredict, true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		if (languageSelector.checked == true) {
			language = "de";
		} else {
			language = "eng";
		}
		var textToJson = '{"query": "' + selectedText + '", "lang": "' + language + '", "model": "ft", "source": "extension"}';
		
		/**
		* Get the response
		* Styled HTML
		* @property {string} px - pixel
		* @property {string} predictionText - is the respone text for the prediction
		* @property {string} probabilityText - is the respone text for the probability
		* @property {string} thanks - thank you text that comes after the sending
		*/
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var jsonResponse = JSON.parse(xhr.responseText);
				var responsePrediction = jsonResponse.prediction;
				var responseProbability = jsonResponse.probability;
				responseCommentId = jsonResponse.comment_id;
				var px = "3px";
				var predictionText = "Prediction";
				var probabilityText = "Probability";
				var commentarIDText = "Kommentar ID";
				var thanks = "Thank you for using our Extension";
				var elementPrediction = document.getElementById("prediction");
				var elementProbability = document.getElementById("probability");
				
				if (responsePrediction == "nohate" || responsePrediction == 0) {
					responsePrediction = "No Hate";
					elementPrediction.style.backgroundColor = "green";
					elementProbability.style.backgroundColor = "green";
				} else {
					responsePrediction = "Hate";
					elementPrediction.style.backgroundColor = "red";
					elementProbability.style.backgroundColor = "red";
				}
				responseProbability = responseProbability * 100 + "%";
				elementPrediction.style.padding = px;
				elementPrediction.style.margin = px;
				elementProbability.style.padding = px;
				elementProbability.style.margin = px;
				document.getElementById("predictionText").innerHTML = predictionText;
				elementPrediction.innerHTML = responsePrediction;
				document.getElementById("probabilityText").innerHTML = probabilityText;
				elementProbability.innerHTML = responseProbability;
				document.getElementById("commentarIDText").innerHTML = commentarIDText;
				document.getElementById("commentarID").innerHTML = responseCommentId;
				document.getElementById("commentarID").style.backgroundColor = "blue";
				document.getElementById("input").innerHTML = thanks;
			}
		}
		document.getElementById("voteHate").style.visibility = "visible";
		document.getElementById("voteNoHate").style.visibility = "visible";
		console.log(textToJson);
		xhr.send(JSON.stringify(JSON.parse(textToJson)));
	}

	/**
	* Sends label for hate to datexis and say thanks for voting
	* @description Sends label for hate to datexis and say thanks for voting
	* @param {string} responseCommentId - is the comment id for labeling
	* @property {string} hateToJson - JSON what is send for labeling
	*/
	document.getElementById("voteHate").onclick = function sendLabelHate(responseCommentId) {
		xhr.open("POST", baseUrlLabel, true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		var hateToJson = '{"comment_id": "' + responseCommentId + '", "label": "1"}';
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			var jsonResponse = JSON.parse(xhr.responseText);
			document.getElementById("thank").innerHTML = "Thank you for voting";
			}
		}
		console.log(hateToJson);
		xhr.send(JSON.stringify(JSON.parse(hateToJson)));
	}
	
	/**
	* Sends label for no hate to datexis and say thanks for voting
	* @description Sends label for no hate to datexis and say thanks for voting
	* @param {string} responseCommentId - is the comment id for labeling
	* @property {string} hateToJson - JSON what is send for labeling
	*/	
	document.getElementById("voteNoHate").onclick = function sendLabelNoHate(responseCommentId) {
		xhr.open("POST", baseUrlLabel, true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		var noHateToJson = '{"comment_id": "' + responseCommentId + '", "label": "0"}'
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var jsonResponse = JSON.parse(xhr.responseText);
				document.getElementById("thank").innerHTML = "Thank you for voting";
			}
		}
		console.log(noHateToJson);
		xhr.send(JSON.stringify(JSON.parse(noHateToJson)));
	}
}