import "regenerator-runtime/runtime";
import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { FaMicrophone, FaCommentDots } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const App = () => {
  const [textToCopy, setTextToCopy] = useState("");
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

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

  const stopListening = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    if (currentMessage) {
      const newMessage = { user: "User", text: currentMessage, id: Date.now() };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setTextToCopy(currentMessage);
      setWaitingForResponse(true);

      // Simulate sending to backend
      console.log("Sending to backend:", currentMessage);
      
      // Replace with actual backend call
      simulateBackendResponse(currentMessage);
    }
    setCurrentMessage("");
  };

  const simulateBackendResponse = async (message) => {
    // Simulate a delay for the backend response
    setTimeout(() => {
      const aiResponse = "This is a simulated AI response."; // Replace with backend response
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "AI", text: aiResponse, id: Date.now() },
      ]);
      setWaitingForResponse(false);
    }, 2000); // Simulate network delay
  };

  useEffect(() => {
    if (!listening && isRecording) {
      stopListening();
    }
  }, [listening, isRecording]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Navbar />
      <main className="main-content flex-grow flex items-center justify-center bg-gray-100 p-4">
        <div className="chat-box bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl">
          <div className="flex flex-col md:flex-row">
            <div className="icon-container flex justify-center items-center p-4 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-1/2">
              {isRecording ? (
                <FaMicrophone className="text-green-500 text-6xl md:text-9xl animate-pulse" />
              ) : (
                <FaCommentDots className="text-blue-500 text-6xl md:text-9xl" />
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div className="message-list p-4 border-b border-gray-200 flex-grow overflow-y-auto">
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
                          msg.user === "User"
                            ? "user-message"
                            : "ai-message"
                        }`}
                      >
                        <strong>{msg.user}:</strong> {msg.text}
                      </div>
                    ))}
                    {waitingForResponse && (
                      <div className="mb-2 text-gray-500">
                        <strong>AI (waiting for response):</strong> Please wait...
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
                  className="copy-button bg-blue-500 text-white py-2 px-4 rounded-md mb-2 w-full md:w-auto transition-transform transform hover:scale-105"
                  onClick={setCopied}
                >
                  {isCopied ? "Copied!" : "Copy to clipboard"}
                </button>
                <button
                  className={`${
                    isRecording ? "stop-button" : "start-button"
                  } text-white py-2 px-4 rounded-md mb-2 w-full md:w-auto transition-transform transform hover:scale-105`}
                  onClick={isRecording ? stopListening : startListening}
                >
                  {isRecording ? "Stop Listening" : "Start Listening"}
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
