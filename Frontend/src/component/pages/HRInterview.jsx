import "regenerator-runtime/runtime";
import { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { FaMicrophone } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import woman from "../animations/women_animanation.gif";
import axios from "axios";

const App = () => {
  const [textToCopy, setTextToCopy] = useState("");
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [voice, setVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  let URL = import.meta.env.VITE_INTERVIEW_URL;
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const messageListRef = useRef(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance();
    setUtterance(u);

    const setGoogleUKFemaleVoice = () => {
      const voices = synth.getVoices();
      const googleUKFemaleVoice = voices.find(
        (v) => v.name === "Google UK English Female"
      );
      if (googleUKFemaleVoice) {
        setVoice(googleUKFemaleVoice);
        u.voice = googleUKFemaleVoice;
      } else {
        console.warn("Google UK English Female voice not found");
      }
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = setGoogleUKFemaleVoice;
    }

    setGoogleUKFemaleVoice();

    return () => {
      synth.cancel();
    };
  }, []);

  useEffect(() => {
    const isPageReloaded = sessionStorage.getItem("pageReloaded");
    if (isPageReloaded) {
      sessionStorage.removeItem("pageReloaded");
      setMessages([]);
      setCurrentMessage("");
      resetTranscript();
      console.log(URL);
      axios
        .post(URL, {
          candidate_input:
            "Sorry, the page was reloaded. Please restart the test.",
        })
        .catch((error) => {
          console.error("Error sending message to the backend:", error);
        });
    } else {
      sessionStorage.setItem("pageReloaded", "true");
    }
  }, [resetTranscript]);

  useEffect(() => {
    if (isRecording && transcript) {
      setCurrentMessage(transcript);
    }
  }, [transcript, isRecording]);

  const startListening = () => {
    setIsRecording(true);
    resetTranscript();
    setCurrentMessage("");
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopListening = async () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    if (currentMessage) {
      const newMessage = { user: "User", text: currentMessage, id: Date.now() };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setTextToCopy(currentMessage);
      setWaitingForResponse(true);
      try {
        const response = await axios.post(
          "https://devjoshi77.pythonanywhere.com/interview",
          {
            candidate_input: currentMessage,
          }
        );
        let aiResponseText;
        if (response.data) {
          aiResponseText = response.data.hr_response || "No message received";
        } else {
          aiResponseText = "Unexpected response format";
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "AI", text: aiResponseText, id: Date.now(), isHtml: true },
        ]);

        speakText(aiResponseText);
      } catch (error) {
        console.error("Error sending message to the backend:", error);
      } finally {
        setWaitingForResponse(false);
      }
    }
    setCurrentMessage("");
  };

  const speakText = (text) => {
    if (utterance) {
      window.speechSynthesis.cancel();
      const plainText = text.replace(/<[^>]*>?/gm, "");
      utterance.text = plainText;
      utterance.voice = voice;
      utterance.volume = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!listening && isRecording) {
      stopListening();
    }
  }, [listening, isRecording]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Navbar />
      <header className="header py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold">
            Let's Have an Interview
          </h1>
        </div>
      </header>
      <main className="main-content flex-grow flex items-center justify-center bg-gray-100 p-4">
        <div className="chat-box bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl flex flex-col">
          <div className="flex flex-col md:flex-row h-full">
            <div className="icon-container flex justify-center items-center p-4 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-1/2 h-48 md:h-auto bg-gray-200">
              {isRecording ? (
                <FaMicrophone className="text-green-500 text-6xl md:text-9xl animate-pulse w-full h-full object-cover" />
              ) : (
                <img
                  src={woman}
                  alt="Woman animation"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = "path/to/placeholder.png")} // Path to a placeholder image
                />
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col">
              <div
                className="message-list p-4 border-b border-gray-200 flex-grow overflow-y-auto h-48 md:h-auto"
                ref={messageListRef}
              >
                {messages.length === 0 && !currentMessage ? (
                  <p className="text-gray-700">
                    Your speech will be converted to text here...
                  </p>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`message mb-2 p-2 rounded-lg ${
                          msg.user === "User" ? "user-message" : "ai-message"
                        }`}
                        {...(msg.isHtml
                          ? { dangerouslySetInnerHTML: { __html: msg.text } }
                          : {
                              children: (
                                <>
                                  <strong>{msg.user}:</strong> {msg.text}
                                </>
                              ),
                            })}
                      />
                    ))}
                    {waitingForResponse && (
                      <div className="mb-2 text-pink-500">
                        <strong>Devika (waiting for response):</strong> Please
                        wait...
                      </div>
                    )}
                    {!waitingForResponse && currentMessage && (
                      <div className="mb-2">
                        <strong>User (current):</strong> {currentMessage}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="actions mt-4 flex flex-col items-center">
                <button
                  className={`${
                    isRecording ? "stop-button" : "start-button"
                  } text-white bg-pink-500 py-2 px-4 rounded-md mb-2 w-full md:w-auto transition-transform transform hover:scale-105`}
                  onClick={isRecording ? stopListening : startListening}
                  disabled={waitingForResponse || isSpeaking}
                >
                  {isRecording ? "Stop Speaking" : "Start Speaking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
