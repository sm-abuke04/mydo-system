import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 1. IMPORT YOUR MODAL
import BarangayOfficialsModal from './BarangayOfficialsModal'; 

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

const MapView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 2. ADD THESE MISSING STATES
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3. ADD THIS MISSING FUNCTION
  const handleViewProfile = (barangay) => {
    setSelectedBarangay(barangay);
    setIsModalOpen(true);
  };

  const catarmanPosition = [12.5000, 124.6350];

  // --- BARANGAY DATA (IDs 1-55) ---
  const barangays = [
    // 1. UNIVERSITY ZONE
    { id: 1, name: "UEP Zone 1", lat: 12.5096, lng: 124.6674, category: "University" },
    { id: 2, name: "UEP Zone 2", lat: 12.512211, lng: 124.662899, category: "University" },
    { id: 3, name: "UEP Zone 3", lat: 12.510172, lng: 124.661140, category: "University" },

    // 2. COASTAL AREAS
    { id: 4, name: "Baybay", lat: 12.5056, lng: 124.6412, category: "Coastal" },
    { id: 5, name: "Cawayan", lat: 12.513461, lng: 124.656283, category: "Coastal" },
    { id: 6, name: "Bangkerohan", lat: 12.498701, lng: 124.646390, category: "Coastal" },

    // 3. POBLACION (As listed)
    { id: 7, name: "Acacia", lat: 12.501479, lng: 124.636767, category: "Poblacion" },
    { id: 8, name: "Airport Village", lat: 12.5020, lng: 124.6390, category: "Poblacion" },
    { id: 9, name: "Calachuchi", lat: 12.499774, lng: 124.634334, category: "Poblacion" },
    { id: 10, name: "Casoy", lat: 12.499492, lng: 124.641980, category: "Poblacion" },
    { id: 11, name: "Dalakit", lat: 12.504496, lng: 124.632622, category: "Poblacion" },
    { id: 12, name: "Ipil-ipil", lat: 12.494551, lng: 124.642506, category: "Poblacion" },
    { id: 13, name: "Jose Abad Santos", lat: 12.501900, lng: 124.641469, category: "Poblacion" },
    { id: 14, name: "Jose P. Rizal", lat: 12.499494, lng: 124.639151, category: "Poblacion" },
    { id: 15, name: "Lapu-Lapu", lat: 12.499531, lng: 124.640714, category: "Poblacion" },
    { id: 16, name: "Mabolo", lat: 12.498126, lng: 124.640649, category: "Poblacion" },
    { id: 17, name: "Molave", lat: 12.495591, lng: 124.631422, category: "Poblacion" },
    { id: 18, name: "Narra", lat: 12.495746, lng: 124.641067, category: "Poblacion" },
    { id: 19, name: "Sampaguita", lat: 12.5005, lng: 124.6385, category: "Poblacion" },
    { id: 20, name: "Santol", lat: 12.498168, lng: 124.639083, category: "Poblacion" },
    { id: 21, name: "Talisay", lat: 12.503351, lng: 124.640179, category: "Poblacion" },
    { id: 22, name: "Yakal", lat: 12.496310, lng: 124.638583, category: "Poblacion" },

    // 4. RURAL BARANGAYS (Remaining)
    { id: 23, name: "Aguinaldo", lat: 12.435772, lng: 124.647179, category: "Rural" },
    { id: 24, name: "Bocsol", lat: 12.454541, lng: 124.564847, category: "Rural" },
    { id: 25, name: "Cabayhan", lat: 12.470950, lng: 124.580654, category: "Rural" },
    { id: 26, name: "Cag-abaca", lat: 12.414370, lng: 124.611631, category: "Rural" },
    { id: 27, name: "Cal-igang", lat: 12.448794, lng: 124.615098, category: "Rural" },
    { id: 28, name: "Cervantes", lat: 12.369378, lng: 124.659436, category: "Rural" },
    { id: 29, name: "Cularima", lat: 12.405281, lng: 124.597849, category: "Rural" },
    { id: 30, name: "Daganas", lat: 12.506416, lng: 124.612482, category: "Rural" },
    { id: 31, name: "Doña Pulqueria", lat: 12.483872, lng: 124.662328, category: "Rural" },
    { id: 32, name: "Galutan", lat: 12.4760, lng: 124.6730, category: "Rural" },
    { id: 33, name: "Gebalagnan", lat: 12.377458, lng: 124.681621, category: "Rural" },
    { id: 34, name: "Gebulwangan", lat: 12.372054, lng: 124.593775, category: "Rural" },
    { id: 35, name: "General Malvar", lat: 12.408642, lng: 124.562052, category: "Rural" },
    { id: 36, name: "Guba", lat: 12.429324, lng: 124.556714, category: "Rural" },
    { id: 37, name: "Hinatad", lat: 12.4710, lng: 124.6810, category: "Rural" },
    { id: 38, name: "Imelda", lat: 12.487471, lng: 124.698068, category: "Rural" },
    { id: 39, name: "Liberty", lat: 12.362598, lng: 124.622957, category: "Rural" },
    { id: 40, name: "Libjo", lat: 12.490044, lng: 124.603626, category: "Rural" },
    { id: 41, name: "Mabini", lat: 12.333333, lng: 124.556337, category: "Rural" },
    { id: 42, name: "Macagtas", lat: 12.486169, lng: 124.636973, category: "Rural" },
    { id: 43, name: "Mckinley", lat: 12.455009, lng: 124.682295, category: "Rural" },
    { id: 44, name: "New Rizal", lat: 12.452300, lng: 124.599328, category: "Rural" },
    { id: 45, name: "Old Rizal", lat: 12.509285, lng: 124.591380, category: "Rural" },
    { id: 46, name: "Patacua", lat: 12.388025535029696, lng: 124.57983062454879, category: "Rural" },
    { id: 47, name: "Polangi", lat: 12.399106, lng: 124.629924, category: "Rural" },
    { id: 48, name: "Quezon", lat: 12.363852, lng: 124.568455, category: "Rural" },
    { id: 49, name: "Salvacion", lat: 12.447055, lng: 124.569704, category: "Rural" },
    { id: 50, name: "San Julian", lat: 12.429959, lng: 124.574119, category: "Rural" },
    { id: 51, name: "San Pascual", lat: 12.381308, lng: 124.554640, category: "Rural" },
    { id: 52, name: "Somoge", lat: 12.4160, lng: 124.6230, category: "Rural" },
    { id: 53, name: "Tinowaran", lat: 12.439099, lng: 124.660541, category: "Rural" },
    { id: 54, name: "Trangue", lat: 12.354624, lng: 124.555706, category: "Rural" },
    { id: 55, name: "Washington", lat: 12.460735, lng: 124.643744, category: "Rural" },
  ];

  const filteredBarangays = barangays.filter(brgy =>
    brgy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 h-full shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0D2440]">Municipality Map</h1>
          <p className="text-sm text-[#7BA4D0]">Catarman, Northern Samar • Barangay Geotagging</p>
        </div>

        {/* SEARCH BAR & BADGE */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7BA4D0] group-focus-within:text-[#0D2440] transition-colors" />
            <input
              type="text"
              placeholder="Find Barangay..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#0D2440] placeholder-[#7BA4D0]/60 outline-none focus:ring-2 focus:ring-[#0D2440]/10 w-64 transition-all"
            />
          </div>

          <span className="bg-emerald-50 text-emerald-600 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-100">
            {filteredBarangays.length} / {barangays.length} Visible
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative z-0">
        <MapContainer
          center={catarmanPosition}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredBarangays.map((brgy) => (
            <Marker key={brgy.id} position={[brgy.lat, brgy.lng]}>
              <Popup>
                <div className="p-1 min-w-[120px]">
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${
                    brgy.category === 'Poblacion' ? 'text-amber-500' :
                    brgy.category === 'University' ? 'text-purple-500' :
                    brgy.category === 'Coastal' ? 'text-blue-500' : 'text-emerald-500'
                  }`}>
                    {brgy.category}
                  </span>
                  <h3 className="font-black text-[#0D2440] text-sm mb-1">{brgy.name}</h3>
                  <p className="text-[10px] text-gray-400">Lat: {brgy.lat.toFixed(4)}</p>
                  
                  {/* BUTTON TRIGGER */}
                  <button 
                    onClick={() => handleViewProfile(brgy)}
                    className="mt-2 w-full bg-[#0D2440] text-white text-[10px] font-bold py-1.5 rounded hover:bg-[#1a3b5e] transition-colors"
                  >
                    VIEW PROFILE
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* MODAL COMPONENT */}
      <BarangayOfficialsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        barangay={selectedBarangay} 
      />
      
    </div>
  );
};

export default MapView;