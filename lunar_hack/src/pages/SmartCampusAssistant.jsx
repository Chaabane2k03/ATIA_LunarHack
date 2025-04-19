import React, { useState } from 'react';

const SmartCampusAssistant = () => {
  const [activeTab, setActiveTab] = useState('navigation');
  const [chatMessages, setChatMessages] = useState([
    { text: 'Hello! How can I help you today?', sender: 'bot' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [newItem, setNewItem] = useState({ type: 'lost', description: '', image: null });
  const [mapFocus, setMapFocus] = useState(null);

  // Sample data
  const campusLocations = [
    { id: 'lib', name: 'Library', x: 120, y: 80 },
    { id: 'admin', name: 'Administration', x: 250, y: 120 },
    { id: 'cs', name: 'Computer Science', x: 180, y: 200 },
    { id: 'cafe', name: 'Campus Café', x: 300, y: 180 },
  ];

  const lostItems = [
    { id: 1, description: 'Black laptop with sticker', date: '2023-05-10', image: 'https://via.placeholder.com/100?text=Laptop' },
    { id: 2, description: 'Blue water bottle', date: '2023-05-12', image: 'https://via.placeholder.com/100?text=Bottle' }
  ];

  const foundItems = [
    { id: 1, description: 'Set of keys with keychain', date: '2023-05-15', image: 'https://via.placeholder.com/100?text=Keys' },
    { id: 2, description: 'Wireless headphones', date: '2023-05-16', image: 'https://via.placeholder.com/100?text=Headphones' }
  ];

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message
    setChatMessages([...chatMessages, { text: userInput, sender: 'user' }]);
    setUserInput('');
    
    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        text: "I'm a simple bot that would respond to your queries in a real implementation.", 
        sender: 'bot' 
      }]);
    }, 500);
  };

  const handleLocationClick = (location) => {
    setMapFocus(location.id);
    setChatMessages([
      ...chatMessages,
      { text: `Where is the ${location.name}?`, sender: 'user' },
      { text: `The ${location.name} is located at coordinates (${location.x}, ${location.y}) on the map.`, sender: 'bot' }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Smart Campus Assistant</h1>
      </header>

      {/* Tabs */}
      <div className="flex bg-white shadow-sm">
        <button
          className={`flex-1 py-3 font-medium ${activeTab === 'navigation' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('navigation')}
        >
          Campus Navigation
        </button>
        <button
          className={`flex-1 py-3 font-medium ${activeTab === 'lostfound' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('lostfound')}
        >
          Lost & Found
        </button>
      </div>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {activeTab === 'navigation' ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Map Section */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Campus Map</h2>
              <div className="relative bg-blue-50 rounded-md h-64 md:h-96">
                {/* Simple representation of a map */}
                {campusLocations.map(location => (
                  <div
                    key={location.id}
                    className={`absolute w-16 h-12 flex items-center justify-center text-xs text-center rounded cursor-pointer transition-all ${mapFocus === location.id ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}
                    style={{ left: `${location.x}px`, top: `${location.y}px` }}
                    onClick={() => handleLocationClick(location)}
                  >
                    {location.name}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Locations</h3>
                <ul className="space-y-1">
                  {campusLocations.map(location => (
                    <li
                      key={location.id}
                      className={`px-3 py-1 rounded cursor-pointer ${mapFocus === location.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                      onClick={() => handleLocationClick(location)}
                    >
                      {location.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Chat Section */}
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Campus Assistant</h2>
              </div>
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.sender === 'user' ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-gray-200 text-gray-800'}`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about campus locations..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Lost & Found Form */}
            <div className="md:w-1/3 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Report {newItem.type === 'lost' ? 'Lost' : 'Found'} Item
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={newItem.type === 'lost'}
                      onChange={() => setNewItem({...newItem, type: 'lost'})}
                      className="text-blue-600"
                    />
                    <span>I lost an item</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={newItem.type === 'found'}
                      onChange={() => setNewItem({...newItem, type: 'found'})}
                      className="text-blue-600"
                    />
                    <span>I found an item</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder={`Describe the item you ${newItem.type === 'lost' ? 'lost' : 'found'}...`}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-gray-500">Click to upload or drag and drop</p>
                  </div>
                </div>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Submit
                </button>
              </div>
            </div>

            {/* Lost & Found Lists */}
            <div className="md:w-2/3 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Lost Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lostItems.map(item => (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <img 
                        src={item.image} 
                        alt={item.description} 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">Reported: {item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Found Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {foundItems.map(item => (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <img 
                        src={item.image} 
                        alt={item.description} 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">Found: {item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SmartCampusAssistant;