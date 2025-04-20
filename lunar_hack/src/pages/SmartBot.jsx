import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { decode } from 'he'; // Install `he` library: npm install he

const SmartBot = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Smart Campus Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const suggestions = [
        "attestation de présence ?",
        "relevé de notes ?",
        "Ahla",
        "Merci !",
    ];

    const handlePromptResponse = (rawResponse) => {
        return decode(rawResponse.replace(/â€™/g, "'").replace(/Ã©/g, "é").replace(/Ã /g, "à"));
    };

    const handleSubmit = async (e, predefinedMessage = null) => {
        e.preventDefault();
        const messageToSend = predefinedMessage || inputValue;

        if (!messageToSend.trim()) return;

        // Add user message
        const userMessage = { text: messageToSend, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageToSend }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response from the server.');
            }

            const data = await response.json();
            const botMessage = { 
                text: handlePromptResponse(data.response) || 'I am sorry, I could not understand that.', 
                sender: 'bot' 
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages((prev) => [
                ...prev,
                { text: 'Oops! Something went wrong. Please try again later.', sender: 'bot' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-200">
            <nav className="bg-white/90 backdrop-blur-lg py-3 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-50 border-b border-gray-200/70 shadow-sm">
                  {/* Mobile Header */}
                  <div className="w-full flex justify-between items-center sm:hidden">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="/UTM.png" 
                        alt="University Logo" 
                        className="h-10 transition-all hover:scale-105 hover:opacity-90 active:scale-95"
                      />
                      <h1 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                        Smart Campus
                      </h1>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
            
                  {/* Desktop Header */}
                  <div className="hidden sm:flex w-full justify-between items-center">
                    {/* Left side - Logo + Smart Bot */}
                    <div className="flex items-center space-x-6">
                      <img 
                        src="/UTM.png" 
                        alt="University Logo" 
                        className="h-12 transition-all hover:scale-105 hover:opacity-90 active:scale-95"
                      />
                      <Link to="/smart-bot" >
                        <div className="cursor-pointer px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50/70 transition-all duration-200 font-medium shadow-sm hover:shadow-md active:scale-95">
                          Smart Bot
                        </div>
                      </Link>
                    </div>
            
                    {/* Center - Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                      Smart Campus 
                    </h1>
            
                    {/* Right side - Lost & Found + Logo */}
                    <div className="flex items-center space-x-6">
                      <Link to="/lost-found" >
                        <div className="cursor-pointer px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50/70 transition-all duration-200 font-medium shadow-sm hover:shadow-md active:scale-95">
                          Lost & Found
                        </div>
                      </Link>
                      <img 
                        src="/Ministre.png" 
                        alt="Ministry Logo" 
                        className="h-12 transition-all hover:scale-105 hover:opacity-90 active:scale-95" 
                      />
                    </div>
                  </div>
                </nav>

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 ">
                <div className="bg-white rounded-xl shadow-md overflow-hidden h-150">
                    <div className="h-96 p-4 overflow-y-auto space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-xs sm:max-w-md rounded-lg px-4 py-2 ${
                                        message.sender === 'user' 
                                            ? 'bg-blue-500 text-white rounded-br-none' 
                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    <p>{message.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 p-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full shadow-sm hover:bg-blue-200 active:bg-blue-300"
                                    onClick={(e) => handleSubmit(e, suggestion)}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="flex space-x-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask me anything about campus..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="!bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || !inputValue.trim()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <footer className="bg-white/80 backdrop-blur-md py-4 px-6 border-t border-gray-200 absolute bottom-0 w-full">
                <div className="max-w-6xl mx-auto flex flex-col justify-center md:flex-row justify-between items-center">
                <p className="text-gray-600 text-sm mb-2 md:mb-0">
                    © {new Date().getFullYear()} Campus Compass . All rights reserved.
                </p>
                
                </div>
            </footer>
        </div>
    );
};

export default SmartBot;
