import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit, Trash2, Eye, BarChart3 } from 'lucide-react';

const Games = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('https://api.rollix777.com/api/games/allgames');
        setGames(response.data); // Assuming the API returns an array of games
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Debugging: Log the games and filter
  console.log('Games:', games);
  console.log('Category Filter:', categoryFilter);

  const filteredGames = categoryFilter === 'all' 
    ? games 
    : games.filter(g => g.type.toLowerCase() === categoryFilter.toLowerCase());

  // filtered games
  console.log('Filtered Games:', filteredGames);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'inactive':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Games</h1>
        <button className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={18} />
          <span>Add Game</span>
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search games..."
            className="w-full py-2 pl-10 pr-4 bg-[#252547] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setCategoryFilter('all')}
            className={`py-2 px-4 rounded-lg text-white transition-colors whitespace-nowrap ${
              categoryFilter === 'all' 
                ? 'bg-purple-600' 
                : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setCategoryFilter('action')}
            className={`py-2 px-4 rounded-lg text-white transition-colors whitespace-nowrap ${
              categoryFilter === 'action' 
                ? 'bg-purple-600' 
                : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
            }`}
          >
            Action
          </button>
          <button 
            onClick={() => setCategoryFilter('racing')}
            className={`py-2 px-4 rounded-lg text-white transition-colors whitespace-nowrap ${
              categoryFilter === 'racing' 
                ? 'bg-purple-600' 
                : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
            }`}
          >
            Racing
          </button>
          <button 
            onClick={() => setCategoryFilter('adventure')}
            className={`py-2 px-4 rounded-lg text-white transition-colors whitespace-nowrap ${
              categoryFilter === 'adventure' 
                ? 'bg-purple-600' 
                : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
            }`}
          >
            Adventure
          </button>
          <button 
            onClick={() => setCategoryFilter('casino')}
            className={`py-2 px-4 rounded-lg text-white transition-colors whitespace-nowrap ${
              categoryFilter === 'casino' 
                ? 'bg-purple-600' 
                : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
            }`}
          >
            Casino
          </button>
          <button 
            onClick={() => setCategoryFilter('cards')}
            className={`py-2 px-4 rounded-lg text-white transition-colors whitespace-nowrap ${
              categoryFilter === 'cards' 
                ? 'bg-purple-600' 
                : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
            }`}
          >
            Cards
          </button>
        </div>
      </div>
      
      {/* Games Table */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-purple-500/10">
                <th className="py-4 px-6 font-medium">ID</th>
                <th className="py-4 px-6 font-medium">Name</th>
                <th className="py-4 px-6 font-medium">Category</th>
                <th className="py-4 px-6 font-medium">Plays</th>
                <th className="py-4 px-6 font-medium">Revenue</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game) => (
                <tr key={game.id} className="border-b border-purple-500/10 text-white hover:bg-purple-500/5">
                  <td className="py-4 px-6">#{game.id}</td>
                  <td className="py-4 px-6">{game.name}</td>
                  <td className="py-4 px-6">{game.type}</td>
                  <td className="py-4 px-6">{game.playing.toLocaleString()}</td>
                  <td className="py-4 px-6">{game.revenue||3400}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(game.status)}`}>
                      {game.status || "active"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                        <BarChart3 size={16} />
                      </button>
                      <button className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-purple-500/10 flex justify-between items-center">
          <p className="text-gray-400 text-sm">Showing 1-{filteredGames.length} of {games.length} games</p>
          <div className="flex gap-2">
            <button className="py-1 px-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-gray-400 hover:text-white transition-colors">
              Previous
            </button>
            <button className="py-1 px-3 bg-purple-500/20 border border-purple-500/20 rounded-lg text-white">
              1
            </button>
            <button className="py-1 px-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-gray-400 hover:text-white transition-colors">
              2
            </button>
            <button className="py-1 px-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-gray-400 hover:text-white transition-colors">
              3
            </button>
            <button className="py-1 px-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-gray-400 hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;