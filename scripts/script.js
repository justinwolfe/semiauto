 var runtime = {
	currentWord: "",
	tokens: [],
	choiceLength: 3, 
	randomChoiceAmount: 10,
	suggestedChoiceAmount: 10,
	fileInputs: [],
	fileRequests: {},
	fileRequestIDs: [],
	requestCounter: 0,
	requestsStarted: false,
	requestsDone: false,
	inputString: "",
	ctrlPressed: false
 };
 
 $(document).ready(function() {
	writingListener();
	setInputs();
 });
 
 function setInputs(){
	runtime.fileInputs[0] = "Brown Corpus@assets/browncorpus.txt";
	runtime.fileInputs[1] = "Lives of the Artists by Giorgio Vasari@assets/livesoftheartists.txt";
	runtime.fileInputs[2] = "Moby Dick by Herman Melville@assets/mobydick.txt";
	for (i=0; i<runtime.fileInputs.length; i++){
		var tempArray = runtime.fileInputs[i].split("@");
		$("#fileInputContainer").append("<div><input type='checkbox' class='inputCheckbox' id='inputCheckbox" + i + "' value='" + tempArray[1] + "'>" + tempArray[0] + "</div>");
	};
	$("#startButton").click(function(){
		if (runtime.requestsStarted == false){
			console.log("test");
			collectInputs();
			runtime.requestsStarted = true;
		} else {
		};
	});
};

function collectInputs(){
	runtime.inputString += $("#textInput").val();
	$(".inputCheckbox").each(function(index){
		if ($(this).prop('checked') == true){
			runtime.fileRequests[$(this).attr('id')] = "started";
			runtime.fileRequestIDs.push($(this).attr('id'));
		};
	});
	if (runtime.fileRequestIDs.length >= 1){
		loadInputs();
	} else {
		processInputs();
	};
};

function loadInputs(){
	if (runtime.requestCounter < runtime.fileRequestIDs.length){
		var request = runtime.fileRequestIDs[runtime.requestCounter];
		var requestID = "#" + request;
		var requestLocation = $(requestID).val();
		$.get(requestLocation, function(data) {
			runtime.inputString += data;
			runtime.requestCounter += 1;
			if (runtime.requestCounter < runtime.fileRequestIDs.length){
				loadInputs();
			};
		}).done(function(){
			console.log(request + " done");
			runtime.fileRequests[request] = "done";
			for (var i=0; i<runtime.fileRequestIDs.length; i++){
				//setting it to true here so if it comes out of the loop still true, everything's done
				runtime.requestsDone = true;
				var id = runtime.fileRequestIDs[i];
				if (runtime.fileRequests[id] == "started"){
					runtime.requestsDone = false;
				};
			};
			if (runtime.requestsDone == true){
				processInputs();
			};
		});
	} else {
	};
};

function processInputs(){
	runtime.inputString = runtime.inputString.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g," ");
	runtime.inputString = runtime.inputString.replace(/"/g, "");
	runtime.inputString = runtime.inputString.replace(/(\r\n|\n|\r)/gm," ");
	runtime.inputString = runtime.inputString.replace(/\s{2,}/g, " ");
	runtime.inputString = runtime.inputString.replace(/[0-9]/g, '');
	runtime.inputString = runtime.inputString.replace("  ", " ");
	runtime.inputString = runtime.inputString.toLowerCase();
	runtime.tokens = runtime.inputString.split(" "); 
	switchScreen();
};

function switchScreen(){
	$("#inputScreen").hide();
	$("#writingScreen").show();
};

 function writingListener(){
     $('#writingArea').on('click keyup', function(e) {
		var stopCharacters = [' ', '\n', '\r', '\t']
        var areaText = $(this).val();
		console.log(areaText);
        var wordStart = $(this)[0].selectionStart;
        var wordEnd = $(this)[0].selectionEnd;
        while (wordStart > 0) {
            if (stopCharacters.indexOf(areaText[wordStart]) == -1) {
                --wordStart;
            } else {
                break;
            }                        
        }
		++wordStart
        while (wordEnd <= areaText.length) {
            if (stopCharacters.indexOf(areaText[wordEnd]) == -1) {
                ++wordEnd;
            } else {
                break;
            }
        }
		console.log(wordStart);
		console.log(wordEnd);
		if (wordStart == 1){wordStart = 0};
        runtime.currentWord = areaText.substr(wordStart, wordEnd - wordStart);	
		if (wordStart == wordEnd + 1 && runtime.currentWord == ""){
			runtime.currentWord = returnPrevWord();
		}		
		runtime.currentWord.replace(/['";:,.?]/g, '');
		console.log(runtime.currentWord);
		if (runtime.currentWord != ""){
			getChoices("suggested", runtime.currentWord);
		}
		getChoices("random");
    });
 };
 
 function getChoices(type, word){
	var wordPositions = [];
	var choices = []; 
	if (type == "suggested"){
		for (i=0; i<runtime.tokens.length; i++){
			if (runtime.tokens[i] == word){
				wordPositions.push(i);
			};
		};
	} else if (type == "random"){
		for (i=0; i<runtime.randomChoiceAmount; i++){
			wordPositions.push(Math.floor((Math.random()*runtime.tokens.length - runtime.randomChoiceAmount)+0));
		};
	};
	for (i=0; i<wordPositions.length; i++){
		var tempChoice = wordPositions[i];
		var tempString = "";
		for (j=1; j<=runtime.choiceLength; j++){
			if (j>1){
				tempString += " ";
			};
			tempString += runtime.tokens[tempChoice + j];
		};
		choices.push(tempString);
	};
	if (type == "suggested"){
		giveChoices(choices, "#suggestedChoices");
	} else if (type == "random"){
		giveChoices(choices, "#randomChoices");
	};
};

function giveChoices(choices, container){
	var choicesString = "";
	if (container == "#suggestedChoices"){
		for (i=0; i<runtime.suggestedChoiceAmount; i++){
			var counter = Math.floor((Math.random()*choices.length)+0);
			choicesString += "<li class='suggestedChoice'>" + choices[counter] + "</li>";
		};
	} else if (container == "#randomChoices"){
		for (i=0; i<choices.length; i++){
			choicesString += "<li class='randomChoice'>" + choices[i] + "</li>";
		};
	};
	$(container).html("");
	$(container).append(choicesString);
};

// from stack overflow site that i then lost the url for and should search for if i ever release this publicly

function GetCaretPosition(ctrl) {
        var CaretPos = 0;   // IE Support
        if (document.selection) {
            ctrl.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        }
        // Firefox support
        else if (ctrl.selectionStart || ctrl.selectionStart == '0')
            CaretPos = ctrl.selectionStart;
        return (CaretPos);
    }

    function ReturnWord(text, caretPos) {
        var index = text.indexOf(caretPos);
        var preText = text.substring(0, caretPos);
        if (preText.indexOf(" ") > 0) {
            var words = preText.split(" ");
            return words[words.length - 1]; //return last word
        }
        else {
            return preText;
        }
    }

    function returnPrevWord() {
        var text = document.getElementById("textArea");
        var caretPos = GetCaretPosition(text)
        var word = ReturnWord(text.value, caretPos);
        if (word != null) {
            return word;
        }
    }