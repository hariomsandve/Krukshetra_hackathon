import React, { useState } from 'react';
import {
  MapPin,
  X,
  Layers,
  Compass,
  Building,
  Clock,
  Users,
  Search,
  ExternalLink,
  Send,
  Sparkles
} from 'lucide-react';

interface CampusMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicPrompt: string) => void;
}

interface LocationPin {
  id: string;
  name: string;
  category: string;
  code: string;
  coords: { x: number; y: number };
  status: 'Open' | 'Crowded' | 'Reserved';
  hours: string;
  capacity: string;
  description: string;
  equipment: string[];
}

const CAMPUS_LOCATIONS: LocationPin[] = [
  {
    id: 'cs_ai',
    name: 'CS & AI Engineering Complex',
    category: 'Academic & Labs',
    code: 'B-101',
    coords: { x: 30, y: 35 },
    status: 'Open',
    hours: '24/7 Access for Enrolled Students',
    capacity: '85% Occupancy',
    description: 'Primary computational facility hosting Monaco telemetry testbenches, Docker sandbox servers, and high-performance GPU nodes.',
    equipment: ['48x RTX 4090 GPU Cluster', 'Gigabit Isolated Sandbox LAN', 'MentOS Telemetry Monitors']
  },
  {
    id: 'library',
    name: 'Central Digital Academic Library',
    category: 'Study Center',
    code: 'L-204',
    coords: { x: 70, y: 30 },
    status: 'Open',
    hours: '8:00 AM - 11:00 PM',
    capacity: '42% Occupancy',
    description: 'Digital research archives, thesis databases, quiet study carrels, and direct access to institutional Moodle repositories.',
    equipment: ['IEEE & ACM Digital Subscriptions', 'Acoustic Study Booths', 'High-Speed Scanner Pods']
  },
  {
    id: 'robotics',
    name: 'Advanced Robotics & IoT Lab',
    category: 'Specialized Lab',
    code: 'R-302',
    coords: { x: 25, y: 75 },
    status: 'Reserved',
    hours: '9:00 AM - 7:00 PM',
    capacity: 'Reserved for Lab Practicum',
    description: 'Hardware microcontroller testbenches, FPGA boards, ROS2 simulation machines, and low-latency motor telemetry workstations.',
    equipment: ['ARM Cortex Development Kits', 'Logic Analyzers & Oscilloscopes', 'Industrial Robotic Arms']
  },
  {
    id: 'hack_arena',
    name: 'Innovation & Hackathon Arena',
    category: 'Collaboration',
    code: 'H-001',
    coords: { x: 65, y: 70 },
    status: 'Open',
    hours: '24 Hours during Hackathons',
    capacity: '60% Occupancy',
    description: 'Collaborative war-rooms, rapid prototyping tables, video demo projection setups, and MentOS AI pairing terminals.',
    equipment: ['Dual 4K Projectors', 'Whiteboard Wall Enclosures', 'High-Throughput Power Pods']
  }
];

export function CampusMapModal({ isOpen, onClose, onSelectTopic }: CampusMapModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationPin>(CAMPUS_LOCATIONS[0]);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = CAMPUS_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.category.toLowerCase().includes(search.toLowerCase()) ||
      loc.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleAskAboutLocation = () => {
    onSelectTopic(
      `Tell me about ${selectedLocation.name} (${selectedLocation.code}): Available equipment, lab schedules, and coursework guidelines.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#dedcd5] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#ecebe7] bg-[#faf9f5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-2xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1f1f1f]">Campus & Lab Navigator</div>
              <div className="text-[11px] text-[#71717a]">Interactive university facilities & compute clusters</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-200/60 text-neutral-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-[#ecebe7] bg-[#fcfbf9] flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search labs, departments, or facilities..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#dedcd5] bg-white text-xs text-[#1f1f1f] focus:outline-none focus:ring-1 focus:ring-neutral-400 placeholder-[#888681]"
            />
          </div>
        </div>

        {/* Main Body: Map Visualizer on Left, Detail Card on Right */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* Interactive Graphical Map Representation */}
          <div className="flex-1 bg-[#f4f3ee] relative flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-[#ecebe7] overflow-hidden">
            {/* Campus Map Blueprint Background */}
            <div className="absolute inset-4 rounded-xl border-2 border-dashed border-[#dedcd5] bg-[#ece9e1]/60 flex items-center justify-center overflow-hidden">
              {/* Radial grid */}
              <div
                className="w-full h-full opacity-30"
                style={{
                  backgroundImage: 'radial-gradient(#a8a29e 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Connecting Pathway Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="30%" y1="35%" x2="70%" y2="30%" stroke="#d6d3d1" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="30%" y1="35%" x2="25%" y2="75%" stroke="#d6d3d1" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="70%" y1="30%" x2="65%" y2="70%" stroke="#d6d3d1" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="25%" y1="75%" x2="65%" y2="70%" stroke="#d6d3d1" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              {/* Location Markers */}
              {CAMPUS_LOCATIONS.map((loc) => {
                const isSelected = selectedLocation.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl flex flex-col items-center group transition-transform cursor-pointer ${
                      isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                        isSelected
                          ? 'bg-neutral-900 text-white ring-4 ring-neutral-900/20'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-[#dedcd5]'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                    </div>
                    <span
                      className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap ${
                        isSelected
                          ? 'bg-neutral-900 text-white'
                          : 'bg-white/90 text-neutral-800 border border-[#dedcd5]'
                      }`}
                    >
                      {loc.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Info Sidebar */}
          <div className="w-full sm:w-80 flex flex-col bg-white overflow-y-auto no-scrollbar p-4 space-y-3.5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                  {selectedLocation.code} • {selectedLocation.category}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    selectedLocation.status === 'Open'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedLocation.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-900 mt-1">{selectedLocation.name}</h3>
              <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                {selectedLocation.description}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#ecebe7]">
                <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Hours</span>
                </div>
                <div className="font-semibold text-neutral-800 text-[11px] mt-0.5">{selectedLocation.hours}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#ecebe7]">
                <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Telemetry</span>
                </div>
                <div className="font-semibold text-neutral-800 text-[11px] mt-0.5">{selectedLocation.capacity}</div>
              </div>
            </div>

            {/* Available Equipment */}
            <div>
              <div className="text-[11px] font-bold text-neutral-700 mb-1.5">Available Hardware & Facilities</div>
              <ul className="space-y-1">
                {selectedLocation.equipment.map((eq, i) => (
                  <li key={i} className="text-xs text-neutral-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Action */}
            <div className="pt-2 mt-auto">
              <button
                onClick={handleAskAboutLocation}
                className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask MentOS About This Facility</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
