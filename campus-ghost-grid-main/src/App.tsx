import React, { useState } from 'react';

interface StudySpot {
  id: number;
  name: string;
  zone: string;
  quietScore: number;
  outlets: 'Abundant' | 'Moderate' | 'Scarce';
  occupancy: number; // percentage
  status: 'Quiet Zone' | 'Discussion Hub' | 'Computer Lab';
  image: string;
  tags: string[];
  coordinates: { x: number; y: number };
}

const INITIAL_SPOTS: StudySpot[] = [
  {
    id: 1,
    name: "Central Library - 3rd Floor Quiet Wing",
    zone: "Academic Block A",
    quietScore: 9.5,
    outlets: "Abundant",
    occupancy: 65,
    status: "Quiet Zone",
    image: "📚",
    tags: ["AC", "Silent", "Desks"],
    coordinates: { x: 25, y: 30 }
  },
  {
    id: 2,
    name: "ECE Department Reading Room",
    zone: "Tech Block B",
    quietScore: 8.0,
    outlets: "Abundant",
    occupancy: 40,
    status: "Quiet Zone",
    image: "⚡",
    tags: ["Lab Access", "Power Sockets"],
    coordinates: { x: 70, y: 25 }
  },
  {
    id: 3,
    name: "Student Activity Center (SAC) Lounge",
    zone: "Central Campus",
    quietScore: 4.0,
    outlets: "Moderate",
    occupancy: 85,
    status: "Discussion Hub",
    image: "☕",
    tags: ["Collaborative", "Vibrant"],
    coordinates: { x: 50, y: 60 }
  },
  {
    id: 4,
    name: "Computer Center - Lab 4",
    zone: "IT Block",
    quietScore: 7.5,
    outlets: "Abundant",
    occupancy: 30,
    status: "Computer Lab",
    image: "💻",
    tags: ["Workstations", "Printing"],
    coordinates: { x: 80, y: 75 }
  }
];

export default function App() {
  const [spots, setSpots] = useState<StudySpot[]>(INITIAL_SPOTS);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [checkInModal, setCheckInModal] = useState<boolean>(false);
  const [selectedSpot, setSelectedSpot] = useState<StudySpot | null>(null);

  const [reportedOccupancy, setReportedOccupancy] = useState<number>(50);
  const [reportedOutlets, setReportedOutlets] = useState<'Abundant' | 'Moderate' | 'Scarce'>("Abundant");

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpot) return;

    setSpots(spots.map(s => {
      if (s.id === selectedSpot.id) {
        return {
          ...s,
          occupancy: Number(reportedOccupancy),
          outlets: reportedOutlets
        };
      }
      return s;
    }));

    setCheckInModal(false);
    alert("Spot status updated successfully! Ghost Grid map refreshed.");
  };

  const filteredSpots = spots.filter(s => {
    const matchesFilter = filter === "All" || s.status === filter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <header className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 mb-8 flex flex-wrap justify-between items-center gap-4 border border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30">
              ⚡
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-300">
                Campus Ghost Grid
              </h1>
              <p className="text-xs text-slate-400">Live Study Spot, Crowd Density & Outlet Tracker</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}>
                🗂️ Grid Feed
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'map' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}>
                🗺️ Campus Map
              </button>
            </div>
          </div>
        </header>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
          <div className="relative w-full md:w-80">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search library, labs, or zones..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {["All", "Quiet Zone", "Computer Lab", "Discussion Hub"].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  filter === cat 
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/25' 
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* CONDITIONAL VIEW: MAP OR GRID */}
        {viewMode === 'map' ? (
          <div className="relative w-full h-[500px] bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-45 pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-center bg-slate-950/80 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-cyan-300">📍 Campus Live Radar Map</h3>
                <p className="text-[10px] text-slate-400">Click any pulsing beacon to inspect or update occupancy</p>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Under 50% Full</span>
                <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> 50-75% Full</span>
                <span className="flex items-center gap-1.5 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Over 75% Full</span>
              </div>
            </div>

            <div className="relative w-full h-full my-auto">
              {filteredSpots.map(spot => (
                <div 
                  key={spot.id}
                  onClick={() => { setSelectedSpot(spot); setReportedOccupancy(spot.occupancy); setCheckInModal(true); }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${spot.coordinates.x}%`, top: `${spot.coordinates.y}%` }}>
                  
                  <span className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${
                    spot.occupancy > 75 ? 'bg-rose-500' : spot.occupancy > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}></span>

                  <div className="relative bg-slate-950 border border-slate-700 hover:border-cyan-400 px-3 py-2 rounded-xl shadow-xl flex items-center gap-2 transition transform group-hover:scale-105">
                    <span className="text-lg">{spot.image}</span>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-100 whitespace-nowrap">{spot.name.split('-')[0]}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>👥 {spot.occupancy}%</span>
                        <span className="text-cyan-400">⚡ {spot.outlets}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 text-center text-[11px] text-slate-400 bg-slate-950/60 py-2 rounded-xl border border-slate-900">
              Interactive Zoning Grid • Updated via peer check-ins in real-time
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSpots.map(spot => (
              <div key={spot.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 rounded-xl bg-slate-800 border border-slate-700/50">
                        {spot.image}
                      </span>
                      <div>
                        <h3 className="font-semibold text-base text-slate-100">{spot.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">📍 {spot.zone}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Quiet Score: {spot.quietScore}/10
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Crowd Occupancy</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${spot.occupancy > 75 ? 'bg-rose-500' : spot.occupancy > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${spot.occupancy}%` }}>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-200">{spot.occupancy}%</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 mb-1">Power Outlets</div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-block ${
                        spot.outlets === 'Abundant' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        spot.outlets === 'Moderate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {spot.outlets} Sockets
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {spot.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Type: <strong className="text-slate-200">{spot.status}</strong>
                  </span>
                  <button
                    onClick={() => { setSelectedSpot(spot); setReportedOccupancy(spot.occupancy); setCheckInModal(true); }}
                    className="bg-slate-800 hover:bg-cyan-600 hover:text-white border border-slate-700 text-cyan-300 text-xs font-medium px-4 py-2 rounded-xl transition flex items-center gap-1.5">
                    📝 Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Update Modal */}
        {checkInModal && selectedSpot && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-base font-bold text-slate-100 mb-1">Update Ghost Grid Status</h3>
              <p className="text-xs text-slate-400 mb-4">{selectedSpot.name}</p>

              <form onSubmit={handleCheckInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Occupancy (%)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={reportedOccupancy}
                    onChange={e => setReportedOccupancy(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Power Outlet Availability</label>
                  <select 
                    value={reportedOutlets}
                    onChange={e => setReportedOutlets(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500">
                    <option value="Abundant">Abundant (Sockets everywhere)</option>
                    <option value="Moderate">Moderate (Few available)</option>
                    <option value="Scarce">Scarce (All taken)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setCheckInModal(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 rounded-xl transition">
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow-lg shadow-cyan-500/25">
                    Broadcast Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}