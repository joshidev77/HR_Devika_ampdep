import "regenerator-runtime/runtime";
import { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { FaMicrophone, FaCommentDots } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
// Optionally, import a sanitization library like dompurify
// import DOMPurify from 'dompurify';

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

  const messageListRef = useRef(null);

  useEffect(() => {
    // Check if the page was reloaded
    const isPageReloaded = sessionStorage.getItem("pageReloaded");
    if (isPageReloaded) {
      // Clear the session storage flag
      sessionStorage.removeItem("pageReloaded");

      // Reset state
      setMessages([]);
      setCurrentMessage("");
      resetTranscript();

      // Send a request to the backend indicating to start the test again
      axios.post("https://devjoshi77.pythonanywhere.com/interview", {
        candidate_input: "Sorry, the page was reloaded. Please restart the test."
      }).catch((error) => {
        console.error("Error sending message to the backend:", error);
      });
    } else {
      // Set flag indicating the page was loaded for the first time
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
      console.log(currentMessage)
      try {
        const response = await axios.post("https://devjoshi77.pythonanywhere.com/interview", {
          candidate_input: currentMessage
        });
        console.log(await response.data.hr_response)
        let aiResponseText;
        if (response.data) {
          // Optional: Sanitize HTML response if using a library
          // aiResponseText = DOMPurify.sanitize(response.data.hr_response) || 'No message received';
          aiResponseText = response.data.hr_response || 'No message received';
        } else {
          aiResponseText = 'Unexpected response format';
        }
  
        setMessages((prevMessages) => [
         ...prevMessages,
          { user: "AI", text: aiResponseText, id: Date.now(), isHtml: true }, // Added isHtml flag
        ]);
      } catch (error) {
        console.error("Error sending message to the backend:", error);
      } finally {
        setWaitingForResponse(false);
      }
    }
    setCurrentMessage("");
  };

  useEffect(() => {
    if (!listening && isRecording) {
      stopListening();
    }
  }, [listening, isRecording]);

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
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
          <h1 className="text-3xl md:text-5xl font-bold">Let's Have an Interview</h1>
        </div>
      </header>
      <main className="main-content flex-grow flex items-center justify-center bg-gray-100 p-4">
        <div className="chat-box bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl">
          <div className="flex flex-col md:flex-row">
            <div className="icon-container flex justify-center items-center p-4 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-1/2">
              {isRecording ? (
                <FaMicrophone className="text-green-500 text-6xl md:text-9xl animate-pulse" />
              ) : (
                <FaCommentDots className="text-pink-500 text-6xl md:text-9xl" />
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div 
                className="message-list p-4 border-b border-gray-200 flex-grow overflow-y-auto" 
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
                          msg.user === "User"
                            ? "user-message"
                            : "ai-message"
                        }`}
                        // Conditionally apply dangerouslySetInnerHTML
                        {...(msg.isHtml ? { dangerouslySetInnerHTML: { __html: msg.text } } : { children: <><strong>{msg.user}:</strong> {msg.text}</> })}
                      />
                    ))}
                    {waitingForResponse && (
                      <div className="mb-2 text-pink-500">
                        <strong>Devika (waiting for response):</strong> Please wait...
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
                  disabled={waitingForResponse} // Disable button while waiting for response
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
