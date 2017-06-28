function startRecognition(){
	recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = false;

	recognition.onstart = function(event) {
		console.log("c'est parti")
	};

	recognition.onresult = function(event) {
		recognition.onend = null;

		var text = "";
		for(var i = event.resultIndex; i < event.results.length; i++){
			text += event.results[i][0].transcript;
		}
		send(text);
	};

	recognition.lang = "en-US";
	recognition.start();

	function send(text){
		console.log(text);
		$ajax({
			type: "POST",
			url: "https://api.api.ai/v1/query",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			headers: {
				"Authorization": "Bearer " + "dce399808780466db898fad9bfae71fe"
			},
			data: JSON.stringify({query: text, lang: "en", sessionId: "yaydevdiner"}),

			success: function(data){
				console.log(data);
			},
			error: function(){
				console.log("error");
			}
		});
	}
}