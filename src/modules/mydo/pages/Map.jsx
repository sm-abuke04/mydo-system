// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { Search } from 'lucide-react';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // FIXED IMPORT: Pointing to the components folder
// import BarangayOfficialsModal from '../components/BarangayOfficialsModal'; 

// // --- LEAFLET ICON FIX ---
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// let DefaultIcon = L.icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41]
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// const Map = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedBarangay, setSelectedBarangay] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleViewProfile = (barangay) => {
//     setSelectedBarangay(barangay);
//     setIsModalOpen(true);
//   };

//   const catarmanPosition = [12.5000, 124.6350];

//   // --- BARANGAY DATA (Shortened for brevity - keep your full list) ---
//   const barangays = [
//     { id: 1, name: "UEP Zone 1", lat: 12.5096, lng: 124.6674, category: "University" },
//     { id: 7, name: "Acacia", lat: 12.501479, lng: 124.636767, category: "Poblacion" },
//     { id: 4, name: "Baybay", lat: 12.5056, lng: 124.6412, category: "Coastal" },
//     { id: 45, name: "Old Rizal", lat: 12.509285, lng: 124.591380, category: "Rural" },
//     // ... (Paste your full barangays list here)
//   ];

//   const filteredBarangays = barangays.filter(brgy =>
//     brgy.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-8 h-full shadow-sm flex flex-col transition-colors duration-300">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-black text-[#0D2440] dark:text-white transition-colors">Municipality Map</h1>
//           <p className="text-sm text-[#7BA4D0] dark:text-slate-400 transition-colors">Catarman, Northern Samar • Barangay Geotagging</p>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="relative group">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7BA4D0] dark:text-slate-400 group-focus-within:text-[#0D2440] dark:group-focus-within:text-white transition-colors" />
//             <input
//               type="text"
//               placeholder="Find Barangay..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-[#0D2440] dark:text-white placeholder-[#7BA4D0]/60 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all"
//             />
//           </div>
//           <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-100 dark:border-emerald-800/50 transition-colors">
//             {filteredBarangays.length} / {barangays.length} Visible
//           </span>
//         </div>
//       </div>

//       <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-inner relative z-0 transition-colors duration-300 [&_.leaflet-layer]:dark:invert [&_.leaflet-layer]:dark:hue-rotate-180 [&_.leaflet-layer]:dark:brightness-95">
//         <MapContainer center={catarmanPosition} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
//           <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//           {filteredBarangays.map((brgy) => (
//             <Marker key={brgy.id} position={[brgy.lat, brgy.lng]}>
//               <Popup>
//                 <div className="p-1 min-w-30">
//                   <span className={`text-[9px] font-bold uppercase tracking-wider ${
//                     brgy.category === 'Poblacion' ? 'text-amber-500' :
//                     brgy.category === 'University' ? 'text-purple-500' :
//                     brgy.category === 'Coastal' ? 'text-blue-500' : 'text-emerald-500'
//                   }`}>{brgy.category}</span>
//                   <h3 className="font-black text-[#0D2440] text-sm mb-1">{brgy.name}</h3>
//                   <button onClick={() => handleViewProfile(brgy)} className="mt-2 w-full bg-[#0D2440] text-white text-[10px] font-bold py-1.5 rounded hover:bg-[#1a3b5e] transition-colors">VIEW PROFILE</button>
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       </div>

//       <BarangayOfficialsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} barangay={selectedBarangay} />
//     </div>
//   );
// };

// export default Map;

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BarangayOfficialsModal from '../components/BarangayOfficialsModal'; 
import { MydoService } from '../services/MYDOService';

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

const Map = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [barangays, setBarangays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH BARANGAYS (Real Data)
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setIsLoading(true);
        const data = await MydoService.getAllBarangays();
        setBarangays(data || []);
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
                // Assuming Database columns are 'lat' and 'lng' OR 'latitude' and 'longitude'
                // Add fallback to prevent crash if coordinates missing
                (brgy.lat && brgy.lng) && (
                    <Marker key={brgy.id} position={[brgy.lat, brgy.lng]}>
                    <Popup>
                        <div className="p-1 min-w-30">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${
                            brgy.category === 'Poblacion' ? 'text-amber-500' :
                            brgy.category === 'University' ? 'text-purple-500' :
                            brgy.category === 'Coastal' ? 'text-blue-500' : 'text-emerald-500'
                        }`}>{brgy.category}</span>
                        <h3 className="font-black text-[#0D2440] text-sm mb-1">{brgy.name}</h3>
                        <button onClick={() => handleViewProfile(brgy)} className="mt-2 w-full bg-[#0D2440] text-white text-[10px] font-bold py-1.5 rounded hover:bg-[#1a3b5e] transition-colors">VIEW PROFILE</button>
                        </div>
                    </Popup>
                    </Marker>
                )
            ))}
            </MapContainer>
        )}
      </div>

      <BarangayOfficialsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} barangay={selectedBarangay} />
    </div>
  );
};

export default Map;