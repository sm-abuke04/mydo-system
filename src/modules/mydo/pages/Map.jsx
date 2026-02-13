import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BarangayOfficialsModal from '../components/BarangayOfficialsModal'; 
import { supabase } from '@/lib/supabase';
import { BARANGAYS } from '../data/Barangays';

// --- LEAFLET ICON FIX ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons for Active vs Inactive
const ActiveIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const InactiveIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const Map = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [barangays, setBarangays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH BARANGAYS & STATUS
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setIsLoading(true);
        // Fetch active SK users
        const { data: skUsers, error } = await supabase
            .from('users')
            .select('first_name, last_name, barangay, status')
            .eq('status', 'Active')
            .in('role', ['SK_CHAIR', 'SK_SEC']);

        if (error) throw error;

        // Merge with coordinates
        const merged = BARANGAYS.map(staticBrgy => {
            const activeSK = skUsers?.find(u => u.barangay === staticBrgy.name);
            return {
                ...staticBrgy,
                status: activeSK ? 'Active' : 'No Access',
                skOfficial: activeSK ? `${activeSK.first_name} ${activeSK.last_name}` : 'N/A'
            };
        });
        setBarangays(merged);
      } catch (error) {
        console.error("Failed to load map data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMapData();
  }, []);

  const handleViewProfile = (barangay) => {
    setSelectedBarangay(barangay);
    setIsModalOpen(true);
  };

  const catarmanPosition = [12.5000, 124.6350];

  const filteredBarangays = barangays.filter(brgy =>
    brgy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-8 h-full shadow-sm flex flex-col transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0D2440] dark:text-white">Municipality Map</h1>
          <p className="text-sm text-[#7BA4D0] dark:text-slate-400">Catarman, Northern Samar • Barangay Geotagging</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7BA4D0]" />
            <input
              type="text"
              placeholder="Find Barangay..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold w-64 outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <span className="bg-emerald-50 text-emerald-600 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-100">
            {filteredBarangays.length} / {barangays.length} Visible
          </span>
        </div>
      </div>

      {/* MAP CONTAINER */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-inner relative z-0">
        {isLoading ? (
             <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-slate-800">
                <Loader2 className="animate-spin text-blue-600" size={40} />
             </div>
        ) : (
            <MapContainer center={catarmanPosition} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {filteredBarangays.map((brgy) => (
                <Marker
                    key={brgy.id}
                    position={[brgy.lat, brgy.lng]}
                    icon={brgy.status === 'Active' ? ActiveIcon : InactiveIcon}
                >
                    <Popup>
                        <div className="p-1 min-w-30">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${
                            brgy.category === 'Poblacion' ? 'text-amber-500' :
                            brgy.category === 'University' ? 'text-purple-500' :
                            brgy.category === 'Coastal' ? 'text-blue-500' : 'text-emerald-500'
                        }`}>{brgy.category}</span>
                        <h3 className="font-black text-[#0D2440] text-sm mb-1">{brgy.name}</h3>

                        {brgy.status === 'Active' ? (
                            <div className="mt-1">
                                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100 block w-fit">ACTIVE ACCESS</span>
                                <p className="text-[10px] text-gray-500 mt-1">Official: <span className="font-bold text-gray-700">{brgy.skOfficial}</span></p>
                                <button onClick={() => handleViewProfile(brgy)} className="mt-2 w-full bg-[#0D2440] text-white text-[10px] font-bold py-1.5 rounded hover:bg-[#1a3b5e] transition-colors">VIEW DETAILS</button>
                            </div>
                        ) : (
                            <div className="mt-1">
                                <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded border border-gray-200 block w-fit">NO ACCESS</span>
                            </div>
                        )}
                        </div>
                    </Popup>
                </Marker>
            ))}
            </MapContainer>
        )}
      </div>

      <BarangayOfficialsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} barangay={selectedBarangay} />
    </div>
  );
};

export default Map;