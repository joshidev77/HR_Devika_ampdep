import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
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

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (isRecording && transcript) {
      setMessages([{ user: "User", text: transcript }]);
    }
  }, [transcript, isRecording]);

  const startListening = () => {
    setIsRecording(true);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopListening = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    if (transcript) {
      setMessages([{ question: transcript }]);
      console.log(messages);
      setTextToCopy(transcript);
    }
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl">
          <div className="flex flex-col md:flex-row">
            <div className="flex justify-center items-center p-4 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-1/2">
              {isRecording ? (
                <FaMicrophone className="text-green-500 text-6xl md:text-9xl animate-pulse" />
              ) : (
                <FaCommentDots className="text-blue-500 text-6xl md:text-9xl" />
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div className="p-4 border-b border-gray-200 flex-grow overflow-y-auto max-h-48 md:max-h-64">
                {messages.length === 0 ? (
                  <p className="text-gray-700">
                    Your speech will be converted to text here...
                  </p>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                      <strong>{msg.user}:</strong> {msg.text}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex flex-col items-center">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md mb-2 w-full md:w-auto transition-transform transform hover:scale-105"
                  onClick={setCopied}
                >
                  {isCopied ? "Copied!" : "Copy to clipboard"}
                </button>
                <button
                  className={`${
                    isRecording ? "bg-red-500" : "bg-green-500"
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
