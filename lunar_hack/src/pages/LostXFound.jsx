import React, { useState } from 'react';
import { FiSearch, FiCamera, FiMapPin, FiCalendar, FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';
const LostAndFound = () => {
  const [activeTab, setActiveTab] = useState('lost');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Lost item search form
  const [description, setDescription] = useState('');
  
  // Found item report form
  const [itemImage, setItemImage] = useState(null);
  const [foundLocation, setFoundLocation] = useState('');
  const [foundDate, setFoundDate] = useState('');
  const [foundDescription, setFoundDescription] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  
  // Mock function to simulate backend search
  const searchLostItems = async (query) => {
    setIsLoading(true);
  try {
    const response = await fetch('http://localhost:5000/get_lost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: query }),
    });

    const data = await response.json();
    console.log('Matched Items:', data);

    setSearchResults(data.map((item, index) => {
      const fixedPath = item.image_url.startsWith('.') 
        ? item.image_url.slice(1) 
        : item.image_url;
    
      return {
        id: index,
        name: "Item Found",
        description: item.description,
        date: item.date_found,
        image: `../../../../../ATIA_LunarHack/backend_flask${fixedPath.replace(/\\/g, '/')}`,
        contact: item.reporter_email
      };
    }));
    console.log('Search results:', searchResults);
  } catch (error) {
    console.error("Search failed", error);
  }
  setIsLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItemImage(file);
      setPreviewImage(URL.createObjectURL(file));
      console.log('Image selected:', URL.createObjectURL(file));
    }
  };

  const submitFoundItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append('image', itemImage);
      formData.append('date', foundDate);
      formData.append('id', sessionStorage.getItem('userDetails'));
  
      const response = await fetch('http://localhost:5000/report_lost', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log('Upload success:', data);
  
      alert('Thank you! Your found item report has been submitted.');
      setItemImage(null);
      setPreviewImage(null);
      setFoundLocation('');
      setFoundDate('');
      setFoundDescription('');
    } catch (error) {
      console.error("Upload failed", error);
      alert("Something went wrong. Please try again.");
    }
  
    setIsLoading(false);
  };
  

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-200">
            {/* Navigation - Same as LandingPage */}
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

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Lost & Found</h1>
        <p className="text-gray-600 text-center mb-8">Report lost items or submit found items to help others</p>
        
        {/* Tab Navigation */}
        <div className="flex justify-center gap-8 border-b border-gray-200 mb-8">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'lost' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('lost')}
          >
            <FiSearch className="inline mr-2" />
            Search Lost Items
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'found' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('found')}
          >
            <FiCamera className="inline mr-2" />
            Report Found Item
          </button>
        </div>
        
        {/* Lost Items Search Interface */}
        {activeTab === 'lost' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Search for Lost Items</h2>
              <p className="text-gray-600 mb-4">Describe the item you lost to check if it's been found</p>
              
              <div className="flex gap-4">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your lost item (e.g. 'black wallet with ID card')"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => searchLostItems(description)}
                  disabled={!description.trim() || isLoading}
                  className="!bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
            
            {/* Search Results */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Possible matches:</h3>
                <div className="space-y-4">
                  {searchResults.map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.description} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-800">{item.name}</h4>
                          <p className="text-gray-600 mb-2">{item.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 text-sm">
                            {/* <div className="flex items-center text-gray-500">
                              <FiMapPin className="mr-2" />
                              Found at: {item.location}
                            </div> */}
                            <div className="flex items-center text-gray-500">
                              <FiCalendar className="mr-2" />
                              Date found: {item.date}
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm font-medium">Contact: <span className="text-blue-600">{item.contact}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : description && !isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <FiInfo className="mx-auto text-4xl mb-2" />
                <p>No matching items found. Check back later or report your lost item to security.</p>
              </div>
            ) : null}
          </div>
        )}
        
        {/* Found Items Report Interface */}
        {activeTab === 'found' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Report Found Item</h2>
            <p className="text-gray-600 mb-6">Help return lost items by submitting information about what you found</p>
            
            <form onSubmit={submitFoundItem}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Photo</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiCamera className="text-3xl text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload photo</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        required
                      />
                    </label>
                  </div>
                </div>
                
                {/* Form Fields */}
                <div className="space-y-8">
                  <div className='h-8'></div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiMapPin className="inline mr-2" />
                      Where did you find it?
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={foundLocation}
                      onChange={(e) => setFoundLocation(e.target.value)}
                      placeholder="Building, room number, or specific location"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiCalendar className="inline mr-2" />
                      When did you find it?
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={foundDate}
                      onChange={(e) => setFoundDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !itemImage || !foundLocation || !foundDate}
                  className="!bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Submit Found Item'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostAndFound;