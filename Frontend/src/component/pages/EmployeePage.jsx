import "regenerator-runtime/runtime";
import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { FaMicrophone, FaCommentDots } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from 'axios';

const App = () => {
  const [textToCopy, setTextToCopy] = useState("");
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [employees, setEmployees] = useState([]);

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

  const stopListening = async () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    if (currentMessage) {
      const newMessage = { user: "User", text: currentMessage, id: Date.now() };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setTextToCopy(currentMessage);
      setWaitingForResponse(true);

      try {
        // Replace with your actual API endpoint
        console.log(currentMessage)
        const response = await axios.post('https://devjoshi77.pythonanywhere.com/request_query', { requery: currentMessage });
        setEmployees(response.data.results); 
        console.log(employees)
      } catch (error) {
        console.error("Error fetching data from API", error);
      }
      
      setWaitingForResponse(false);
    }
    setCurrentMessage("");
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
                <FaCommentDots className="text-pink-500 text-6xl md:text-9xl" />
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div className="message-list p-4 border-b border-gray-200 flex-grow overflow-y-auto">
                {messages.length === 0 && !currentMessage ? (
                  <p className="text-gray-700">Explain your Query...</p>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`message mb-2 p-2 rounded-lg ${
                          msg.user === "User" ? "user-message" : "ai-message"
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
                  className={`${
                    isRecording ? "stop-button" : "start-button"
                  } text-white bg-pink-500 py-2 px-4 rounded-md mb-2 w-full md:w-auto transition-transform transform hover:scale-105`}
                  onClick={isRecording ? stopListening : startListening}
                >
                  {isRecording ? "Fire Query 🔥" : "Start Listening Query 🔥"}
                </button>
              </div>
            </div>
          </div>
          {/* {employees.length > 0 && (
            <div className="employee-table mt-8">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2">ID</th>
                    <th className="border-b px-4 py-2">First Name</th>
                    <th className="border-b px-4 py-2">Last Name</th>
                    <th className="border-b px-4 py-2">Gender</th>
                    <th className="border-b px-4 py-2">DOB</th>
                    <th className="border-b px-4 py-2">Email</th>
                    <th className="border-b px-4 py-2">Phone</th>
                    <th className="border-b px-4 py-2">Hire Date</th>
                    <th className="border-b px-4 py-2">Job Title</th>
                    <th className="border-b px-4 py-2">Department</th>
                    <th className="border-b px-4 py-2">Salary</th>
                    <th className="border-b px-4 py-2">Address</th>
                    <th className="border-b px-4 py-2">City</th>
                    <th className="border-b px-4 py-2">State</th>
                    <th className="border-b px-4 py-2">Postal Code</th>
                    <th className="border-b px-4 py-2">Country</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.employee_id}>
                      <td className="border-b px-4 py-2">{emp.employee_id}</td>
                      <td className="border-b px-4 py-2">{emp.first_name}</td>
                      <td className="border-b px-4 py-2">{emp.last_name}</td>
                      <td className="border-b px-4 py-2">{emp.gender}</td>
                      <td className="border-b px-4 py-2">{emp.date_of_birth}</td>
                      <td className="border-b px-4 py-2">{emp.email}</td>
                      <td className="border-b px-4 py-2">{emp.phone_number}</td>
                      <td className="border-b px-4 py-2">{emp.hire_date}</td>
                      <td className="border-b px-4 py-2">{emp.job_title}</td>
                      <td className="border-b px-4 py-2">{emp.department}</td>
                      <td className="border-b px-4 py-2">{emp.salary}</td>
                      <td className="border-b px-4 py-2">{emp.address}</td>
                      <td className="border-b px-4 py-2">{emp.city}</td>
                      <td className="border-b px-4 py-2">{emp.state}</td>
                      <td className="border-b px-4 py-2">{emp.postal_code}</td>
                      <td className="border-b px-4 py-2">{emp.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )} */}
        </div>
      </main>
      <Footer />
    </div>
  );
  
};

export default App;
