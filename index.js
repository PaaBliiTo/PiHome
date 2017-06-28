function startRecognition(){
	recognition = new webkitSpeechRecognition();
	recognition.continuous = false;
	recognition.interimResults = false;

	var synth = window.speechSynthesis;

	recognition.onstart = function(event) {
		console.log("c'est parti")
	};

	recognition.onaudioend = function(){
		console.log("pd");
		startRecognition();
	}

	recognition.onresult = function(event) {
		recognition.onaudioend = null;

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
		$.ajax({
			type: "POST",
			url: "https://api.api.ai/v1/query",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			headers: {
				"Authorization": "Bearer " + "dce399808780466db898fad9bfae71fe"
			},
			data: JSON.stringify({query: text, lang: "en", sessionId: "yaydevdiner"}),

			success: function(data){
				console.log(data.result.speech);
				recognition.stop();
				var utterance = new SpeechSynthesisUtterance(data.result.speech);
				utterance.lang = 'en-US';
				utterance.onend = function() {
					startRecognition();
				};
				synth.speak(utterance);
			},
			error: function(){
				console.log("error");
			}
		});
	}
}
