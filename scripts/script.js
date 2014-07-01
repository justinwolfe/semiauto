 var runtime = {
	currentWord : "",
	areaFirstHalf : "",
	areaSecondHalf : ""
 };
 
 $(document).ready(function() {
	writingListener();
 });
 
 function writingListener(){
     $('#writingArea').on('click keypress', function(e) {
		var stopCharacters = [' ', '\n', '\r', '\t']
        var areaText = $(this).val();
        var wordStart = $(this)[0].selectionStart;
        var wordEnd = $(this)[0].selectionEnd;
		console.log(e.type)
        while (wordStart > 0) {
            if (stopCharacters.indexOf(areaText[wordStart]) == -1) {
                --wordStart;
            } else {
                break;
            }                        
        };
		++wordStart
        while (wordEnd < areaText.length) {
            if (stopCharacters.indexOf(areaText[wordEnd]) == -1) {
                ++wordEnd;
            } else {
                break;
            }
        }
		if (wordStart == 1){wordStart = 0};
        runtime.currentWord = areaText.substr(wordStart, wordEnd - wordStart);
		runtime.areaFirstHalf = areaText.substr(0, wordEnd);
		runtime.areaSecondHalf = areaText.substr(wordEnd, areaText.length);
        $("#current_word").text(runtime.currentWord);
    });
 };