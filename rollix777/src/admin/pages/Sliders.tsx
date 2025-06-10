import React, { useState } from 'react';
import { Plus, Edit, Trash2, MoveUp, MoveDown } from 'lucide-react';

const Sliders = () => {
  // Dummy data
  const slides = [
    {
      id: 1,
      title: "Win Big Today",
      description: "Join our exclusive tournament",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop",
      active: true
    },
    {
      id: 2,
      title: "Daily Rewards",
      description: "Claim your bonus every day",
      image: "https://images.unsplash.com/photo-1642479755415-2c4f6c6a8c8f?w=800&h=400&fit=crop",
      active: true
    },
    {
      id: 3,
      title: "VIP Program",
      description: "Exclusive benefits for members",
      image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=400&fit=crop",
      active: false
    },
    {
      id: 4,
      title: "New Games Added",
      description: "Check out our latest additions",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop",
      active: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Sliders</h1>
        <button className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={18} />
          <span>Add Slide</span>
        </button>
      </div>
      
      {/* Slides List */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="p-4 border-b border-purple-500/10">
          <h2 className="text-xl font-bold text-white">Homepage Slider</h2>
        </div>
        
        <div className="p-6 space-y-4">
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`bg-[#1A1A2E] rounded-lg border ${slide.active ? 'border-purple-500/20' : 'border-gray-700/20'} overflow-hidden`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto">
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 md:w-2/3 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{slide.title}</h3>
                      <p className="text-gray-400 mt-1">{slide.description}</p>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          slide.active 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {slide.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      ID: {slide.id}
                    </div>
                    <div className="flex gap-2">
                      {index > 0 && (
                        <button className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                          <MoveUp size={16} />
                        </button>
                      )}
                      {index < slides.length - 1 && (
                        <button className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                          <MoveDown size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sliders;