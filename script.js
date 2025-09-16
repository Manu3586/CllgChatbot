let voiceMode = false; // flag to check if input came from mic

function startChat() {
  document.getElementById("welcome-screen").classList.add("hidden");
  document.getElementById("chat-screen").classList.remove("hidden");
}

async function sendMessage() {
  let input = document.getElementById("user-input");
  let message = input.value.trim();
  if (message === "") return;

  let chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<div class="bubble user-bubble">${message}</div>`;

  let response = await fetch("/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ query: message })
  });

  let data = await response.json();
  chatBox.innerHTML += `<div class="bubble bot-bubble">${data.response}</div>`;

  // ✅ Speak only if input was via mic
  if (voiceMode) {
    speakText(data.response);
    voiceMode = false; // reset after speaking
  }

  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = "";
}

// 🎤 Voice Input (Speech-to-Text)
function startVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Sorry, your browser doesn't support speech recognition.");
    return;
  }

  let recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {
    let transcript = event.results[0][0].transcript;
    document.getElementById("user-input").value = transcript;

    voiceMode = true; // ✅ enable voice output
    sendMessage();
  };

  recognition.onerror = function(event) {
    console.error("Speech recognition error:", event.error);
  };
}

// 🔊 Voice Output (Text-to-Speech)
function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  let utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}
