var audio = new Audio('activate.wav');
audio.volume = 0.5;
var synth = window.speechSynthesis;

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
		console.log(text);
		if(text.toLowerCase() == "écho"){
			echo();
		}
		else{
			startRecognition();
		}
	};

	function echo() {
		recognition.stop();
		audio.play();
		setTimeout(startRecognitionSent(), 1000)
	}

	recognition.lang = "fr-FR";
	recognition.start();



	
}

function startRecognitionSent() {
	recognition = new webkitSpeechRecognition();
	recognition.continuous = false;
	recognition.interimResults = false;

	

	recognition.onstart = function(event) {
		console.log("c'est vraiment parti")
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

	recognition.lang = "fr-FR";
	recognition.start();

	function send(text){
		console.log(text);
		$.ajax({
			type: "POST",
			url: "https://api.api.ai/v1/query",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			headers: {
				"Authorization": "Bearer " + "37af3641619a4f14877a0480c1b61388"
			},
			data: JSON.stringify({query: text, lang: "fr", sessionId: "PaaBliiTo"}),

			success: function(data){
				console.log(data.result.speech);
				recognition.stop();
				var utterance = new SpeechSynthesisUtterance(data.result.speech);
				utterance.lang = 'fr-FR';
				utterance.onend = function() {
					if(data.result.action == "weather"){
						meteo(data);
					}
					else{
						startRecognition();	
					}
				};
				synth.speak(utterance);
			},
			error: function(){
				console.log("error");
			}
		});
	}
}

function meteo(data){
	var city;
	if(typeof data.result.parameters.address === "object" || data.result.parameters.address instanceof Object){
		city = data.result.parameters.address.city;
	}
	else{
		city = data.result.parameters.address;
	}
	console.log(city);
	$.ajax({
		type: "GET",
		url: "https://api.apixu.com/v1/forecast.json?key=412c2e68396a4a73835130643170407&q="+city+"&lang=fr",
		contentType: "aaplication/json; charset=utf-8",
		dataType: "json",
		success: function(data){
			var sentence = "Les prévisions pour "+data.location.name+" aujourd'hui sont : "+data.forecast.forecastday[0].day.condition.text+" avec \
			une température maximale de "+Math.round(data.forecast.forecastday[0].day.maxtemp_c)+" degrés et une minimale \
			de "+Math.round(data.forecast.forecastday[0].day.mintemp_c)+" degrés";
			console.log(sentence);
			var utterance = new SpeechSynthesisUtterance(sentence);
			utterance.lang = 'fr-FR';
			utterance.onend = function(){
				startRecognition();
			};
			synth.speak(utterance);
		},
		error: function(){
			console.log("error");
		}
	});
}