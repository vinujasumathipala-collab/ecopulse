/**
 * EcoPulse - Comprehensive Waste Management and Recycling System
 * Implements Function 1, Function 2, Function 3, Function 4
 * Vanilla JavaScript ES6+
 * Clean State Architecture: User-driven data entry with complete CRUD operations.
 */

// =============================================================================
// 1. Storage Configuration & Initial Clean State
// =============================================================================
// 1. Storage Configuration & Initial State with RBAC Default Accounts
// =============================================================================
const STORAGE_KEY = 'ecopulse_colombo_v6';

// System Demonstration Accounts for instant testing of all roles
const DEFAULT_SYSTEM_ACCOUNTS = [
  {
    id: 'USR-101',
    name: 'Alex Mercer',
    email: 'resident@ecopulse.org',
    password: 'password123',
    role: 'User',
    zone: 'Colombo Fort',
    address: '12 Galle Road, Colombo 03',
    phone: '+94 77 234 9811',
    accountType: 'Residential Account',
    ecoPoints: 340,
    totalRecycledKg: 28.5,
    pickupsCompleted: 3,
    status: 'Active',
    registeredOn: '2026-01-12'
  },
  {
    id: 'USR-201',
    name: 'Kasun Wickramasinghe',
    email: 'leader@ecopulse.org',
    password: 'password123',
    role: 'Crew Leader',
    zone: 'Colombo Fort',
    address: 'Municipal Depot 4, Colombo',
    phone: '+94 77 123 4567',
    accountType: 'Operations Personnel',
    ecoPoints: 0,
    totalRecycledKg: 0,
    pickupsCompleted: 0,
    status: 'Active',
    registeredOn: '2026-02-01'
  },
  {
    id: 'USR-301',
    name: 'Sunil Perera',
    email: 'manager@ecopulse.org',
    password: 'password123',
    role: 'Manager',
    zone: 'Colombo Fort',
    address: 'GreenPoly Processing Hub, North',
    phone: '+94 11 254 9988',
    accountType: 'Center Manager',
    ecoPoints: 0,
    totalRecycledKg: 0,
    pickupsCompleted: 0,
    status: 'Active',
    registeredOn: '2026-01-15'
  },
  {
    id: 'USR-401',
    name: 'Chief Elena Rostova',
    email: 'admin@ecopulse.org',
    password: 'password123',
    role: 'Admin',
    zone: 'Colombo Fort',
    address: 'City Hall Operations Center',
    phone: '+94 11 900 1000',
    accountType: 'Municipal Administrator',
    ecoPoints: 0,
    totalRecycledKg: 0,
    pickupsCompleted: 0,
    status: 'Active',
    registeredOn: '2026-01-01'
  }
];

// 7 Official Municipal Zone Segregation & Recycling Centers (One Dedicated Center per Zone - Function 3)
const DEFAULT_RECYCLING_FACILITIES = [
  {
    id: 'FAC-FORT',
    name: 'GreenPoly Central MRF & Segregation Center',
    zone: 'Colombo Fort',
    type: 'Primary Segregation MRF & Polymer Recovery',
    location: 'Plot 42, Harbor Logistics Park, Colombo Fort',
    capacityTons: 180,
    currentLoadTons: 42,
    acceptedMaterials: ['PET & HDPE Plastics', 'Cardboard & Paper', 'Glass Bottles', 'Metal Cans'],
    contactPhone: '+94 11 254 9988',
    status: 'Certified Active'
  },
  {
    id: 'FAC-KOLL',
    name: 'EcoFiber Pulp & Segregation Recovery Hub',
    zone: 'Kollupitiya',
    type: 'Cardboard Baling, Pulp Recovery & Rigid Plastics',
    location: 'Yard 8, Marine Drive Logistics Zone, Kollupitiya',
    capacityTons: 200,
    currentLoadTons: 65,
    acceptedMaterials: ['Corrugated Cardboard', 'Office Paper', 'Cartons', 'Clean Plastics'],
    contactPhone: '+94 11 432 1100',
    status: 'Certified Active'
  },
  {
    id: 'FAC-BORE',
    name: 'Borella Municipal Resource Recovery & Segregation Center',
    zone: 'Borella',
    type: 'Multi-Stream Sort Line & Organic Composting Hub',
    location: 'Baseline Road Municipal Complex, Borella',
    capacityTons: 220,
    currentLoadTons: 58,
    acceptedMaterials: ['Organic Biomass', 'Plastics', 'Paper & Packaging', 'Scrap Metal'],
    contactPhone: '+94 11 267 8890',
    status: 'Certified Active'
  },
  {
    id: 'FAC-WELL',
    name: 'Wellawatte Coastal Segregation & Refinement Facility',
    zone: 'Wellawatte',
    type: 'Glass Cullet, High-Density Polymers & Metal Sorting',
    location: 'W.A. Silva Mawatha Processing Yard, Wellawatte',
    capacityTons: 150,
    currentLoadTons: 38,
    acceptedMaterials: ['Glass Bottles & Jars', 'Aluminum Cans', 'Scrap Steel', 'Rigid Plastics'],
    contactPhone: '+94 11 258 7766',
    status: 'Certified Active'
  },
  {
    id: 'FAC-DEHI',
    name: 'Dehiwala CleanStream Segregation Depot',
    zone: 'Dehiwala',
    type: 'Dry Recyclables & High-Density Polymers MRF',
    location: 'Station Road Municipal Depot, Dehiwala',
    capacityTons: 160,
    currentLoadTons: 40,
    acceptedMaterials: ['HDPE / PET Plastics', 'Cardboard Boxes', 'Tin Cans', 'Paper'],
    contactPhone: '+94 11 271 3344',
    status: 'Certified Active'
  },
  {
    id: 'FAC-KOTT',
    name: 'Sri Jayawardenepura Kotte EcoHub & Segregation Plant',
    zone: 'Kotte',
    type: 'Smart Sorting Facility, Biomass & E-Waste Processing',
    location: 'Parliament Road Green Logistics Corridor, Kotte',
    capacityTons: 190,
    currentLoadTons: 45,
    acceptedMaterials: ['E-Waste & Electronics', 'Organic Biomass', 'Plastics', 'Paper'],
    contactPhone: '+94 11 286 5500',
    status: 'Certified Active'
  },
  {
    id: 'FAC-NUGE',
    name: 'Nugegoda Metro Segregation & Circular Economy MRF',
    zone: 'Nugegoda',
    type: 'Mixed Recyclables Optical Sorting & Packaging Reclamation',
    location: 'High Level Road Resource Recovery Center, Nugegoda',
    capacityTons: 175,
    currentLoadTons: 50,
    acceptedMaterials: ['Mixed Recyclables', 'Plastics', 'Paper & Fiber', 'Glass & Metal'],
    contactPhone: '+94 11 282 1122',
    status: 'Certified Active'
  }
];

// Default initial state populated with demo accounts, sample crew and sample requests
const CLEAN_INITIAL_DATA = {
  activeRole: 'user',
  theme: 'light',
  isLoggedIn: false,
  currentUser: DEFAULT_SYSTEM_ACCOUNTS[0],
  userProfile: DEFAULT_SYSTEM_ACCOUNTS[0],
  users: DEFAULT_SYSTEM_ACCOUNTS,
  requests: [
    {
      id: 'REQ-4091',
      residentId: 'USR-101',
      residentName: 'Alex Mercer',
      address: '12 Galle Road, Colombo 03',
      zone: 'Colombo Fort',
      category: 'Plastic Recyclable',
      estimatedKg: 14,
      actualKg: null,
      date: '2026-10-15',
      timeSlot: 'Morning (08:00 - 12:00)',
      status: 'Assigned',
      assignedCrew: 'Crew #1 (Alpha Hauler)',
      notes: 'Clean rinsed HDPE and PET bottles tied in blue clear bags.',
      image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300&auto=format&fit=crop&q=80',
      pointsAwarded: 0
    },
    {
      id: 'REQ-4092',
      residentId: 'USR-101',
      residentName: 'Alex Mercer',
      address: '88 Duplication Road, Kollupitiya',
      zone: 'Kollupitiya',
      category: 'Paper & Cardboard',
      estimatedKg: 20,
      actualKg: null,
      date: '2026-10-16',
      timeSlot: 'Afternoon (13:00 - 17:00)',
      status: 'In Progress',
      assignedCrew: 'Crew #2 (Echo Truck)',
      notes: 'Flat packed cardboard boxes from moving.',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=80',
      pointsAwarded: 0
    }
  ],
  crews: [
    {
      id: 'CREW-1',
      name: 'Crew #1 (Alpha Hauler)',
      leader: 'Kasun Wickramasinghe',
      driver: 'David Kowalski',
      centerManager: 'Sunil Perera (GreenPoly MRF)',
      members: '3 Technicians',
      truckId: 'TRK-101 (Compactor)',
      truckCapacityKg: 8000,
      zone: 'Colombo Fort',
      status: 'Active En Route',
      stopsCompleted: 18,
      stopsAssigned: 22,
      onTimeRate: '96%'
    },
    {
      id: 'CREW-2',
      name: 'Crew #2 (Echo Truck)',
      leader: 'Nimal Jayawardena',
      driver: 'Maria Santos',
      centerManager: 'Dilani Samarasekera (EcoFiber Plant)',
      members: '2 Technicians',
      truckId: 'TRK-104 (Dry Recycler)',
      truckCapacityKg: 5000,
      zone: 'Kollupitiya',
      status: 'Active En Route',
      stopsCompleted: 14,
      stopsAssigned: 18,
      onTimeRate: '98%'
    }
  ],
  personnel: [
    {
      id: 'PER-101',
      name: 'Kasun Wickramasinghe',
      role: 'Crew Leader',
      phone: '+94 77 123 4567',
      email: 'leader@ecopulse.org',
      zone: 'Colombo Fort',
      assignment: 'Alpha Hauler Unit',
      status: 'Active / On Duty'
    },
    {
      id: 'PER-102',
      name: 'David Kowalski',
      role: 'Driver',
      phone: '+94 71 882 1192',
      email: 'david.k@citypulse.org',
      zone: 'Colombo Fort',
      assignment: 'Heavy Compactor (TRK-101)',
      status: 'Active / On Duty'
    },
    {
      id: 'PER-103',
      name: 'Sunil Perera',
      role: 'Recycling Center Manager',
      phone: '+94 11 254 9988',
      email: 'manager@ecopulse.org',
      zone: 'Colombo Fort',
      assignment: 'GreenPoly Circular Polymers MRF',
      status: 'Active / On Duty'
    }
  ],
  schedules: [
    {
      id: 'SCH-101',
      zone: 'Colombo Fort',
      stream: 'Plastic Recyclable',
      day: 'Monday',
      timeSlot: '07:30 - 12:00 PM',
      crewName: 'Crew #1 (Alpha Hauler)'
    }
  ],
  segregationItems: [
    { name: 'Plastic Milk Jug', bin: 'plastic', binName: '🟡 Yellow Bin', prep: 'Rinse thoroughly, flatten to save truck volume, cap may be left attached.', recyclability: '100% Recyclable (HDPE 2)', icon: '🧴' },
    { name: 'PET Water & Soda Bottle', bin: 'plastic', binName: '🟡 Yellow Bin', prep: 'Empty liquid completely, squash body, keep label intact for optical sorting.', recyclability: '100% Recyclable (PET 1)', icon: '🥤' },
    { name: 'Corrugated Cardboard Box', bin: 'paper', binName: '🔵 Blue Bin', prep: 'Flatten completely, remove heavy shipping tape and packing foam/bubble wrap.', recyclability: '100% Recyclable', icon: '📦' },
    { name: 'Office Paper & Newspapers', bin: 'paper', binName: '🔵 Blue Bin', prep: 'Keep dry. Remove plastic spiral bindings and metallic bulldog clips.', recyclability: '100% Recyclable', icon: '📰' },
    { name: 'Banana Peels & Fruit Scraps', bin: 'organic', binName: '🟢 Green Bin', prep: 'Remove fruit stickers, bag in certified compostable plant liner or place loose.', recyclability: '100% Compostable Yield', icon: '🍌' },
    { name: 'Vegetable Trimmings & Coffee Grounds', bin: 'organic', binName: '🟢 Green Bin', prep: 'Ideal for anaerobic composting. Paper unbleached coffee filters accepted.', recyclability: '100% Soil Enricher', icon: '☕' },
    { name: 'Aluminum Beverage Can', bin: 'glass-metal', binName: '⚪ Silver Bin', prep: 'Empty liquid residue, gently crush if possible. Infinite recycling life cycle.', recyclability: 'Infinite Recyclability', icon: '🥫' },
    { name: 'Glass Sauce Jar & Beverage Bottle', bin: 'glass-metal', binName: '⚪ Silver Bin', prep: 'Rinse cleanly. Separate metal lid into metal bin. Never break glass intentionally.', recyclability: '100% Infinitely Recyclable', icon: '🫙' },
    { name: 'Lithium-ion / AA Batteries', bin: 'hazard', binName: '🔴 Red Bin (Hazardous)', prep: 'NEVER put in regular bins due to fire explosion risk. Tape battery terminals.', recyclability: 'Special Smelter Extraction', icon: '🔋' },
    { name: 'Smartphone / Laptop E-Waste', bin: 'hazard', binName: '🔴 Red Bin (Hazardous)', prep: 'Wipe personal data. Store in moisture-free container for scheduled collection.', recyclability: 'Precious Metals Recovery', icon: '💻' }
  ],
  wasteCategories: [
    {
      category: 'Plastic Recyclables',
      binColor: '🟡 Yellow Bin',
      accepted: 'PET (1), HDPE (2), PP (5) rigid containers, clean bottles, food tubs',
      prohibited: 'Plastic bags/film, styrofoam, bio-hazard syringes',
      prepRule: 'Rinse clean, dry, flatten container',
      rating: '★★★★★ High Yield'
    },
    {
      category: 'Paper & Cardboard',
      binColor: '🔵 Blue Bin',
      accepted: 'Corrugated cartons, newspapers, clean cartons, office paper',
      prohibited: 'Wax-coated boxes, greasy food paper, foil wrappers',
      prepRule: 'Flatten boxes, bundle securely, keep dry',
      rating: '★★★★★ High Yield'
    },
    {
      category: 'Organic & Food Waste',
      binColor: '🟢 Green Bin',
      accepted: 'Vegetable scraps, fruit peels, eggshells, garden clippings, coffee grounds',
      prohibited: 'Plastic packaging, treated timber, pet feces, metal cutlery',
      prepRule: 'Use certified bio-bags or paper wrapping',
      rating: '★★★★☆ High Compost'
    },
    {
      category: 'Glass Bottles & Jars',
      binColor: '⚪ Silver / Teal Bin',
      accepted: 'Clear, amber, and green glass beverage bottles, condiment jars',
      prohibited: 'Ceramics, Pyrex heat-resistant glass, window panes, light bulbs',
      prepRule: 'Rinse clean, remove metal caps',
      rating: '★★★★★ Infinite Life'
    },
    {
      category: 'E-Waste & Electronics',
      binColor: '🔴 Red / Special Box',
      accepted: 'Old computers, phones, cables, circuit boards, rechargeable batteries',
      prohibited: 'Exploded batteries, radioactive smoke detectors',
      prepRule: 'Tape terminals, keep dry indoors',
      rating: '★★★★☆ Rare Metals'
    }
  ],
  recyclableBatches: [],
  recyclingFacilities: JSON.parse(JSON.stringify(DEFAULT_RECYCLING_FACILITIES)),
  complaints: [],
  users: [],
  activityFeed: [
    { text: 'System initialized with clean slate. Ready for data entry.', time: 'Just now', dot: 'emerald' }
  ]
};

// Optional sample data template if user wants to test with pre-filled items later
const SAMPLE_DATA_TEMPLATE = {
  activeRole: 'admin',
  theme: 'light',
  userProfile: {
    id: 'RES-8821',
    name: 'Alex Mercer',
    email: 'alex.mercer@citypulse.org',
    phone: '+94 77 234 9811',
    role: 'Resident',
    accountType: 'Residential Account',
    address: '12 Galle Road, Colombo 03',
    zone: 'Colombo Fort',
    ecoPoints: 1240,
    totalRecycledKg: 84.5,
    pickupsCompleted: 14
  },
  requests: [
    {
      id: 'REQ-4091',
      residentId: 'RES-8821',
      residentName: 'Alex Mercer',
      address: '12 Galle Road, Colombo 03',
      zone: 'Colombo Fort',
      category: 'Plastic Recyclable',
      estimatedKg: 14,
      actualKg: 15.2,
      date: '2026-09-04',
      timeSlot: 'Morning (08:00 - 12:00)',
      status: 'Collected',
      assignedCrew: 'Crew #1 (Alpha Hauler)',
      notes: 'Clean rinsed HDPE and PET bottles tied in blue clear bags.',
      image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300&auto=format&fit=crop&q=80',
      pointsAwarded: 150
    },
    {
      id: 'REQ-4092',
      residentId: 'RES-8821',
      residentName: 'Alex Mercer',
      address: '88 Duplication Road, Kollupitiya',
      zone: 'Kollupitiya',
      category: 'Paper & Cardboard',
      estimatedKg: 20,
      actualKg: null,
      date: '2026-09-05',
      timeSlot: 'Afternoon (13:00 - 17:00)',
      status: 'In Progress',
      assignedCrew: 'Crew #2 (Echo Truck)',
      notes: 'Flat packed cardboard boxes from moving.',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=80',
      pointsAwarded: 0
    }
  ],
  crews: [
    {
      id: 'CREW-1',
      name: 'Crew #1 (Alpha Hauler)',
      leader: 'Kasun Wickramasinghe',
      driver: 'David Kowalski',
      centerManager: 'Sunil Perera (GreenPoly MRF)',
      members: '3 Technicians',
      truckId: 'TRK-101 (Compactor)',
      truckCapacityKg: 8000,
      zone: 'Colombo Fort',
      status: 'Active En Route',
      stopsCompleted: 18,
      stopsAssigned: 22,
      onTimeRate: '96%'
    },
    {
      id: 'CREW-2',
      name: 'Crew #2 (Echo Truck)',
      leader: 'Nimal Jayawardena',
      driver: 'Maria Santos',
      centerManager: 'Dilani Samarasekera (EcoFiber Plant)',
      members: '2 Technicians',
      truckId: 'TRK-104 (Dry Recycler)',
      truckCapacityKg: 5000,
      zone: 'Kollupitiya',
      status: 'Active En Route',
      stopsCompleted: 14,
      stopsAssigned: 18,
      onTimeRate: '98%'
    }
  ],
  personnel: [
    {
      id: 'PER-101',
      name: 'Kasun Wickramasinghe',
      role: 'Crew Leader',
      phone: '+94 77 123 4567',
      email: 'kasun.w@citypulse.org',
      zone: 'Colombo Fort',
      assignment: 'Alpha Hauler Unit',
      status: 'Active / On Duty'
    },
    {
      id: 'PER-102',
      name: 'David Kowalski',
      role: 'Driver',
      phone: '+94 71 882 1192',
      email: 'david.k@citypulse.org',
      zone: 'Colombo Fort',
      assignment: 'Heavy Compactor (TRK-101)',
      status: 'Active / On Duty'
    },
    {
      id: 'PER-103',
      name: 'Sunil Perera',
      role: 'Recycling Center Manager',
      phone: '+94 11 254 9988',
      email: 'sunil.p@greenpoly.lk',
      zone: 'Colombo Fort',
      assignment: 'GreenPoly Circular Polymers MRF',
      status: 'Active / On Duty'
    },
    {
      id: 'PER-104',
      name: 'Nimal Jayawardena',
      role: 'Crew Leader',
      phone: '+94 77 901 2345',
      email: 'nimal.j@citypulse.org',
      zone: 'Kollupitiya',
      assignment: 'Echo Truck Unit',
      status: 'Active / On Duty'
    },
    {
      id: 'PER-105',
      name: 'Maria Santos',
      role: 'Driver',
      phone: '+94 76 432 9011',
      email: 'maria.s@citypulse.org',
      zone: 'Kollupitiya',
      assignment: 'Dry Recycler (TRK-104)',
      status: 'Active / On Duty'
    },
    {
      id: 'PER-106',
      name: 'Dilani Samarasekera',
      role: 'Recycling Center Manager',
      phone: '+94 11 432 1100',
      email: 'dilani.s@citypulse.org',
      zone: 'Kollupitiya',
      assignment: 'EcoFiber Pulp & Paper Recovery Plant',
      status: 'Active / On Duty'
    }
  ],
  schedules: [
    {
      id: 'SCH-101',
      zone: 'Colombo Fort',
      stream: 'Plastic Recyclable',
      day: 'Monday',
      timeSlot: '07:30 - 12:00 PM',
      crewName: 'Crew #2 (Echo Truck)'
    }
  ],
  segregationItems: CLEAN_INITIAL_DATA.segregationItems,
  wasteCategories: CLEAN_INITIAL_DATA.wasteCategories,
  recyclableBatches: [
    {
      id: 'BAT-2026-01',
      stream: 'Plastic Recyclable',
      weightKg: 2450,
      sourceZone: 'Central',
      facilityId: 'FAC-1',
      facilityName: 'GreenPoly Circular Polymers MRF',
      status: 'Allocated',
      date: '2026-09-04',
      carrierVehicle: 'Carrier Freight TR-904',
      yieldKg: null,
      recoveryRate: null,
      co2SavedKg: 3675
    }
  ],
  recyclingFacilities: JSON.parse(JSON.stringify(DEFAULT_RECYCLING_FACILITIES)),
  complaints: [
    {
      id: 'CMP-701',
      type: 'Curbside Spillage / Litter Left Behind',
      location: 'Corner of Maple Ave & 4th Street',
      zone: 'North',
      priority: 'High',
      details: 'Trash bag tore during hydraulic hoist lift.',
      date: 'Sep 4, 10:15 AM',
      status: 'Open',
      resolutionNotes: null
    }
  ],
  users: [
    { id: 'USR-101', name: 'Alex Mercer', email: 'alex.mercer@citypulse.org', phone: '+94 77 234 9811', role: 'Resident', zone: 'Central', status: 'Active', registeredOn: '2026-01-12' }
  ],
  activityFeed: [
    { text: 'Sample demonstration dataset loaded.', time: 'Just now', dot: 'emerald' }
  ]
};

// -----------------------------------------------------------------------------
// Sri Lankan Phone Number Formatter (+94 XX XXX XXXX)
// -----------------------------------------------------------------------------
function formatToSriLankanPhone(phone) {
  if (!phone || typeof phone !== 'string') return '+94 77 234 9811';
  let clean = phone.trim().replace(/[\s\-\(\)\.]/g, '');
  if (clean.includes('555') || clean.startsWith('+1')) {
    return '+94 77 234 9811';
  }
  let digits = clean;
  if (digits.startsWith('+94')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('94') && digits.length >= 11) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  digits = digits.replace(/\D/g, '');
  if (digits.length >= 9) {
    return `+94 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
  }
  if (digits.length > 2) {
    return `+94 ${digits.slice(0, 2)} ${digits.slice(2)}`;
  }
  return `+94 ${digits}`;
}
window.formatToSriLankanPhone = formatToSriLankanPhone;

// =============================================================================
// 2. Application Reactive State Store
// =============================================================================
class AppStore {
  constructor() {
    this.data = this.loadState();
  }

  loadState() {
    // Clear all previous legacy versions to ensure clean slate across all browsers
    ['ecopulse_colombo_v1', 'ecopulse_colombo_v2', 'ecopulse_colombo_v3', 'ecopulse_colombo_v4'].forEach(k => {
      try { localStorage.removeItem(k); } catch(e){}
    });

    // One-time forced clean reset to fulfill user request to clear all data on site
    const RESET_FLAG = 'ecopulse_clean_cleared_v8';
    try {
      if (!localStorage.getItem(RESET_FLAG)) {
        localStorage.clear();
        localStorage.setItem(RESET_FLAG, 'true');
        const fresh = JSON.parse(JSON.stringify(CLEAN_INITIAL_DATA));
        this.saveState(fresh);
        return fresh;
      }
    } catch (e) {}

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.personnel) parsed.personnel = [];
        if (!parsed.users || parsed.users.length === 0) {
          parsed.users = JSON.parse(JSON.stringify(DEFAULT_SYSTEM_ACCOUNTS));
        } else {
          DEFAULT_SYSTEM_ACCOUNTS.forEach(acc => {
            if (!parsed.users.some(u => u.email === acc.email)) {
              parsed.users.push(acc);
            }
          });
        }
        if (!parsed.crews || parsed.crews.length === 0) parsed.crews = JSON.parse(JSON.stringify(CLEAN_INITIAL_DATA.crews));
        if (!parsed.requests || parsed.requests.length === 0) parsed.requests = JSON.parse(JSON.stringify(CLEAN_INITIAL_DATA.requests));
        if (!parsed.recyclingFacilities || parsed.recyclingFacilities.length < 7 || !parsed.recyclingFacilities.some(f => f.zone === 'Colombo Fort')) {
          parsed.recyclingFacilities = JSON.parse(JSON.stringify(DEFAULT_RECYCLING_FACILITIES));
        }
        if (parsed.userProfile && parsed.userProfile.phone) {
          parsed.userProfile.phone = formatToSriLankanPhone(parsed.userProfile.phone);
        }
        if (parsed.currentUser && parsed.currentUser.phone) {
          parsed.currentUser.phone = formatToSriLankanPhone(parsed.currentUser.phone);
        }
        if (parsed.users) {
          parsed.users.forEach(u => {
            if (u.phone) u.phone = formatToSriLankanPhone(u.phone);
          });
        }
        if (parsed.personnel) {
          parsed.personnel.forEach(p => {
            if (p.phone) p.phone = formatToSriLankanPhone(p.phone);
          });
        }
        if (parsed.recyclingFacilities) {
          parsed.recyclingFacilities.forEach(f => {
            if (f.contactPhone) f.contactPhone = formatToSriLankanPhone(f.contactPhone);
          });
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading stored state:', e);
    }
    // Clean default state
    const fresh = JSON.parse(JSON.stringify(CLEAN_INITIAL_DATA));
    this.saveState(fresh);
    return fresh;
  }

  saveState(customData = null) {
    try {
      const toSave = customData || this.data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }

  clearAllData() {
    this.data = JSON.parse(JSON.stringify(CLEAN_INITIAL_DATA));
    this.saveState();
  }

  loadSampleTemplate() {
    this.data = JSON.parse(JSON.stringify(SAMPLE_DATA_TEMPLATE));
    this.saveState();
  }
}

const store = new AppStore();

// =============================================================================
// 3. UI Initialization & Event Handlers
// =============================================================================
let isFullModulesMode = false;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initDemoControls();
  initGuideModal();
  initViewModeToggle();
  initQuickChips();
  initQuickActions();
  initModals();
  initPickupRequestForm();
  initCollectionForm();
  initAllocationForm();
  initYieldForm();
  initComplaintForm();
  initScheduleForm();
  initUserRegistrationForm();
  initPersonnelForm();
  initPersonnelSearchAndFilter();
  initCrewRegistrationForm();
  initBatchRegistrationForm();
  initFacilityRegistrationForm();
  initAddSegregationItemForm();
  initProfileEditForm();
  initSegregationSearch();
  initPresetButtons();

  initAuthSystem();
  initUpdateCrewForm();
  initUpdateRequestForm();
  initPhoneInputFormatting();

  applyRolePermissions(store.data.currentUser || store.data.userProfile || DEFAULT_SYSTEM_ACCOUNTS[0]);
  renderAllViews();

  // Initialize live Supabase cloud database sync
  if (window.supabaseSync) {
    window.supabaseSync.pullFromSupabase();
  }
});

// -----------------------------------------------------------------------------
// Theme Management
// -----------------------------------------------------------------------------
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const currentTheme = store.data.theme || 'light';
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = store.data.theme === 'light' ? 'dark' : 'light';
      store.data.theme = nextTheme;
      store.saveState();
      applyTheme(nextTheme);
      showToast(`Switched to ${nextTheme} theme.`, 'info');
    });
  }
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
  } else {
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
  }
}

// -----------------------------------------------------------------------------
// Demo Controls & Guide Modal
// -----------------------------------------------------------------------------
function initDemoControls() {
  const trigger = document.getElementById('demoControlsTrigger');
  const dropdown = document.getElementById('demoDropdown');
  const loadBtn = document.getElementById('quickLoadSampleBtn');
  const clearBtn = document.getElementById('quickClearDataBtn');

  if (trigger && dropdown) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('open');
    });

    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      store.loadSampleTemplate();
      renderAllViews();
      if (dropdown) dropdown.classList.remove('open');
      showToast('Sample demonstration data loaded successfully!', 'success');
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all stored data to start with a clean slate?')) {
        store.clearAllData();
        renderAllViews();
        if (dropdown) dropdown.classList.remove('open');
        showToast('All data cleared. System ready for fresh data entry!', 'warning');
      }
    });
  }
}

function initGuideModal() {
  const openBtn = document.getElementById('openHowItWorksBtn');
  const bannerBtn = document.getElementById('bannerQuickGuideBtn');
  const startActionBtn = document.getElementById('guideStartActionBtn');
  const guideLoadSampleBtn = document.getElementById('guideLoadSampleBtn');
  const bannerNewPickupBtn = document.getElementById('bannerNewPickupBtn');

  if (openBtn) openBtn.addEventListener('click', () => openModal('howItWorksModal'));
  if (bannerBtn) bannerBtn.addEventListener('click', () => openModal('howItWorksModal'));

  if (startActionBtn) {
    startActionBtn.addEventListener('click', () => {
      closeModal('howItWorksModal');
      openModal('requestPickupModal');
    });
  }

  if (guideLoadSampleBtn) {
    guideLoadSampleBtn.addEventListener('click', () => {
      store.loadSampleTemplate();
      renderAllViews();
      closeModal('howItWorksModal');
      showToast('Sample demonstration data loaded successfully!', 'success');
    });
  }

  if (bannerNewPickupBtn) {
    bannerNewPickupBtn.addEventListener('click', () => openModal('requestPickupModal'));
  }
}

function initViewModeToggle() {
  const toggleBtn = document.getElementById('toggleFullModulesBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isFullModulesMode = !isFullModulesMode;
      const role = store.data.activeRole || 'admin';
      updateRoleUI(role);
      showToast(isFullModulesMode ? 'Showing all 4 core modules.' : 'Switched to simplified role-focused view.', 'info');
    });
  }
}

function initQuickChips() {
  const categorySelect = document.getElementById('reqWasteCategory');
  const qtyInput = document.getElementById('reqEstimatedQty');

  document.querySelectorAll('#quickCategoryChips .cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#quickCategoryChips .cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (categorySelect) {
        categorySelect.value = chip.getAttribute('data-cat');
      }
    });
  });

  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      const val = categorySelect.value;
      document.querySelectorAll('#quickCategoryChips .cat-chip').forEach(chip => {
        chip.classList.toggle('active', chip.getAttribute('data-cat') === val);
      });
    });
  }

  document.querySelectorAll('#quickQtyChips .qty-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#quickQtyChips .qty-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (qtyInput) {
        qtyInput.value = chip.getAttribute('data-qty');
      }
    });
  });
}

// -----------------------------------------------------------------------------
// Navigation & Subtabs
// -----------------------------------------------------------------------------
function initNavigation() {
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchMainTab(btn.getAttribute('data-tab'));
    });
  });

  document.querySelectorAll('[data-tab-jump]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchMainTab(link.getAttribute('data-tab-jump'));
    });
  });

  setupSubtabs('data-f1sub', 'f1-subpane');
  setupSubtabs('data-f2sub', 'f2-subpane');
  setupSubtabs('data-f3sub', 'f3-subpane');
  setupSubtabs('data-f4sub', 'f4-subpane');

  const brandBtn = document.getElementById('brandHomeBtn');
  if (brandBtn) {
    brandBtn.addEventListener('click', () => switchMainTab('dashboard'));
  }

  const refreshBtn = document.getElementById('refreshDashboardBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      renderDashboard();
      renderCharts();
      showToast('Telemetry refreshed.', 'success');
    });
  }

  // Filter Dashboard by zone
  const dashZoneFilter = document.getElementById('dashboardZoneFilter');
  if (dashZoneFilter) {
    dashZoneFilter.addEventListener('change', () => {
      renderDashboard();
      renderCharts();
    });
  }

  // Schedule Zone Pills
  document.querySelectorAll('#scheduleZonePills .pill-btn').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#scheduleZonePills .pill-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderWeeklySchedules(pill.getAttribute('data-zone'));
    });
  });
}

function switchMainTab(tabId) {
  document.querySelectorAll('.nav-tab-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.tab-pane').forEach(p => {
    p.classList.toggle('active', p.id === `tab-${tabId}`);
  });

  if (tabId === 'dashboard' || tabId === 'function4') {
    setTimeout(renderCharts, 50);
  }
}

function setupSubtabs(attrName, paneClass) {
  document.querySelectorAll(`[${attrName}]`).forEach(btn => {
    btn.addEventListener('click', () => {
      const parentSubbar = btn.closest('.subtab-bar');
      parentSubbar.querySelectorAll(`[${attrName}]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetSubId = btn.getAttribute(attrName);
      const parentPane = btn.closest('.tab-pane');
      parentPane.querySelectorAll(`.${paneClass}`).forEach(pane => {
        pane.classList.remove('active');
      });
      const targetElem = document.getElementById(targetSubId) || document.getElementById(`${paneClass.split('-')[0]}-${targetSubId}`);
      if (targetElem) {
        targetElem.classList.add('active');
      }

      if (attrName === 'data-f2sub') {
        if (targetSubId === 'daily-jobs') renderDailyJobs();
        if (targetSubId === 'dispatch-board') renderDispatchBoard();
        if (targetSubId === 'crew-roster') renderCrewRoster();
        if (targetSubId === 'personnel-roster') renderPersonnelRoster();
        if (targetSubId === 'schedules-planner') renderMasterSchedules();
      }
    });
  });
}

// -----------------------------------------------------------------------------
// Role Normalization & Centralized RBAC Engine
// -----------------------------------------------------------------------------
function normalizeRole(role) {
  if (!role) return 'user';
  const r = role.toLowerCase().trim();
  if (r.includes('admin')) return 'admin';
  if (r.includes('manager')) return 'manager';
  if (r.includes('crew') || r.includes('leader') || r.includes('driver')) return 'crew_leader';
  return 'user';
}
window.normalizeRole = normalizeRole;

function applyRolePermissions(user) {
  if (!user) return;
  const roleKey = normalizeRole(user.role);
  store.data.activeRole = roleKey;
  store.data.currentUser = user;

  // Sync userProfile with logged in user
  store.data.userProfile = {
    id: user.id || 'USR-101',
    name: user.name || 'Alex Mercer',
    email: user.email || 'resident@ecopulse.org',
    phone: user.phone || '+94 77 123 4567',
    role: user.role || 'User',
    accountType: user.accountType || (roleKey === 'admin' ? 'Municipal Admin' : roleKey === 'manager' ? 'Center Manager' : roleKey === 'crew_leader' ? 'Operations Personnel' : 'Residential Account'),
    address: user.address || '12 Galle Road, Colombo 03',
    zone: user.zone || 'Colombo Fort',
    ecoPoints: user.ecoPoints || 0,
    totalRecycledKg: user.totalRecycledKg || 0,
    pickupsCompleted: user.pickupsCompleted || 0
  };

  // 1. Update Top Nav User Header
  const userNameEl = document.getElementById('userNameDisplay');
  const userZoneEl = document.getElementById('userZoneDisplay');
  const roleBadgeEl = document.getElementById('navRoleBadge');

  if (userNameEl) userNameEl.textContent = user.name;
  if (userZoneEl) userZoneEl.textContent = `Zone: ${user.zone || 'Colombo Fort'}`;

  if (roleBadgeEl) {
    roleBadgeEl.className = 'nav-role-tag';
    if (roleKey === 'admin') {
      roleBadgeEl.classList.add('nav-role-admin');
      roleBadgeEl.textContent = '🏛️ Municipal Admin';
    } else if (roleKey === 'manager') {
      roleBadgeEl.classList.add('nav-role-manager');
      roleBadgeEl.textContent = '♻️ Center Manager';
    } else if (roleKey === 'crew_leader') {
      roleBadgeEl.classList.add('nav-role-crew');
      roleBadgeEl.textContent = '🎖️ Crew Leader';
    } else {
      roleBadgeEl.classList.add('nav-role-user');
      roleBadgeEl.textContent = '👤 Citizen User';
    }
  }

  // 2. Header action buttons visibility
  const btnNavNewUser = document.getElementById('navRegisterUserBtn');
  if (btnNavNewUser) {
    btnNavNewUser.style.display = (roleKey === 'admin' || roleKey === 'manager') ? 'inline-flex' : 'none';
  }

  // 3. Filter Sidebar Navigation according to role
  const sidebarButtons = document.querySelectorAll('#sidebarNav .nav-tab-btn');
  let allowedTabs = ['dashboard'];

  if (roleKey === 'admin' || roleKey === 'manager') {
    allowedTabs = ['dashboard', 'function1', 'function2', 'function3', 'function4'];
  } else if (roleKey === 'crew_leader') {
    allowedTabs = ['dashboard', 'function1', 'function2', 'function3'];
  } else {
    // User / Resident: only dashboard, Pickups (function1), and Segregation Guide (function3)
    allowedTabs = ['dashboard', 'function1', 'function3'];
  }

  sidebarButtons.forEach(btn => {
    const tabId = btn.getAttribute('data-tab');
    if (allowedTabs.includes(tabId)) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
      if (btn.classList.contains('active')) {
        switchMainTab('dashboard');
      }
    }
  });

  // 4. Update Sidebar Section Title
  const sidebarTitle = document.getElementById('sidebarSectionTitle');
  if (sidebarTitle) {
    if (roleKey === 'admin') sidebarTitle.textContent = 'ADMINISTRATION OS';
    else if (roleKey === 'manager') sidebarTitle.textContent = 'OPERATIONS MANAGEMENT';
    else if (roleKey === 'crew_leader') sidebarTitle.textContent = 'CREW LEADER MANIFEST';
    else sidebarTitle.textContent = 'CITIZEN PORTAL';
  }

  // 5. Update Dashboard Scope Banner
  const bannerTitle = document.getElementById('roleScopeTitle');
  const bannerDesc = document.getElementById('roleScopeDesc');
  const bannerIcon = document.getElementById('roleScopeIcon');

  if (bannerTitle && bannerDesc && bannerIcon) {
    if (roleKey === 'admin') {
      bannerIcon.textContent = '🏛️';
      bannerTitle.textContent = `Logged in as Municipal Administrator (${user.name})`;
      bannerDesc.textContent = 'Full System Access: All functions, Fleet schedules, MRF recycling yields, incident grievances & citizen database enabled.';
    } else if (roleKey === 'manager') {
      bannerIcon.textContent = '♻️';
      bannerTitle.textContent = `Logged in as Operations / Center Manager (${user.name})`;
      bannerDesc.textContent = 'All Functions Available: Manage collection fleets, MRF facility allocations, certified yield recovery & operations personnel.';
    } else if (roleKey === 'crew_leader') {
      bannerIcon.textContent = '🎖️';
      bannerTitle.textContent = `Logged in as Crew Leader (${user.name})`;
      bannerDesc.textContent = 'Crew Operations Mode: Update pickup requests & verified weights, manage crew fleet records & update route manifests.';
    } else {
      bannerIcon.textContent = '👤';
      bannerTitle.textContent = `Logged in as Citizen User (${user.name})`;
      bannerDesc.textContent = 'Citizen Mode: Add new pickup requests, cancel your requests anytime, view live operational dashboard & sorting guide.';
    }
  }

  // Pre-fill pickup request defaults
  const reqAddress = document.getElementById('reqPickupAddress');
  if (reqAddress && user.address) reqAddress.value = user.address;
  const reqZone = document.getElementById('reqPickupZone');
  if (reqZone && user.zone) reqZone.value = user.zone;

  const crewSelect = document.getElementById('activeCrewSelector');
  if (crewSelect) {
    crewSelect.addEventListener('change', renderDailyJobs);
  }

  // 6. Function 3 (Recycling & Sort Guides) Access Controls
  const isPrivilegedRecycler = (roleKey === 'admin' || roleKey === 'manager');
  const f3Actions = document.getElementById('f3PaneActions');
  if (f3Actions) f3Actions.style.display = 'flex';

  const btnIntake = document.getElementById('openIntakeModalBtn');
  if (btnIntake) btnIntake.style.display = isPrivilegedRecycler ? 'inline-flex' : 'none';

  const btnFacility = document.getElementById('openFacilityModalBtn');
  if (btnFacility) btnFacility.style.display = 'inline-flex';

  const btnAddSeg = document.getElementById('openAddSegItemBtn');
  if (btnAddSeg) btnAddSeg.style.display = isPrivilegedRecycler ? 'inline-flex' : 'none';

  const btnQuickBatch = document.getElementById('quickAddBatchBtn');
  if (btnQuickBatch) btnQuickBatch.style.display = isPrivilegedRecycler ? 'inline-flex' : 'none';

  store.saveState();
}
window.applyRolePermissions = applyRolePermissions;

// -----------------------------------------------------------------------------
// Sri Lankan Phone Number Validation (+94 XX XXX XXXX or 07XXXXXXXX)
// -----------------------------------------------------------------------------
function validateSriLankanPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, message: 'Contact phone number is required.' };
  }
  let clean = phone.trim().replace(/[\s\-\(\)\.]/g, '');
  if (clean.startsWith('+94')) {
    clean = clean.slice(3);
  } else if (clean.startsWith('94') && clean.length >= 11) {
    clean = clean.slice(2);
  } else if (clean.startsWith('0')) {
    clean = clean.slice(1);
  }
  const validRegex = /^[1-9]\d{8}$/;
  if (!validRegex.test(clean)) {
    return {
      valid: false,
      message: 'Invalid phone number! Please enter a valid 9-digit Sri Lankan phone number (e.g. 77 123 4567 or 11 254 9988).'
    };
  }
  const formatted = `+94 ${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5)}`;
  return { valid: true, formatted, localDigits: clean };
}
window.validateSriLankanPhoneNumber = validateSriLankanPhoneNumber;

function extractLocalPhoneDigits(phone) {
  if (!phone || typeof phone !== 'string') return '';
  let clean = phone.trim().replace(/[\s\-\(\)\.]/g, '');
  if (clean.startsWith('+94')) clean = clean.slice(3);
  else if (clean.startsWith('94') && clean.length >= 11) clean = clean.slice(2);
  else if (clean.startsWith('0')) clean = clean.slice(1);
  if (clean.length === 9) {
    return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5)}`;
  }
  return clean;
}
window.extractLocalPhoneDigits = extractLocalPhoneDigits;

function initPhoneInputFormatting() {
  const phoneInputs = document.querySelectorAll('.phone-input');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[\s\-\(\)\.]/g, '');
      if (val.startsWith('+94')) val = val.slice(3);
      else if (val.startsWith('94') && val.length > 9) val = val.slice(2);
      else if (val.startsWith('0')) val = val.slice(1);
      val = val.replace(/\D/g, '').slice(0, 9);
      if (val.length > 5) {
        e.target.value = `${val.slice(0, 2)} ${val.slice(2, 5)} ${val.slice(5)}`;
      } else if (val.length > 2) {
        e.target.value = `${val.slice(0, 2)} ${val.slice(2)}`;
      } else {
        e.target.value = val;
      }
    });
  });
}

// -----------------------------------------------------------------------------
// Authentication System (Login & Registration Portal)
// -----------------------------------------------------------------------------
function initAuthSystem() {
  const authOverlay = document.getElementById('authOverlay');
  const authTabLoginBtn = document.getElementById('authTabLoginBtn');
  const authTabRegisterBtn = document.getElementById('authTabRegisterBtn');
  const authLoginForm = document.getElementById('authLoginForm');
  const authRegisterForm = document.getElementById('authRegisterForm');
  const authCardTitle = document.getElementById('authCardTitle');
  const authCardSubtitle = document.getElementById('authCardSubtitle');
  const authErrorBanner = document.getElementById('authErrorBanner');
  const authErrorText = document.getElementById('authErrorText');
  const headerLogoutBtn = document.getElementById('headerLogoutBtn');
  const bannerSwitchAccountBtn = document.getElementById('bannerSwitchAccountBtn');
  const switchToLoginLink = document.getElementById('switchToLoginLink');

  function showLoginTab() {
    if (authTabLoginBtn) authTabLoginBtn.classList.add('active');
    if (authTabRegisterBtn) authTabRegisterBtn.classList.remove('active');
    if (authLoginForm) authLoginForm.classList.remove('hidden');
    if (authRegisterForm) authRegisterForm.classList.add('hidden');
    if (authCardTitle) authCardTitle.textContent = 'Municipal Access Portal';
    if (authCardSubtitle) authCardSubtitle.textContent = 'Sign in with your email or test role credentials';
    if (authErrorBanner) authErrorBanner.classList.add('hidden');
  }

  function showRegisterTab() {
    if (authTabRegisterBtn) authTabRegisterBtn.classList.add('active');
    if (authTabLoginBtn) authTabLoginBtn.classList.remove('active');
    if (authRegisterForm) authRegisterForm.classList.remove('hidden');
    if (authLoginForm) authLoginForm.classList.add('hidden');
    if (authCardTitle) authCardTitle.textContent = 'Create New Account';
    if (authCardSubtitle) authCardSubtitle.textContent = 'Register a new resident, crew leader, manager, or admin account';
    if (authErrorBanner) authErrorBanner.classList.add('hidden');
  }

  if (authTabLoginBtn) authTabLoginBtn.addEventListener('click', showLoginTab);
  if (authTabRegisterBtn) authTabRegisterBtn.addEventListener('click', showRegisterTab);
  if (switchToLoginLink) switchToLoginLink.addEventListener('click', showLoginTab);

  // Login Form Submission
  if (authLoginForm) {
    authLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;

      const allUsers = [...(store.data.users || []), ...DEFAULT_SYSTEM_ACCOUNTS];
      const found = allUsers.find(u => (u.email && u.email.toLowerCase() === email) || (u.id && u.id.toLowerCase() === email));

      if (found) {
        loginUser(found, true);
      } else {
        if (authErrorBanner && authErrorText) {
          authErrorText.textContent = 'Account not found. Please verify your credentials or create a new citizen account.';
          authErrorBanner.classList.remove('hidden');
        } else {
          showToast('Account not found. Please verify credentials.', 'error');
        }
      }
    });
  }

  // Register Form Submission
  if (authRegisterForm) {
    authRegisterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regFullName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      // Public self-registration creates ONLY Citizen User accounts.
      // Staff accounts (Crew Leader, Manager, Admin) are provisioned through the administrative backend.
      const role = 'Resident';
      const zone = document.getElementById('regZone').value;
      const address = document.getElementById('regAddress').value.trim();
      const phoneRaw = document.getElementById('regPhone').value.trim();

      const phoneValidation = validateSriLankanPhoneNumber(phoneRaw);
      if (!phoneValidation.valid) {
        if (authErrorBanner && authErrorText) {
          authErrorText.textContent = phoneValidation.message;
          authErrorBanner.classList.remove('hidden');
        } else {
          showToast(phoneValidation.message, 'error');
        }
        document.getElementById('regPhone').focus();
        return;
      }
      const phone = phoneValidation.formatted;

      const newId = 'USR-' + Date.now().toString().slice(-4);
      const newUser = {
        id: newId,
        name: name,
        email: email,
        password: password,
        role: role,
        zone: zone,
        address: address,
        phone: phone,
        accountType: 'Residential Account',
        ecoPoints: 0,
        totalRecycledKg: 0,
        pickupsCompleted: 0,
        status: 'Active',
        registeredOn: new Date().toISOString().split('T')[0]
      };

      if (!store.data.users) store.data.users = [];
      store.data.users.push(newUser);

      store.data.activityFeed.unshift({
        text: `New account registered: ${name} (${role}, ${zone}).`,
        time: 'Just now',
        dot: 'emerald'
      });

      store.saveState();
      if (window.supabaseSync) {
        window.supabaseSync.pushUser(newUser);
        if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
      }

      authRegisterForm.reset();
      loginUser(newUser, true);
      showToast(`Account successfully created for ${name}!`, 'success');
    });
  }

  function loginUser(user, showNotification = false) {
    store.data.isLoggedIn = true;
    store.data.currentUser = user;
    try {
      localStorage.setItem('ecopulse_user', JSON.stringify(user));
    } catch(e) {}

    applyRolePermissions(user);

    if (authOverlay) authOverlay.classList.add('hidden');
    document.body.style.overflow = '';

    renderAllViews();
    if (showNotification) {
      showToast(`Welcome, ${user.name}! Switched to ${user.role} role.`, 'success');
    }
  }

  window.logoutUser = function() {
    store.data.isLoggedIn = false;
    store.data.currentUser = null;
    try {
      localStorage.removeItem('ecopulse_user');
    } catch(e) {}

    showLoginTab();
    if (authOverlay) authOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    showToast('You have logged out.', 'info');
  };

  if (headerLogoutBtn) headerLogoutBtn.addEventListener('click', window.logoutUser);
  if (bannerSwitchAccountBtn) bannerSwitchAccountBtn.addEventListener('click', window.logoutUser);

  // Check initial login state
  let initialUser = null;
  try {
    const saved = localStorage.getItem('ecopulse_user');
    if (saved) initialUser = JSON.parse(saved);
  } catch(e) {}

  if (initialUser) {
    loginUser(initialUser, false);
  } else {
    if (authOverlay) authOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    showLoginTab();
  }
}
window.initAuthSystem = initAuthSystem;

// -----------------------------------------------------------------------------
// Request Cancellation by Resident
// -----------------------------------------------------------------------------
window.cancelPickupRequest = function(reqId) {
  const req = store.data.requests.find(r => r.id === reqId);
  if (!req) return;
  if (confirm(`Are you sure you want to cancel pickup request ${reqId}?`)) {
    req.status = 'Cancelled';
    store.data.activityFeed.unshift({
      text: `Pickup request ${reqId} was cancelled by resident.`,
      time: 'Just now',
      dot: 'rose'
    });
    store.saveState();
    if (window.supabaseSync) {
      window.supabaseSync.pushRequest(req);
      if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
    }
    renderAllViews();
    showToast(`Pickup request ${reqId} has been cancelled.`, 'warning');
  }
};

// -----------------------------------------------------------------------------
// Update Crew Details & Operations (Crew Leader & Admin & Manager)
// -----------------------------------------------------------------------------
window.openUpdateCrewModal = function(crewId) {
  const crew = store.data.crews.find(c => c.id === crewId);
  if (!crew) return;

  populateCrewPersonnelDropdowns();

  document.getElementById('editCrewId').value = crew.id;
  document.getElementById('editCrewName').value = crew.name;
  document.getElementById('editCrewZone').value = crew.zone || 'Colombo Fort';
  if (crew.leader) document.getElementById('editCrewLeader').value = crew.leader;
  if (crew.driver) document.getElementById('editCrewDriver').value = crew.driver;
  if (crew.centerManager) document.getElementById('editCrewCenterManager').value = crew.centerManager;
  document.getElementById('editCrewMembers').value = crew.members || '3 Technicians';
  document.getElementById('editCrewTruckId').value = crew.truckId || '';
  document.getElementById('editCrewCapacity').value = crew.truckCapacityKg || 5000;
  document.getElementById('editCrewStatus').value = crew.status || 'Active En Route';
  document.getElementById('editCrewOnTime').value = crew.onTimeRate || '96%';

  openModal('updateCrewModal');
};

function initUpdateCrewForm() {
  const form = document.getElementById('updateCrewForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const crewId = document.getElementById('editCrewId').value;
    const crew = store.data.crews.find(c => c.id === crewId);
    if (!crew) return;

    crew.name = document.getElementById('editCrewName').value;
    crew.zone = document.getElementById('editCrewZone').value;
    crew.leader = document.getElementById('editCrewLeader').value;
    crew.driver = document.getElementById('editCrewDriver').value;
    crew.centerManager = document.getElementById('editCrewCenterManager').value;
    crew.members = document.getElementById('editCrewMembers').value;
    crew.truckId = document.getElementById('editCrewTruckId').value;
    crew.truckCapacityKg = parseFloat(document.getElementById('editCrewCapacity').value) || 5000;
    crew.status = document.getElementById('editCrewStatus').value;
    crew.onTimeRate = document.getElementById('editCrewOnTime').value || '96%';

    store.data.activityFeed.unshift({
      text: `Crew ${crew.name} details & operational status updated.`,
      time: 'Just now',
      dot: 'blue'
    });

    store.saveState();
    if (window.supabaseSync) {
      window.supabaseSync.pushCrew(crew);
      if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
    }

    closeModal('updateCrewModal');
    renderAllViews();
    showToast(`Crew "${crew.name}" updated successfully!`, 'success');
  });
}

// -----------------------------------------------------------------------------
// Update Request Details & Status (Crew Leader & Admin & Manager)
// -----------------------------------------------------------------------------
window.openUpdateRequestModal = function(reqId) {
  const req = store.data.requests.find(r => r.id === reqId);
  if (!req) return;

  document.getElementById('editReqId').value = req.id;

  const banner = document.getElementById('editReqSummaryBanner');
  if (banner) {
    banner.innerHTML = `
      <strong>Request:</strong> ${req.id} (${req.category})<br>
      <strong>Resident:</strong> ${req.residentName} | <strong>Location:</strong> ${req.address} (${req.zone})<br>
      <strong>Estimated Weight:</strong> ${req.estimatedKg} kg | <strong>Date:</strong> ${req.date} (${req.timeSlot})
    `;
  }

  document.getElementById('editReqStatus').value = req.status || 'Assigned';
  document.getElementById('editReqActualWeight').value = req.actualKg !== null && req.actualKg !== undefined ? req.actualKg : '';

  const crewSelect = document.getElementById('editReqAssignedCrew');
  if (crewSelect) {
    const isUnassigned = !req.assignedCrew || req.assignedCrew === 'Unassigned';
    const unassignedOption = `<option value="Unassigned" ${isUnassigned ? 'selected' : ''}>⚠️ Unassigned (Pending Dispatch)</option>`;
    const crewOptions = (store.data.crews || []).map(c => `
      <option value="${c.name}" ${c.name === req.assignedCrew ? 'selected' : ''}>${c.name} (${c.zone})</option>
    `).join('');
    crewSelect.innerHTML = unassignedOption + crewOptions;
  }

  const facSelect = document.getElementById('editReqFacility');
  if (facSelect) {
    const facilities = store.data.recyclingFacilities || [];
    const zoneFacility = facilities.find(f => f.zone && f.zone.toLowerCase() === (req.zone || '').toLowerCase()) ||
                         facilities[0];
    facSelect.innerHTML = facilities.map(f => `
      <option value="${f.id}" ${(req.facilityId ? f.id === req.facilityId : (zoneFacility && f.id === zoneFacility.id)) ? 'selected' : ''}>
        ${f.name} [Zone: ${f.zone || 'All Zones'}] — ${f.type} (Load: ${f.currentLoadTons}/${f.capacityTons}t)
      </option>
    `).join('') || '<option value="">No registered facilities</option>';
    if (req.facilityId) {
      facSelect.value = req.facilityId;
    } else if (zoneFacility) {
      facSelect.value = zoneFacility.id;
    }
  }

  document.getElementById('editReqQualityGrade').value = req.qualityGrade || 'Grade A - Pure Segregation';
  document.getElementById('editReqCrewNotes').value = req.notes || '';

  openModal('updateRequestModal');
};

function initUpdateRequestForm() {
  const form = document.getElementById('updateRequestForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const reqId = document.getElementById('editReqId').value;
    const req = store.data.requests.find(r => r.id === reqId);
    if (!req) return;

    const newStatus = document.getElementById('editReqStatus').value;
    const actualWeightVal = document.getElementById('editReqActualWeight').value;
    const actualWeight = actualWeightVal !== '' ? parseFloat(actualWeightVal) : null;
    const oldCrew = req.assignedCrew;
    const assignedCrew = document.getElementById('editReqAssignedCrew').value;
    const qualityGrade = document.getElementById('editReqQualityGrade').value;
    const crewNotes = document.getElementById('editReqCrewNotes').value;
    const targetFacId = document.getElementById('editReqFacility')?.value;

    req.assignedCrew = assignedCrew === 'Unassigned' ? 'Unassigned' : assignedCrew;
    req.qualityGrade = qualityGrade;
    req.notes = crewNotes;

    // Maintain crew assigned stops count
    if (req.assignedCrew !== 'Unassigned' && req.assignedCrew !== oldCrew) {
      const newCrewObj = store.data.crews.find(c => c.name === req.assignedCrew);
      if (newCrewObj) newCrewObj.stopsAssigned = (newCrewObj.stopsAssigned || 0) + 1;
      if (oldCrew && oldCrew !== 'Unassigned') {
        const oldCrewObj = store.data.crews.find(c => c.name === oldCrew);
        if (oldCrewObj && oldCrewObj.stopsAssigned > 0) oldCrewObj.stopsAssigned -= 1;
      }
    } else if (req.assignedCrew === 'Unassigned' && oldCrew && oldCrew !== 'Unassigned') {
      const oldCrewObj = store.data.crews.find(c => c.name === oldCrew);
      if (oldCrewObj && oldCrewObj.stopsAssigned > 0) oldCrewObj.stopsAssigned -= 1;
    }

    if (newStatus === 'Collected') {
      // Automatically route completed pickup to relevant storage center and log as batch
      const result = completePickupAndRouteToStorageCenter(reqId, actualWeight, targetFacId);
      const facName = result?.facility?.name || 'Storage Center';
      const batId = result?.batch?.id || 'BAT-Auto';
      closeModal('updateRequestModal');
      renderAllViews();
      showToast(`Request ${req.id} completed ➔ Delivered to ${facName} & recorded as batch ${batId}!`, 'success');
      return;
    } else {
      req.status = newStatus;
      if (actualWeight !== null) req.actualKg = actualWeight;
      if (targetFacId) {
        const targetFac = store.data.recyclingFacilities.find(f => f.id === targetFacId);
        if (targetFac) {
          req.facilityId = targetFac.id;
          req.facilityName = targetFac.name;
        }
      }
      // If request was unassigned and has now been given a crew, advance status to Assigned if still Submitted
      if (req.assignedCrew !== 'Unassigned' && req.status === 'Submitted') {
        req.status = 'Assigned';
      }

      store.data.activityFeed.unshift({
        text: `Request ${req.id} updated to "${newStatus}"${req.assignedCrew !== 'Unassigned' ? ' (' + req.assignedCrew + ')' : ''}.`,
        time: 'Just now',
        dot: 'blue'
      });

      store.saveState();
      if (window.supabaseSync) {
        window.supabaseSync.updateRequest(req);
        if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
      }
    }

    closeModal('updateRequestModal');
    renderAllViews();
    showToast(`Request ${req.id} updated successfully!`, 'success');
  });
}

// -----------------------------------------------------------------------------
// Quick Actions Hub
// -----------------------------------------------------------------------------
function initQuickActions() {
  const qaNewReq = document.getElementById('qaNewRequest');
  if (qaNewReq) qaNewReq.addEventListener('click', () => openModal('requestPickupModal'));

  const qaJobs = document.getElementById('qaDailyJobs');
  if (qaJobs) qaJobs.addEventListener('click', () => {
    switchMainTab('function2');
    const b = document.querySelector('[data-f2sub="daily-jobs"]');
    if (b) b.click();
  });

  const qaRecycle = document.getElementById('qaRecycleIntake');
  if (qaRecycle) qaRecycle.addEventListener('click', () => {
    switchMainTab('function3');
    const b = document.querySelector('[data-f3sub="recycling-batches"]');
    if (b) b.click();
  });

  const qaGuide = document.getElementById('qaSegregationGuide');
  if (qaGuide) qaGuide.addEventListener('click', () => {
    switchMainTab('function3');
    const b = document.querySelector('[data-f3sub="segregation-guide"]');
    if (b) b.click();
  });
}

// -----------------------------------------------------------------------------
// Modals Open & Close System
// -----------------------------------------------------------------------------
function initModals() {
  // Modal triggers
  const btnReq = document.getElementById('openRequestModalBtn');
  if (btnReq) btnReq.addEventListener('click', () => openModal('requestPickupModal'));

  const btnF1Req = document.getElementById('f1RequestPickupBtn');
  if (btnF1Req) btnF1Req.addEventListener('click', () => openModal('requestPickupModal'));

  const btnComp = document.getElementById('openComplaintModalBtn');
  if (btnComp) btnComp.addEventListener('click', () => openModal('complaintModal'));

  const btnF4Comp = document.getElementById('f4NewComplaintBtn');
  if (btnF4Comp) btnF4Comp.addEventListener('click', () => openModal('complaintModal'));

  const btnSched = document.getElementById('createNewScheduleBtn');
  if (btnSched) btnSched.addEventListener('click', () => openModal('createScheduleModal'));

  const btnCrew = document.getElementById('registerCrewBtn');
  if (btnCrew) btnCrew.addEventListener('click', () => openModal('registerCrewModal'));

  const btnPersonnel = document.getElementById('addPersonnelBtn');
  if (btnPersonnel) btnPersonnel.addEventListener('click', () => openModal('registerPersonnelModal'));

  const btnSubtabPersonnel = document.getElementById('subtabAddPersonnelBtn');
  if (btnSubtabPersonnel) btnSubtabPersonnel.addEventListener('click', () => openModal('registerPersonnelModal'));

  const btnIntake = document.getElementById('openIntakeModalBtn');
  if (btnIntake) btnIntake.addEventListener('click', () => openModal('recordBatchModal'));

  const btnQuickBatch = document.getElementById('quickAddBatchBtn');
  if (btnQuickBatch) btnQuickBatch.addEventListener('click', () => openModal('recordBatchModal'));

  const btnFacility = document.getElementById('openFacilityModalBtn');
  if (btnFacility) btnFacility.addEventListener('click', () => openModal('registerFacilityModal'));

  const btnAddNewFacility = document.getElementById('addNewFacilityBtn');
  if (btnAddNewFacility) btnAddNewFacility.addEventListener('click', () => openModal('registerFacilityModal'));

  const facZoneFilter = document.getElementById('facilityZoneFilter');
  if (facZoneFilter) {
    facZoneFilter.addEventListener('change', () => {
      renderFacilities();
    });
  }

  const btnUser = document.getElementById('f4NewUserBtn');
  if (btnUser) btnUser.addEventListener('click', () => openModal('registerUserModal'));

  const btnAddSeg = document.getElementById('openAddSegItemBtn');
  if (btnAddSeg) btnAddSeg.addEventListener('click', () => openModal('addSegregationItemModal'));

  const btnProf = document.getElementById('viewProfileBtn');
  if (btnProf) btnProf.addEventListener('click', openUserProfileModal);

  const btnTopProf = document.getElementById('userProfileBtn');
  if (btnTopProf) btnTopProf.addEventListener('click', openUserProfileModal);

  const btnNavNewUser = document.getElementById('navRegisterUserBtn');
  if (btnNavNewUser) btnNavNewUser.addEventListener('click', () => openModal('registerUserModal'));

  const btnF1NewUser = document.getElementById('f1NewUserBtn');
  if (btnF1NewUser) btnF1NewUser.addEventListener('click', () => openModal('registerUserModal'));

  // Close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal.id);
    });
  });

  // Click outside to close
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop:not(.hidden):not([aria-hidden="true"])').forEach(m => closeModal(m.id));
    }
  });

  // Outcome radio switcher in record collection modal
  document.querySelectorAll('input[name="colOutcome"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const comp = document.getElementById('outcomeCompletedFields');
      const miss = document.getElementById('outcomeMissedFields');
      if (radio.value === 'Completed') {
        comp.classList.remove('hidden');
        miss.classList.add('hidden');
      } else {
        comp.classList.add('hidden');
        miss.classList.remove('hidden');
      }
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.removeAttribute('aria-hidden');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Dynamic dropdown refresh when opening certain modals
  if (modalId === 'createScheduleModal') {
    populateScheduleCrewDropdown();
  }

  if (modalId === 'recordBatchModal') {
    populateRecordBatchFacilityDropdown();
    const currentStream = document.getElementById('newBatchStream')?.value;
    if (currentStream) suggestFacilityForStream(currentStream);
  }

  if (modalId === 'registerCrewModal' || modalId === 'updateCrewModal') {
    populateCrewPersonnelDropdowns();
  }

  // Pre-fill smart defaults for effortless pickup submission
  if (modalId === 'requestPickupModal') {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dateInput = document.getElementById('reqPickupDate');
    if (dateInput) {
      dateInput.min = todayStr;
      if (!dateInput.value || dateInput.value < todayStr) {
        dateInput.value = todayStr;
      }
    }
    const timeSelect = document.getElementById('reqTimeSlot');
    if (timeSelect && !timeSelect.value) {
      timeSelect.value = 'Morning Shift (8.00 a.m - 12.00 p.m)';
    }
    const addrInput = document.getElementById('reqPickupAddress');
    if (addrInput && !addrInput.value) {
      addrInput.value = store.data.userProfile.address || '12 Galle Road, Colombo';
    }
    const zoneSelect = document.getElementById('reqPickupZone');
    if (zoneSelect && store.data.userProfile.zone) {
      zoneSelect.value = store.data.userProfile.zone;
    }
    const qtyInput = document.getElementById('reqEstimatedQty');
    if (qtyInput && !qtyInput.value) {
      qtyInput.value = '10';
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function openUserProfileModal() {
  const user = store.data.userProfile;
  const content = document.getElementById('userProfileModalContent');
  if (!content) return;

  const usersList = store.data.users || [];

  content.innerHTML = `
    <div style="display:flex; gap:16px; align-items:center; margin-bottom:16px;">
      <div style="width:60px; height:60px; border-radius:50%; border:2px solid var(--primary); background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <div>
        <h3 style="font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:700;">${user.name}</h3>
        <p style="font-size:0.82rem; color:var(--text-muted);">${user.email} • ${formatToSriLankanPhone(user.phone)}</p>
        <span class="status-pill active" style="margin-top:4px; display:inline-block;">${user.accountType || 'Residential'}</span>
      </div>
    </div>
    <div style="background:var(--bg-surface-subtle); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border-color); display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.82rem;">
      <div><strong>Resident ID:</strong> ${user.id}</div>
      <div><strong>Assigned Zone:</strong> ${user.zone}</div>
      <div><strong>Address:</strong> ${user.address}</div>
      <div><strong>Eco-Reward Points:</strong> <span class="text-emerald font-bold">${user.ecoPoints}</span></div>
      <div><strong>Total Diverted:</strong> ${user.totalRecycledKg} kg</div>
      <div><strong>Pickups Completed:</strong> ${user.pickupsCompleted}</div>
    </div>

    ${usersList.length > 0 ? `
      <div style="margin-top:16px; padding:12px; background:var(--bg-surface); border:1px dashed var(--border-color); border-radius:var(--radius-md);">
        <label for="accountSwitchSelect" style="display:block; font-size:0.82rem; font-weight:700; margin-bottom:6px; color:var(--text-main);">
          🔄 Switch Active User Account (${usersList.length} registered):
        </label>
        <div style="display:flex; gap:8px;">
          <select id="accountSwitchSelect" class="form-input" style="flex:1; font-size:0.82rem;">
            ${usersList.map(u => `
              <option value="${u.id}" ${u.id === user.id ? 'selected' : ''}>
                ${u.name} (${u.role} - ${u.zone})
              </option>
            `).join('')}
          </select>
          <button class="btn btn-sm btn-secondary" id="doSwitchAccountBtn">Switch</button>
        </div>
      </div>
    ` : ''}

    <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
      <button class="btn btn-sm btn-primary" id="openCreateUserFromModalBtn">
        + Create New Account
      </button>
      <button class="btn btn-sm btn-outline" id="openEditProfileBtn">✏️ Edit Account Details</button>
    </div>
  `;

  const doSwitchBtn = document.getElementById('doSwitchAccountBtn');
  if (doSwitchBtn) {
    doSwitchBtn.addEventListener('click', () => {
      const select = document.getElementById('accountSwitchSelect');
      if (select && select.value) {
        switchActiveUser(select.value);
        closeModal('userProfileModal');
      }
    });
  }

  const createBtn = document.getElementById('openCreateUserFromModalBtn');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      closeModal('userProfileModal');
      openModal('registerUserModal');
    });
  }

  document.getElementById('openEditProfileBtn').addEventListener('click', () => {
    closeModal('userProfileModal');
    openEditProfileModal();
  });

  openModal('userProfileModal');
}

function switchActiveUser(userId) {
  const user = store.data.users.find(u => u.id === userId);
  if (!user) return;

  store.data.userProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    accountType: user.role === 'Business' ? 'Commercial Business' : user.role === 'Admin' ? 'Municipal Admin' : 'Residential Account',
    address: user.address || `Zone ${user.zone}`,
    zone: user.zone,
    ecoPoints: user.ecoPoints || 0,
    totalRecycledKg: user.totalRecycledKg || 0,
    pickupsCompleted: user.pickupsCompleted || 0
  };

  const addrInput = document.getElementById('reqPickupAddress');
  if (addrInput) addrInput.value = store.data.userProfile.address;
  const zoneSelect = document.getElementById('reqPickupZone');
  if (zoneSelect) zoneSelect.value = store.data.userProfile.zone;

  store.saveState();
  renderAllViews();
  showToast(`Active account switched to ${user.name} (${user.zone})`, 'info');
}
window.switchActiveUser = switchActiveUser;

function openEditProfileModal() {
  const user = store.data.userProfile;
  document.getElementById('editProfName').value = user.name;
  document.getElementById('editProfEmail').value = user.email;
  document.getElementById('editProfPhone').value = extractLocalPhoneDigits(user.phone);
  document.getElementById('editProfAddress').value = user.address;
  document.getElementById('editProfZone').value = user.zone;
  document.getElementById('editProfAccountType').value = user.accountType || 'Residential Account';
  openModal('editProfileModal');
}

function initProfileEditForm() {
  const form = document.getElementById('editProfileForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    store.data.userProfile.name = document.getElementById('editProfName').value;
    store.data.userProfile.email = document.getElementById('editProfEmail').value;
    const phoneInputVal = document.getElementById('editProfPhone').value.trim();
    const phoneValidation = validateSriLankanPhoneNumber(phoneInputVal);
    if (!phoneValidation.valid) {
      showToast(phoneValidation.message, 'error');
      document.getElementById('editProfPhone').focus();
      return;
    }
    store.data.userProfile.phone = phoneValidation.formatted;
    store.data.userProfile.address = document.getElementById('editProfAddress').value;
    store.data.userProfile.zone = document.getElementById('editProfZone').value;
    store.data.userProfile.accountType = document.getElementById('editProfAccountType').value;

    store.saveState();
    closeModal('editProfileModal');
    renderAllViews();
    showToast('Resident profile updated successfully!', 'success');
  });
}

// -----------------------------------------------------------------------------
// Image Upload Feature (Function 1)
// -----------------------------------------------------------------------------
let currentUploadedImageBase64 = null;

function initPresetButtons() {
  const presets = {
    plastic: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300&auto=format&fit=crop&q=80',
    cardboard: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=80',
    ewaste: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&auto=format&fit=crop&q=80'
  };

  document.querySelectorAll('[data-img-preset]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const presetKey = btn.getAttribute('data-img-preset');
      if (presets[presetKey]) {
        currentUploadedImageBase64 = presets[presetKey];
        showImagePreview(currentUploadedImageBase64);
        showToast(`Selected ${presetKey} sample image`, 'info');
      }
    });
  });

  const fileInput = document.getElementById('reqImageFileInput');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          currentUploadedImageBase64 = loadEvt.target.result;
          showImagePreview(currentUploadedImageBase64);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const removeBtn = document.getElementById('removeImagePreviewBtn');
  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentUploadedImageBase64 = null;
      document.getElementById('dropzonePreviewWrap').classList.add('hidden');
      document.getElementById('dropzonePrompt').classList.remove('hidden');
      if (fileInput) fileInput.value = '';
    });
  }
}

function showImagePreview(src) {
  const prompt = document.getElementById('dropzonePrompt');
  const previewWrap = document.getElementById('dropzonePreviewWrap');
  const img = document.getElementById('wasteImagePreviewImg');

  if (prompt) prompt.classList.add('hidden');
  if (previewWrap) previewWrap.classList.remove('hidden');
  if (img) img.src = src;
}

// -----------------------------------------------------------------------------
// Form Handlers: Adding Data Across All Modules
// -----------------------------------------------------------------------------

// 1. Waste Pickup Request Form (Function 1)
function initPickupRequestForm() {
  const form = document.getElementById('pickupRequestForm');
  if (!form) return;

  const getLocalTodayString = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = getLocalTodayString();
  const dateInput = document.getElementById('reqPickupDate');
  if (dateInput) {
    dateInput.min = todayStr;
    if (!dateInput.value || dateInput.value < todayStr) dateInput.value = todayStr;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const category = document.getElementById('reqWasteCategory').value;
    const estimatedKg = parseFloat(document.getElementById('reqEstimatedQty').value) || 10;
    const pickupDate = document.getElementById('reqPickupDate').value;
    const timeSlot = document.getElementById('reqTimeSlot').value;
    const address = document.getElementById('reqPickupAddress').value;
    const zone = document.getElementById('reqPickupZone').value;
    const notes = document.getElementById('reqSpecialNotes').value;

    const curToday = getLocalTodayString();
    // Validation: do not allow dates strictly before today
    if (!pickupDate || pickupDate < curToday) {
      showToast('Invalid date! Pickup requests cannot be scheduled on past dates.', 'error');
      if (dateInput) {
        dateInput.value = curToday;
        dateInput.focus();
      }
      return;
    }

    if (!store.data.requests) store.data.requests = [];
    const newReqId = 'REQ-' + (1000 + store.data.requests.length + 1);

    // Manual Crew Assignment:
    // Requests start as 'Submitted' and 'Unassigned'. Dispatchers or managers manually assign available crews.
    const initialStatus = 'Submitted';
    const assignedCrewName = 'Unassigned';

    const activeUser = store.data.currentUser || store.data.userProfile || DEFAULT_SYSTEM_ACCOUNTS[0];
    const residentId = activeUser.id || 'USR-101';
    const residentName = activeUser.name || 'Citizen User';

    const newRequest = {
      id: newReqId,
      residentId: residentId,
      residentName: residentName,
      address: address,
      zone: zone,
      category: category,
      estimatedKg: estimatedKg,
      actualKg: null,
      date: pickupDate,
      timeSlot: timeSlot,
      status: initialStatus,
      assignedCrew: assignedCrewName,
      notes: notes || 'Doorstep collection requested.',
      image: currentUploadedImageBase64 || null,
      pointsAwarded: 0
    };

    store.data.requests.unshift(newRequest);

    store.data.activityFeed.unshift({
      text: `New pickup request ${newReqId} (${category}, ~${estimatedKg}kg, ${zone}) submitted. Pending manual crew dispatch.`,
      time: 'Just now',
      dot: 'blue'
    });

    store.saveState();

    if (window.supabaseSync) {
      window.supabaseSync.pushRequest(newRequest);
      if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
    }

    form.reset();
    const removePreview = document.getElementById('removeImagePreviewBtn');
    if (removePreview) removePreview.click();
    currentUploadedImageBase64 = null;
    if (dateInput) dateInput.value = curToday;
    closeModal('requestPickupModal');

    renderAllViews();
    showToast(`Pickup request ${newReqId} submitted! Awaiting manual crew assignment in Dispatch Queue.`, 'success');
  });

  const categoryFilter = document.getElementById('requestCategoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      renderActiveRequests(categoryFilter.value);
    });
  }

  const historySearch = document.getElementById('historySearchInput');
  if (historySearch) {
    historySearch.addEventListener('input', (e) => {
      renderCollectionHistory(e.target.value.toLowerCase());
    });
  }
}

// Function 2: Operations Personnel Registration (Crew Leader, Driver, Recycling Center Manager)
function initPersonnelForm() {
  const form = document.getElementById('registerPersonnelForm');
  if (!form) return;

  const roleSelect = document.getElementById('personnelRole');
  const assignLabel = document.getElementById('personnelAssignmentLabel');
  const assignInput = document.getElementById('personnelAssignment');
  const assignHint = document.getElementById('personnelAssignmentHint');

  if (roleSelect && assignLabel && assignInput && assignHint) {
    roleSelect.addEventListener('change', () => {
      const val = roleSelect.value;
      if (val === 'Crew Leader') {
        assignLabel.textContent = 'Assigned Team / Supervision Scope';
        assignInput.placeholder = 'e.g. Lead for Crew #1 (Alpha Hauler)';
        assignHint.textContent = 'Designate crew supervision scope or zone operations team.';
      } else if (val === 'Driver') {
        assignLabel.textContent = 'Vehicle License & Truck Assignment';
        assignInput.placeholder = 'e.g. Heavy Articulated (Class D) - TRK-101';
        assignHint.textContent = 'Specify heavy vehicle license class and assigned truck ID.';
      } else if (val === 'Recycling Center Manager') {
        assignLabel.textContent = 'Assigned Recycling Center / MRF Facility';
        assignInput.placeholder = 'e.g. GreenPoly Circular Polymers MRF';
        assignHint.textContent = 'Specify the material recovery facility or processing plant.';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = document.getElementById('personnelRole').value;
    const name = document.getElementById('personnelName').value.trim();
    const zone = document.getElementById('personnelZone').value;
    const phoneRaw = document.getElementById('personnelPhone').value.trim();
    const email = document.getElementById('personnelEmail').value.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@citypulse.org`;
    const assignment = document.getElementById('personnelAssignment').value.trim() || 'General Operations Field Staff';
    const status = document.getElementById('personnelStatus').value;

    if (!name || !phoneRaw) {
      showToast('Please provide full name and contact phone.', 'warning');
      return;
    }

    const phoneValidation = validateSriLankanPhoneNumber(phoneRaw);
    if (!phoneValidation.valid) {
      showToast(phoneValidation.message, 'error');
      document.getElementById('personnelPhone').focus();
      return;
    }
    const phone = phoneValidation.formatted;

    if (!store.data.personnel) store.data.personnel = [];

    const newId = 'PER-' + (store.data.personnel.length + 101);
    const newStaff = {
      id: newId,
      name,
      role,
      phone,
      email,
      zone,
      assignment,
      status
    };

    store.data.personnel.push(newStaff);

    store.data.activityFeed.unshift({
      text: `Registered ${role}: ${name} (${zone}).`,
      time: 'Just now',
      dot: role === 'Crew Leader' ? 'amber' : role === 'Driver' ? 'blue' : 'emerald'
    });

    store.saveState();
    if (window.supabaseSync) {
      window.supabaseSync.pushPersonnel(newStaff);
      if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
    }
    form.reset();
    closeModal('registerPersonnelModal');
    populateCrewPersonnelDropdowns();
    renderFunction2();
    renderAllViews();
    showToast(`${role} "${name}" registered successfully!`, 'success');
  });
}

// 2. Register New Crew Form (Function 2)
function initCrewRegistrationForm() {
  const form = document.getElementById('registerCrewForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('newCrewName').value.trim();
    const zone = document.getElementById('newCrewZone').value;
    const leaderInput = document.getElementById('newCrewLeader');
    const leader = leaderInput ? leaderInput.value.trim() : '';
    const driver = document.getElementById('newCrewDriver').value.trim();
    const managerInput = document.getElementById('newCrewCenterManager');
    const centerManager = managerInput ? managerInput.value.trim() : '';
    const members = document.getElementById('newCrewMembers').value.trim() || '2 Technicians';
    const truckId = document.getElementById('newCrewTruckId').value.trim();
    const capacity = parseFloat(document.getElementById('newCrewCapacity').value) || 5000;
    const status = document.getElementById('newCrewStatus').value;

    const newCrewId = 'CREW-' + (store.data.crews.length + 1);

    const newCrew = {
      id: newCrewId,
      name: name,
      leader: leader || 'Unassigned Leader',
      driver: driver,
      centerManager: centerManager || 'Unassigned MRF Liaison',
      members: members,
      truckId: truckId,
      truckCapacityKg: capacity,
      zone: zone,
      status: status,
      stopsCompleted: 0,
      stopsAssigned: 0,
      onTimeRate: '100%'
    };

    store.data.crews.push(newCrew);

    // Auto-register key personnel if not yet in personnel roster
    if (!store.data.personnel) store.data.personnel = [];

    if (leader && !store.data.personnel.some(p => p.name.toLowerCase() === leader.toLowerCase() && p.role === 'Crew Leader')) {
      store.data.personnel.push({
        id: 'PER-' + (store.data.personnel.length + 101),
        name: leader,
        role: 'Crew Leader',
        phone: '+94 77 ' + Math.floor(1000000 + Math.random() * 9000000),
        email: `${leader.toLowerCase().replace(/\s+/g, '.')}@citypulse.org`,
        zone: zone,
        assignment: `Lead for ${name}`,
        status: 'Active / On Duty'
      });
    }

    if (driver && !store.data.personnel.some(p => p.name.toLowerCase() === driver.toLowerCase() && p.role === 'Driver')) {
      store.data.personnel.push({
        id: 'PER-' + (store.data.personnel.length + 101),
        name: driver,
        role: 'Driver',
        phone: '+94 71 ' + Math.floor(1000000 + Math.random() * 9000000),
        email: `${driver.toLowerCase().replace(/\s+/g, '.')}@citypulse.org`,
        zone: zone,
        assignment: `Driver for ${truckId}`,
        status: 'Active / On Duty'
      });
    }

    if (centerManager && !store.data.personnel.some(p => p.name.toLowerCase() === centerManager.toLowerCase() && p.role === 'Recycling Center Manager')) {
      store.data.personnel.push({
        id: 'PER-' + (store.data.personnel.length + 101),
        name: centerManager,
        role: 'Recycling Center Manager',
        phone: '+94 11 ' + Math.floor(2000000 + Math.random() * 7000000),
        email: `${centerManager.toLowerCase().replace(/\s+/g, '.')}@citypulse.org`,
        zone: zone,
        assignment: `Drop-off Liaison for ${zone}`,
        status: 'Active / On Duty'
      });
    }

    store.data.activityFeed.unshift({
      text: `New collection team ${name} registered for Zone ${zone} (Leader: ${leader || 'N/A'}, Driver: ${driver}, MRF Manager: ${centerManager || 'N/A'}).`,
      time: 'Just now',
      dot: 'blue'
    });

    store.saveState();
    if (window.supabaseSync) {
      window.supabaseSync.pushCrew(newCrew);
      if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
    }
    form.reset();
    closeModal('registerCrewModal');
    renderAllViews();
    showToast(`Fleet Crew "${name}" registered successfully!`, 'success');
  });
}

// 3. Create Master Route Schedule Form (Function 2)
// Handles the submission and publishing of municipal recurring collection route schedules
function initScheduleForm() {
  // Retrieve the route schedule form element from the DOM by its ID
  const form = document.getElementById('createScheduleForm');

  // Guard clause: Exit early if the form element doesn't exist on the page to prevent errors
  if (!form) return;

  // Attach a submit event listener to process data when the user clicks 'Publish Schedule'
  form.addEventListener('submit', (e) => {
    // Prevent the default browser behavior (prevents full-page reload on form submission)
    e.preventDefault();

    // Extract the selected municipal zone (e.g., 'Colombo Fort', 'Kollupitiya')
    const zone = document.getElementById('schedZone').value;

    // Extract the selected waste stream category (e.g., 'Plastic Recyclables', 'Organic')
    const stream = document.getElementById('schedStream').value;

    // Extract the scheduled day of the week (e.g., 'Monday', 'Thursday')
    const day = document.getElementById('schedDay').value;

    // Extract the operational collection time window (e.g., '07:00 - 11:30 AM')
    const timeSlot = document.getElementById('schedTimeSlot').value;

    // Extract the assigned fleet team / crew name responsible for this route
    const crew = document.getElementById('schedCrew').value;

    // Generate a unique sequential schedule identifier (e.g., 'SCH-101', 'SCH-102')
    const newId = 'SCH-' + (100 + store.data.schedules.length + 1);

    // Construct the structured route schedule record object
    const newSchedObj = {
      id: newId,            // Unique schedule identifier
      zone: zone,           // Target neighborhood collection zone
      stream: stream,       // Material / waste stream type
      day: day,             // Designated day of the week
      timeSlot: timeSlot,   // Time window for collection
      crewName: crew        // Name of the assigned fleet crew
    };

    // Append the newly created schedule object to the in-memory schedules array
    store.data.schedules.push(newSchedObj);

    // Save the updated application state to browser localStorage for offline persistence
    store.saveState();

    // If Supabase cloud integration is active, push this new route schedule to the Supabase database
    if (window.supabaseSync) {
      window.supabaseSync.pushSchedule(newSchedObj);
    }

    // Reset all form input fields back to their blank / default states
    form.reset();

    // Close the schedule modal dialog popup
    closeModal('createScheduleModal');

    // Re-render all views and tables across the UI to immediately display the new schedule
    renderAllViews();

    // Display a pop-up toast alert confirming successful publication of the route
    showToast(`Route schedule ${newId} published!`, 'success');
  });
}

// Dynamically populates the fleet crew dropdown inside the Create Schedule modal
function populateScheduleCrewDropdown() {
  // Retrieve the crew selection <select> element in the schedule modal
  const schedCrew = document.getElementById('schedCrew');

  // Guard clause: Exit if the element is not present
  if (!schedCrew) return;

  // Check if any collection fleet crews are currently registered in the system
  if (store.data.crews.length === 0) {
    // If no crews exist, provide a fallback option indicating no crews are available
    schedCrew.innerHTML = `<option value="Unassigned Crew">No crews registered yet (Will mark Unassigned)</option>`;
  } else {
    // Otherwise, map over each registered crew and generate an HTML <option> tag
    schedCrew.innerHTML = store.data.crews.map(c => `
      <option value="${c.name}">${c.name} (${c.zone})</option>
    `).join('');
  }
}

// Centralized Municipal Pickup Completion & Relevant Storage Center Routing
function completePickupAndRouteToStorageCenter(requestId, actualWeightKg = null, customFacilityId = null) {
  const req = store.data.requests.find(r => r.id === requestId);
  if (!req) return null;

  // 1. Determine verified actual weight
  const actualKg = actualWeightKg !== null && !isNaN(actualWeightKg) && Number(actualWeightKg) > 0
    ? Number(actualWeightKg)
    : (req.actualKg || req.estimatedKg || 10);

  // 2. Identify relevant segregation/storage center dedicated to this pickup's zone
  const facilities = store.data.recyclingFacilities || [];
  let facility = null;
  if (customFacilityId) {
    facility = facilities.find(f => f.id === customFacilityId);
  }
  if (!facility && req.zone) {
    const reqZoneClean = req.zone.trim().toLowerCase();
    facility = facilities.find(f => f.zone && f.zone.trim().toLowerCase() === reqZoneClean) ||
               facilities.find(f => f.zone && (reqZoneClean.includes(f.zone.trim().toLowerCase()) || f.zone.trim().toLowerCase().includes(reqZoneClean))) ||
               facilities.find(f => (f.location || '').toLowerCase().includes(reqZoneClean));
  }
  if (!facility && facilities.length > 0) {
    facility = facilities[0];
  }

  const facilityId = facility ? facility.id : null;
  const facilityName = facility ? facility.name : 'Central Municipal Yard';

  // 3. Update pickup request status and points
  req.status = 'Collected';
  req.actualKg = actualKg;
  req.facilityId = facilityId;
  req.facilityName = facilityName;
  req.pointsAwarded = Math.round(actualKg * 10);

  // 4. Automatically update the relevant storage center's current load tonnage
  if (facility) {
    const tonsAdded = Number((actualKg / 1000).toFixed(2));
    facility.currentLoadTons = Number(((facility.currentLoadTons || 0) + tonsAdded).toFixed(2));
  }

  // 5. Award eco points to resident profile if current resident
  const activeUser = store.data.currentUser || store.data.userProfile;
  if (activeUser && req.residentId === activeUser.id) {
    store.data.userProfile.ecoPoints = (store.data.userProfile.ecoPoints || 0) + req.pointsAwarded;
    store.data.userProfile.totalRecycledKg = Number(((store.data.userProfile.totalRecycledKg || 0) + actualKg).toFixed(1));
    store.data.userProfile.pickupsCompleted = (store.data.userProfile.pickupsCompleted || 0) + 1;
  }

  // 6. Automatically record as a batch in the relevant storage center
  if (!store.data.recyclableBatches) store.data.recyclableBatches = [];
  let batch = store.data.recyclableBatches.find(b => b.requestId === req.id);
  const todayStr = new Date().toISOString().split('T')[0];
  let isNewBatch = false;

  if (!batch) {
    isNewBatch = true;
    const newBatchId = 'BAT-' + (1000 + store.data.recyclableBatches.length + 1);
    batch = {
      id: newBatchId,
      stream: req.category,
      weightKg: actualKg,
      sourceZone: req.zone || 'Colombo Fort',
      facilityId: facilityId,
      facilityName: facilityName,
      status: 'Allocated',
      date: todayStr,
      carrierVehicle: req.assignedCrew && req.assignedCrew !== 'Unassigned' ? req.assignedCrew : `Fleet Unit (${req.zone || 'Central'})`,
      yieldKg: null,
      recoveryRate: null,
      co2SavedKg: Math.round(actualKg * 1.5),
      requestId: req.id
    };
    store.data.recyclableBatches.unshift(batch);
  } else {
    batch.weightKg = actualKg;
    batch.stream = req.category;
    batch.sourceZone = req.zone || batch.sourceZone;
    batch.facilityId = facilityId;
    batch.facilityName = facilityName;
    batch.status = 'Allocated';
    batch.carrierVehicle = req.assignedCrew && req.assignedCrew !== 'Unassigned' ? req.assignedCrew : batch.carrierVehicle;
    batch.co2SavedKg = Math.round(actualKg * 1.5);
  }

  // 7. Audit log in activity feed
  store.data.activityFeed.unshift({
    text: `Pickup ${req.id} completed (${actualKg}kg ${req.category}) ➔ Delivered to ${facilityName} (${req.zone}) as batch ${batch.id}.`,
    time: 'Just now',
    dot: 'emerald'
  });

  // 8. Persist state and sync to Supabase Cloud
  store.saveState();

  if (window.supabaseSync) {
    window.supabaseSync.updateRequest(req);
    if (facility && typeof window.supabaseSync.updateFacility === 'function') {
      window.supabaseSync.updateFacility(facility);
    }
    if (isNewBatch) {
      if (typeof window.supabaseSync.pushBatch === 'function') {
        window.supabaseSync.pushBatch(batch);
      }
    } else {
      if (typeof window.supabaseSync.updateBatch === 'function') {
        window.supabaseSync.updateBatch(batch);
      }
    }
    if (store.data.activityFeed.length > 0) {
      window.supabaseSync.pushActivity(store.data.activityFeed[0]);
    }
  }

  return { request: req, facility, batch };
}

// 4. Record Collection / Weigh Outcome Form (Function 2)
function initCollectionForm() {
  const form = document.getElementById('recordCollectionForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const jobId = document.getElementById('colJobId').value;
    const outcome = form.querySelector('input[name="colOutcome"]:checked').value;
    const request = store.data.requests.find(r => r.id === jobId);

    if (!request) {
      closeModal('recordCollectionModal');
      return;
    }

    if (outcome === 'Completed') {
      const actualKgVal = document.getElementById('colActualWeight').value;
      const actualKg = actualKgVal ? parseFloat(actualKgVal) : (request.actualKg || request.estimatedKg || 10);
      const quality = document.getElementById('colSegregationQuality')?.value;
      if (quality) request.qualityGrade = quality;
      const targetCenterId = document.getElementById('colRecycleCenter')?.value;

      const result = completePickupAndRouteToStorageCenter(jobId, actualKg, targetCenterId);
      const facilityName = result?.facility?.name || 'Recycling & Storage Center';
      const batchId = result?.batch?.id || 'BAT-Auto';

      showToast(`Stop ${jobId} weighed: ${actualKg}kg delivered to ${facilityName} & logged as batch ${batchId}!`, 'success');
    } else {
      const reason = document.getElementById('colMissedReason').value;
      request.status = 'Missed';
      request.missedReason = reason;

      store.data.activityFeed.unshift({
        text: `Stop ${jobId} missed: ${reason}. Escalated to dispatcher.`,
        time: 'Just now',
        dot: 'red'
      });

      store.saveState();
      if (window.supabaseSync) {
        window.supabaseSync.updateRequest(request);
        if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
      }

      showToast(`Stop ${jobId} marked missed: ${reason}.`, 'warning');
    }

    closeModal('recordCollectionModal');
    renderAllViews();
  });
}

function openRecordCollectionModal(reqId) {
  const req = store.data.requests.find(r => r.id === reqId);
  if (!req) return;

  document.getElementById('colJobId').value = req.id;
  document.getElementById('recordCollectionSubtitle').textContent = `Stop ID: ${req.id} • ${req.address} (${req.zone})`;

  const banner = document.getElementById('colJobDetailsSummary');
  banner.innerHTML = `
    <strong>Resident:</strong> ${req.residentName} (${req.address})<br>
    <strong>Waste Stream:</strong> ${req.category} | <strong>Estimated:</strong> ${req.estimatedKg} kg<br>
    <strong>Notes:</strong> ${req.notes || 'None'}
  `;

  document.getElementById('colActualWeight').value = req.actualKg || req.estimatedKg;

  // Populate Drop-off Recycling Center / Destination MRF options
  const centerSelect = document.getElementById('colRecycleCenter');
  if (centerSelect) {
    const facilities = store.data.recyclingFacilities || [];
    if (facilities.length === 0) {
      centerSelect.innerHTML = '<option value="">No registered facilities available</option>';
    } else {
      // Find the relevant segregation center matching the request's zone
      const zoneFacility = facilities.find(f => f.zone && f.zone.toLowerCase() === (req.zone || '').toLowerCase()) ||
                           facilities.find(f => (f.location || '').toLowerCase().includes((req.zone || '').toLowerCase())) ||
                           facilities[0];

      centerSelect.innerHTML = facilities.map(f => `
        <option value="${f.id}" ${zoneFacility && zoneFacility.id === f.id ? 'selected' : ''}>
          ${f.name} [Zone: ${f.zone || 'All Zones'}] — ${f.type} (Load: ${f.currentLoadTons}/${f.capacityTons}t)
        </option>
      `).join('');

      if (zoneFacility) {
        centerSelect.value = zoneFacility.id;
      }
    }
  }

  openModal('recordCollectionModal');
}

// 5. Record Recyclable Batch Form (Function 3)
function populateRecordBatchFacilityDropdown(selectedId = null) {
  const select = document.getElementById('newBatchFacility');
  if (!select) return;

  const facilities = store.data.recyclingFacilities || [];
  if (facilities.length === 0) {
    select.innerHTML = '<option value="">No registered facilities available</option>';
    return;
  }

  select.innerHTML = facilities.map(f => `
    <option value="${f.id}" ${selectedId === f.id ? 'selected' : ''}>
      ${f.name} — ${f.type} (Cap: ${f.capacityTons}t | Tel: ${formatToSriLankanPhone(f.contactPhone)})
    </option>
  `).join('');
}

function suggestFacilityForStream(stream) {
  const select = document.getElementById('newBatchFacility');
  if (!select || !store.data.recyclingFacilities || store.data.recyclingFacilities.length === 0) return;

  const streamLower = (stream || '').toLowerCase();
  const match = store.data.recyclingFacilities.find(f => {
    const fLower = (f.name + ' ' + f.type + ' ' + (f.acceptedMaterials || []).join(' ')).toLowerCase();
    if (streamLower.includes('plastic') && fLower.includes('plastic')) return true;
    if (streamLower.includes('paper') && (fLower.includes('paper') || fLower.includes('fiber') || fLower.includes('pulp'))) return true;
    if (streamLower.includes('glass') && (fLower.includes('glass') || fLower.includes('metal'))) return true;
    if (streamLower.includes('metal') && (fLower.includes('metal') || fLower.includes('glass'))) return true;
    if (streamLower.includes('organic') && (fLower.includes('organic') || fLower.includes('compost'))) return true;
    if (streamLower.includes('e-waste') && (fLower.includes('waste') || fLower.includes('smelter') || fLower.includes('tech') || fLower.includes('electronic'))) return true;
    return false;
  });

  if (match) {
    select.value = match.id;
  }
}

function initBatchRegistrationForm() {
  const form = document.getElementById('recordBatchForm');
  if (!form) return;

  // Real-time facility suggestion when category changes
  const streamSelect = document.getElementById('newBatchStream');
  if (streamSelect) {
    streamSelect.addEventListener('change', () => {
      suggestFacilityForStream(streamSelect.value);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const stream = document.getElementById('newBatchStream').value;
    const weight = parseFloat(document.getElementById('newBatchWeight').value) || 1000;
    const zone = document.getElementById('newBatchZone').value;
    const carrier = document.getElementById('newBatchCarrier').value || 'Municipal Carrier';
    const facId = document.getElementById('newBatchFacility')?.value;

    const facility = store.data.recyclingFacilities.find(f => f.id === facId) || store.data.recyclingFacilities[0];
    const facilityId = facility ? facility.id : null;
    const facilityName = facility ? facility.name : 'Unallocated (In Municipal Yard)';
    const status = facility ? 'Allocated' : 'In Yard';

    if (facility) {
      facility.currentLoadTons = (facility.currentLoadTons || 0) + Math.round(weight / 1000);
    }

    const newBatchId = 'BAT-' + (1000 + store.data.recyclableBatches.length + 1);

    store.data.recyclableBatches.unshift({
      id: newBatchId,
      stream: stream,
      weightKg: weight,
      sourceZone: zone,
      facilityId: facilityId,
      facilityName: facilityName,
      status: status,
      date: new Date().toISOString().split('T')[0],
      carrierVehicle: carrier,
      yieldKg: null,
      recoveryRate: null,
      co2SavedKg: Math.round(weight * 1.5)
    });

    store.data.activityFeed.unshift({
      text: `Batch ${newBatchId} (${weight}kg ${stream}) logged & assigned to ${facilityName}.`,
      time: 'Just now',
      dot: 'emerald'
    });

    store.saveState();
    if (window.supabaseSync && store.data.recyclableBatches.length > 0) {
      window.supabaseSync.pushBatch(store.data.recyclableBatches[0]);
      if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
    }
    form.reset();
    closeModal('recordBatchModal');
    renderAllViews();
    showToast(`Recyclable batch ${newBatchId} logged & allocated to ${facilityName}!`, 'success');
  });
}

// 6. Register Partner Recycling Facility / MRF (Function 3)
function initFacilityRegistrationForm() {
  const form = document.getElementById('registerFacilityForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('newFacName').value.trim();
    const type = document.getElementById('newFacType').value.trim();
    const capacity = parseFloat(document.getElementById('newFacCapacity').value) || 150;
    const zone = document.getElementById('newFacZone')?.value || 'Colombo Fort';
    const location = document.getElementById('newFacLocation').value.trim();
    const materials = document.getElementById('newFacMaterials').value.split(',').map(m => m.trim());
    let phoneRaw = document.getElementById('newFacPhone').value.trim();
    const phoneValidation = validateSriLankanPhoneNumber(phoneRaw);
    if (!phoneValidation.valid) {
      showToast(phoneValidation.message, 'error');
      document.getElementById('newFacPhone').focus();
      return;
    }
    const phone = phoneValidation.formatted;

    const newId = 'FAC-' + zone.substring(0, 4).toUpperCase().replace(/\s+/g, '') + '-' + (store.data.recyclingFacilities.length + 1);

    const newFacility = {
      id: newId,
      name: name,
      zone: zone,
      type: type,
      location: location,
      capacityTons: capacity,
      currentLoadTons: 0,
      acceptedMaterials: materials,
      contactPhone: phone,
      status: 'Certified Active'
    };

    store.data.recyclingFacilities.push(newFacility);

    store.data.activityFeed.unshift({
      text: `Segregation & Recycling Centre "${name}" registered for Zone ${zone} (ID: ${newId}).`,
      time: 'Just now',
      dot: 'blue'
    });

    store.saveState();
    if (window.supabaseSync && store.data.recyclingFacilities.length > 0) {
      window.supabaseSync.pushFacility(store.data.recyclingFacilities[store.data.recyclingFacilities.length - 1]);
      if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
    }
    populateRecordBatchFacilityDropdown(newId);
    form.reset();
    const phoneInput = document.getElementById('newFacPhone');
    if (phoneInput) phoneInput.value = '11 254 9988';

    closeModal('registerFacilityModal');
    renderAllViews();
    showToast(`Recycling Facility "${name}" registered for Zone ${zone}!`, 'success');
  });
}

// 7. Allocate Batch to MRF (Function 3)
function initAllocationForm() {
  const form = document.getElementById('allocateBatchForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const batchId = document.getElementById('allocBatchId').value;
    const facilityId = document.getElementById('allocTargetFacility').value;
    const dispatchDate = document.getElementById('allocDispatchDate').value;
    const carrier = document.getElementById('allocCarrierVehicle').value;

    const batch = store.data.recyclableBatches.find(b => b.id === batchId);
    const facility = store.data.recyclingFacilities.find(f => f.id === facilityId);

    if (batch && facility) {
      batch.facilityId = facility.id;
      batch.facilityName = facility.name;
      batch.status = 'Allocated';
      batch.date = dispatchDate;
      batch.carrierVehicle = carrier;

      facility.currentLoadTons += Math.round(batch.weightKg / 1000);

      store.data.activityFeed.unshift({
        text: `Batch ${batchId} (${batch.weightKg}kg ${batch.stream}) allocated to ${facility.name}.`,
        time: 'Just now',
        dot: 'blue'
      });

      store.saveState();
      if (window.supabaseSync) {
        window.supabaseSync.updateBatch(batch);
        if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
      }
      closeModal('allocateBatchModal');
      renderAllViews();
      showToast(`Batch ${batchId} dispatched to ${facility.name}!`, 'success');
    }
  });
}

function openAllocateBatchModal(batchId) {
  const batch = store.data.recyclableBatches.find(b => b.id === batchId);
  if (!batch) return;

  if (store.data.recyclingFacilities.length === 0) {
    if (confirm('No partner recycling facilities registered yet! Would you like to register a facility first?')) {
      openModal('registerFacilityModal');
    }
    return;
  }

  document.getElementById('allocBatchId').value = batch.id;
  document.getElementById('allocDispatchDate').value = new Date().toISOString().split('T')[0];

  const summary = document.getElementById('allocBatchSummary');
  summary.innerHTML = `
    <strong>Batch:</strong> ${batch.id} (${batch.stream})<br>
    <strong>Quantity:</strong> ${batch.weightKg} kg | <strong>Source:</strong> Zone ${batch.sourceZone}
  `;

  const facSelect = document.getElementById('allocTargetFacility');
  facSelect.innerHTML = store.data.recyclingFacilities.map(f => `
    <option value="${f.id}">${f.name} (${f.type}) - Cap: ${f.capacityTons}t</option>
  `).join('');

  openModal('allocateBatchModal');
}

// 8. Record Processing Yield (Function 3)
function initYieldForm() {
  const form = document.getElementById('recordYieldForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const batchId = document.getElementById('yieldBatchId').value;
    const recoveredWeight = parseFloat(document.getElementById('yieldRecoveredWeight').value) || 0;
    const batch = store.data.recyclableBatches.find(b => b.id === batchId);

    if (batch) {
      batch.yieldKg = recoveredWeight;
      batch.status = 'Processed';
      const recoveryPct = ((recoveredWeight / batch.weightKg) * 100).toFixed(1);
      batch.recoveryRate = `${recoveryPct}%`;
      batch.co2SavedKg = Math.round(recoveredWeight * 1.6);

      store.data.activityFeed.unshift({
        text: `Yield certified for Batch ${batchId}: ${recoveredWeight}kg recovered (${recoveryPct}% yield).`,
        time: 'Just now',
        dot: 'emerald'
      });

      store.saveState();
      if (window.supabaseSync) {
        window.supabaseSync.updateBatch(batch);
        if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
      }
      closeModal('recordYieldModal');
      renderAllViews();
      showToast(`Yield logged for ${batchId}: ${recoveredWeight}kg recovered (${recoveryPct}% yield)!`, 'success');
    }
  });
}

function openRecordYieldModal(batchId) {
  const batch = store.data.recyclableBatches.find(b => b.id === batchId);
  if (!batch) return;

  document.getElementById('yieldBatchId').value = batch.id;
  document.getElementById('yieldGrossWeight').value = batch.weightKg;
  document.getElementById('yieldRecoveredWeight').value = Math.round(batch.weightKg * 0.9);

  const summary = document.getElementById('yieldBatchSummary');
  summary.innerHTML = `
    <strong>Batch:</strong> ${batch.id} | <strong>Stream:</strong> ${batch.stream}<br>
    <strong>Facility:</strong> ${batch.facilityName}
  `;

  openModal('recordYieldModal');
}

// 9. Add Segregation Knowledge Item Form (Function 3)
function initAddSegregationItemForm() {
  const form = document.getElementById('addSegregationItemForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('newSegName').value;
    const icon = document.getElementById('newSegIcon').value || '♻️';
    const bin = document.getElementById('newSegBin').value;
    const rating = document.getElementById('newSegRating').value || '100% Recyclable';
    const prep = document.getElementById('newSegPrep').value;

    const binNames = {
      organic: '🟢 Green Bin',
      paper: '🔵 Blue Bin',
      plastic: '🟡 Yellow Bin',
      'glass-metal': '⚪ Silver Bin',
      hazard: '🔴 Red Bin (Hazardous)'
    };

    store.data.segregationItems.unshift({
      name: name,
      bin: bin,
      binName: binNames[bin] || 'Custom Bin',
      prep: prep,
      recyclability: rating,
      icon: icon
    });

    store.saveState();
    form.reset();
    closeModal('addSegregationItemModal');
    filterSegregationGuide();
    showToast(`Added "${name}" to Segregation Guide!`, 'success');
  });
}

// 10. Lodge Grievance / Complaint Form (Function 4)
function initComplaintForm() {
  const form = document.getElementById('complaintForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const type = document.getElementById('compType').value;
    const location = document.getElementById('compLocation').value;
    const zone = document.getElementById('compZone').value;
    const priority = document.getElementById('compPriority').value;
    const details = document.getElementById('compDetails').value;

    const newId = 'CMP-' + (700 + store.data.complaints.length + 1);

    store.data.complaints.unshift({
      id: newId,
      type: type,
      location: location,
      zone: zone,
      priority: priority,
      details: details,
      date: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Open',
      resolutionNotes: null
    });

    store.data.activityFeed.unshift({
      text: `Complaint ${newId} (${type}) lodged in Zone ${zone}.`,
      time: 'Just now',
      dot: 'red'
    });

    store.saveState();
    if (window.supabaseSync && store.data.complaints.length > 0) {
      window.supabaseSync.pushComplaint(store.data.complaints[0]);
      if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
    }
    form.reset();
    closeModal('complaintModal');
    renderAllViews();
    showToast(`Complaint ${newId} logged with priority ${priority}.`, 'warning');
  });

  const filter = document.getElementById('complaintStatusFilter');
  if (filter) {
    filter.addEventListener('change', () => {
      renderComplaints(filter.value);
    });
  }
}

function resolveComplaint(compId) {
  const comp = store.data.complaints.find(c => c.id === compId);
  if (!comp) return;

  const resolution = prompt('Enter resolution summary / action taken:', 'Field technician inspected and cleared curbside area.');
  if (resolution) {
    comp.status = 'Resolved';
    comp.resolutionNotes = resolution;
    store.saveState();
    if (window.supabaseSync) {
      window.supabaseSync.updateComplaint(comp);
    }
    renderAllViews();
    showToast(`Complaint ${compId} resolved!`, 'success');
  }
}

// 11. User Registration Form (Function 4)
function initUserRegistrationForm() {
  const form = document.getElementById('registerUserForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('newUserFullName').value.trim();
    const email = document.getElementById('newUserEmail').value.trim();
    const phoneRaw = document.getElementById('newUserPhone').value.trim();

    const phoneValidation = validateSriLankanPhoneNumber(phoneRaw);
    if (!phoneValidation.valid) {
      showToast(phoneValidation.message, 'error');
      document.getElementById('newUserPhone').focus();
      return;
    }
    const phone = phoneValidation.formatted;
    const addressInput = document.getElementById('newUserAddress');
    const address = addressInput ? addressInput.value.trim() : `${zone} Curbside`;
    const role = document.getElementById('newUserRole').value;
    const zone = document.getElementById('newUserZone').value;
    const setActiveCheckbox = document.getElementById('newUserSetActive');
    const setActive = setActiveCheckbox ? setActiveCheckbox.checked : true;

    const newId = 'USR-' + (100 + store.data.users.length + 1);

    const userRecord = {
      id: newId,
      name: name,
      email: email,
      phone: phone,
      address: address,
      role: role,
      zone: zone,
      status: 'Active',
      ecoPoints: 0,
      totalRecycledKg: 0,
      pickupsCompleted: 0,
      registeredOn: new Date().toISOString().split('T')[0]
    };

    store.data.users.push(userRecord);

    if (role === 'Crew Leader' || role === 'Manager' || role === 'Crew Driver') {
      if (!store.data.personnel) store.data.personnel = [];
      const staffRole = role === 'Crew Leader' ? 'Crew Leader' : role === 'Crew Driver' ? 'Driver' : 'Recycling Center Manager';
      if (!store.data.personnel.some(p => p.email === email)) {
        store.data.personnel.push({
          id: 'PER-' + (100 + store.data.personnel.length + 1),
          name: name,
          role: staffRole,
          phone: phone,
          email: email,
          zone: zone,
          assignment: role === 'Crew Leader' ? `Field Hauler Unit (${zone})` : role === 'Crew Driver' ? `Heavy Transport Truck (${zone})` : `Recycling Center MRF (${zone})`,
          status: 'Active / On Duty'
        });
      }
    }

    if (setActive) {
      store.data.userProfile = {
        id: newId,
        name: name,
        email: email,
        phone: phone,
        role: role,
        accountType: role === 'Business' ? 'Commercial Business' : role === 'Admin' ? 'Municipal Admin' : role === 'Manager' ? 'Center Manager' : role === 'Crew Leader' ? 'Operations Personnel' : 'Residential Account',
        address: address,
        zone: zone,
        ecoPoints: 0,
        totalRecycledKg: 0,
        pickupsCompleted: 0
      };

      // Apply role UI adjustments if this user was made active
      applyRolePermissions(userRecord);

      // Pre-fill pickup request form inputs
      const reqAddress = document.getElementById('reqPickupAddress');
      if (reqAddress) reqAddress.value = address;
      const reqZone = document.getElementById('reqPickupZone');
      if (reqZone) reqZone.value = zone;
    }

    store.data.activityFeed.unshift({
      text: `New user account created: ${name} (${role}, Zone ${zone}).`,
      time: 'Just now',
      dot: 'emerald'
    });

    store.saveState();
    if (window.supabaseSync) {
      window.supabaseSync.pushUser(userRecord);
      if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
    }
    form.reset();
    closeModal('registerUserModal');
    renderAllViews();
    showToast(`User account "${name}" created and set as active user!`, 'success');
  });

  const searchInput = document.getElementById('userAdminSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderUserAdmin(e.target.value.toLowerCase());
    });
  }
}

// -----------------------------------------------------------------------------
// Segregation Search & Knowledge Wizard
// -----------------------------------------------------------------------------
function initSegregationSearch() {
  const searchInput = document.getElementById('segregationSearchInput');
  const clearBtn = document.getElementById('clearSegregationSearch');
  const chips = document.querySelectorAll('#binFilterChips .bin-chip');

  let activeBinFilter = 'all';

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterSegregationGuide(searchInput.value.toLowerCase(), activeBinFilter);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterSegregationGuide('', activeBinFilter);
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeBinFilter = chip.getAttribute('data-bin');
      filterSegregationGuide(searchInput ? searchInput.value.toLowerCase() : '', activeBinFilter);
    });
  });
}

function filterSegregationGuide(query = '', bin = 'all') {
  const container = document.getElementById('segregationGuideGrid');
  if (!container) return;

  const filtered = store.data.segregationItems.filter(item => {
    const matchQuery = item.name.toLowerCase().includes(query) ||
                       item.prep.toLowerCase().includes(query) ||
                       item.recyclability.toLowerCase().includes(query);
    const matchBin = bin === 'all' || item.bin === bin;
    return matchQuery && matchBin;
  });

  if (filtered.length === 0) {
    const roleKey = normalizeRole(store.data.currentUser?.role || store.data.activeRole);
    const addBtnHtml = (roleKey === 'admin' || roleKey === 'manager')
      ? `<button class="btn btn-primary" onclick="openModal('addSegregationItemModal')">+ Add Item to Guide</button>`
      : '';
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <span class="empty-state-icon">🔍</span>
        <div class="empty-state-title">No items found matching "${query}"</div>
        <p class="empty-state-desc">${(roleKey === 'admin' || roleKey === 'manager') ? 'You can define and add this item to the municipal segregation guide.' : 'Please try searching for another common waste item or browse categories below.'}</p>
        ${addBtnHtml}
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="guide-card">
      <div class="guide-item-top">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.4rem;">${item.icon}</span>
          <span class="guide-item-name">${item.name}</span>
        </div>
        <span class="guide-bin-badge ${item.bin}">${item.binName}</span>
      </div>
      <p class="guide-prep-text"><strong>Disposal Rule:</strong> ${item.prep}</p>
      <div style="font-size:0.75rem; color:var(--primary); font-weight:700; margin-top:auto;">
        ♻️ ${item.recyclability}
      </div>
    </div>
  `).join('');
}

// =============================================================================
// 4. View Renderers (Complete UI Update Pipeline)
// =============================================================================
function renderAllViews() {
  renderDashboard();
  renderFunction1();
  renderFunction2();
  renderFunction3();
  renderFunction4();
  updateBadges();
  renderCharts();
}

function updateBadges() {
  const pendingRequests = store.data.requests.filter(r => r.status === 'Submitted' || r.status === 'Assigned').length;
  const activeJobs = store.data.requests.filter(r => r.status === 'In Progress' || r.status === 'Assigned').length;
  const openComplaints = store.data.complaints.filter(c => c.status !== 'Resolved').length;

  const bReq = document.getElementById('badgePendingRequests');
  const bJobs = document.getElementById('badgeActiveJobs');
  const bComp = document.getElementById('badgeOpenComplaints');

  if (bReq) bReq.textContent = pendingRequests;
  if (bJobs) bJobs.textContent = activeJobs;
  if (bComp) bComp.textContent = openComplaints;
}

// -----------------------------------------------------------------------------
// Render Dashboard (Tab 0)
// -----------------------------------------------------------------------------
function renderDashboard() {
  const zoneFilter = document.getElementById('dashboardZoneFilter') ? document.getElementById('dashboardZoneFilter').value : 'all';

  let reqs = store.data.requests;
  let batches = store.data.recyclableBatches;

  if (zoneFilter !== 'all') {
    reqs = reqs.filter(r => r.zone === zoneFilter);
    batches = batches.filter(b => b.sourceZone.includes(zoneFilter));
  }

  const activeReqCount = reqs.filter(r => r.status !== 'Collected').length;
  const collectedKg = reqs.filter(r => r.status === 'Collected').reduce((sum, r) => sum + (r.actualKg || 0), 0);
  const totalBatchKg = batches.reduce((sum, b) => sum + b.weightKg, 0);

  const totalKg = collectedKg + totalBatchKg;
  const totalDivertedKg = batches.filter(b => b.status === 'Processed' || b.status === 'Allocated').reduce((sum, b) => sum + b.weightKg, 0);
  const diversionRate = totalKg > 0 ? ((totalDivertedKg / totalKg) * 100).toFixed(1) : '0.0';

  const kpiReq = document.getElementById('kpiActiveRequests');
  const kpiKg = document.getElementById('kpiCollectedToday');
  const kpiRate = document.getElementById('kpiRecyclingRate');
  const kpiCrew = document.getElementById('kpiActiveCrews');

  if (kpiReq) kpiReq.textContent = activeReqCount;
  if (kpiKg) kpiKg.textContent = `${totalKg.toLocaleString()} kg`;
  if (kpiRate) kpiRate.textContent = `${diversionRate}%`;

  const activeCrews = store.data.crews.filter(c => c.status.includes('Active')).length;
  if (kpiCrew) kpiCrew.textContent = `${activeCrews} / ${store.data.crews.length}`;

  // Dynamic KPI trends
  const trendReq = document.getElementById('kpiTrendRequests');
  const trendKg = document.getElementById('kpiTrendCollected');
  const trendRate = document.getElementById('kpiTrendRecycling');
  const subCrew = document.getElementById('kpiSubtextCrews');

  if (trendReq) {
    if (activeReqCount > 0) {
      trendReq.textContent = `${activeReqCount} active requests`;
      trendReq.className = 'kpi-trend positive';
    } else {
      trendReq.textContent = 'No active requests';
      trendReq.className = 'kpi-trend neutral';
    }
  }

  if (trendKg) {
    if (totalKg > 0) {
      trendKg.textContent = `${totalKg.toLocaleString()} kg total volume`;
      trendKg.className = 'kpi-trend positive';
    } else {
      trendKg.textContent = 'No collection logged';
      trendKg.className = 'kpi-trend neutral';
    }
  }

  if (trendRate) {
    if (parseFloat(diversionRate) > 0) {
      trendRate.textContent = `${diversionRate}% diverted from landfill`;
      trendRate.className = 'kpi-trend positive';
    } else {
      trendRate.textContent = 'Awaiting processing';
      trendRate.className = 'kpi-trend neutral';
    }
  }

  if (subCrew) {
    if (store.data.crews.length > 0) {
      subCrew.textContent = `${activeCrews} active out of ${store.data.crews.length} crews`;
    } else {
      subCrew.textContent = '0 on standby';
    }
  }

  // Sidebar eco counter
  const sidebarTons = document.getElementById('sidebarDivertedTons');
  const sidebarCo2 = document.getElementById('sidebarCo2Saved');
  if (sidebarTons) sidebarTons.textContent = (totalDivertedKg / 1000).toFixed(1);
  if (sidebarCo2) sidebarCo2.textContent = `${((totalDivertedKg * 1.5) / 1000).toFixed(1)}t`;

  // Zone Progress Bars
  const zones = ['Colombo Fort', 'Kollupitiya', 'Borella', 'Wellawatte', 'Dehiwala', 'Kotte', 'Nugegoda'];
  const zoneContainer = document.getElementById('zoneProgressContainer');
  if (zoneContainer) {
    zoneContainer.innerHTML = zones.map(z => {
      const zReqs = store.data.requests.filter(r => r.zone === z);
      const total = zReqs.length;
      const completed = zReqs.filter(r => r.status === 'Collected').length;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      return `
        <div class="zone-item">
          <div class="zone-header-row">
            <span>${z}</span>
            <span class="text-emerald font-bold">${pct}% (${completed}/${total} stops)</span>
          </div>
          <div class="zone-bar-bg">
            <div class="zone-bar-fill" style="width: ${pct}%; background: ${pct > 80 ? '#10b981' : pct > 50 ? '#0284c7' : '#f59e0b'};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Activity Feed
  const feedContainer = document.getElementById('dashboardActivityFeed');
  if (feedContainer) {
    if (store.data.activityFeed.length === 0) {
      feedContainer.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">No activity logged yet. Operations will record here live.</div>`;
    } else {
      feedContainer.innerHTML = store.data.activityFeed.slice(0, 6).map(item => `
        <div class="feed-item">
          <span class="feed-dot ${item.dot}"></span>
          <div class="feed-body">
            <span class="feed-text">${item.text}</span>
            <span class="feed-time">${item.time}</span>
          </div>
        </div>
      `).join('');
    }
  }
}

// -----------------------------------------------------------------------------
// Render Function 1 (Requests & Residents)
// -----------------------------------------------------------------------------
function renderFunction1() {
  const user = store.data.userProfile;
  const nameDisplay = document.getElementById('residentBannerName');
  const addrDisplay = document.getElementById('residentBannerAddress');
  const idDisplay = document.getElementById('residentBannerId');
  const pointsDisplay = document.getElementById('residentBannerPoints');
  const recDisplay = document.getElementById('residentTotalRecycled');
  const pickupsDisplay = document.getElementById('residentTotalPickups');
  const typeDisplay = document.getElementById('residentBannerType');

  if (nameDisplay) nameDisplay.textContent = user.name;
  if (addrDisplay) addrDisplay.textContent = `📍 ${user.address}, Zone: ${user.zone}`;
  if (idDisplay) idDisplay.textContent = user.id;
  if (pointsDisplay) pointsDisplay.textContent = user.ecoPoints.toLocaleString();
  const phoneDisplay = document.getElementById('residentBannerPhone');
  if (phoneDisplay) phoneDisplay.textContent = formatToSriLankanPhone(user.phone);
  if (recDisplay) recDisplay.textContent = `${user.totalRecycledKg} kg`;
  if (pickupsDisplay) pickupsDisplay.textContent = `${user.pickupsCompleted} completed`;
  if (typeDisplay) typeDisplay.textContent = user.accountType || 'Residential Account';

  // Top nav user name
  const topUserName = document.getElementById('userNameDisplay');
  const topUserZone = document.getElementById('userZoneDisplay');
  if (topUserName) topUserName.textContent = user.name;
  if (topUserZone) topUserZone.textContent = `Zone: ${user.zone}`;

  renderActiveRequests();
  renderCollectionHistory();

  const activeZone = user.zone || 'Colombo Fort';
  const zonePills = document.querySelectorAll('#scheduleZonePills .pill-btn');
  zonePills.forEach(p => {
    if (p.getAttribute('data-zone') === activeZone) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
  renderWeeklySchedules(activeZone);
}

function renderActiveRequests(categoryFilter = 'all') {
  const container = document.getElementById('f1RequestCardsList');
  if (!container) return;

  let requests = store.data.requests;
  if (categoryFilter !== 'all') {
    requests = requests.filter(r => r.category === categoryFilter);
  }

  if (requests.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">🗑️</span>
        <div class="empty-state-title">No Active Waste Pickup Requests</div>
        <p class="empty-state-desc">You have not scheduled any pickup requests yet. Submit a request to arrange doorstep collection.</p>
        <button class="btn btn-primary" onclick="openModal('requestPickupModal')">+ New Pickup Request</button>
      </div>
    `;
    return;
  }

  container.innerHTML = requests.map(req => {
    const stages = ['Submitted', 'Assigned', 'In Progress', 'Collected'];
    let currentIndex = stages.indexOf(req.status);
    if (req.status === 'Missed') currentIndex = -1;

    const streamClass = req.category.toLowerCase().includes('plastic') ? 'plastic' :
                        req.category.toLowerCase().includes('organic') ? 'organic' :
                        req.category.toLowerCase().includes('paper') ? 'paper' :
                        req.category.toLowerCase().includes('waste') ? 'ewaste' : 'hazardous';

    return `
      <div class="request-card">
        <div class="req-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="req-id">${req.id}</span>
            <span class="req-stream-badge ${streamClass}">${req.category}</span>
          </div>
          <div class="req-meta-right">
            <span class="status-pill ${req.status === 'Collected' ? 'active' : req.status === 'Cancelled' ? 'cancelled' : req.status === 'Missed' ? 'danger' : 'pending'}">${req.status}</span>
            <span class="text-muted" style="font-size:0.8rem;">📅 ${req.date} (${req.timeSlot})</span>
          </div>
        </div>

        <div class="req-details-grid">
          <div class="req-image-thumb">
            ${req.image ? `<img src="${req.image}" alt="Waste Verification Photo">` : `<div class="req-image-placeholder">No photo uploaded</div>`}
          </div>
          <div class="req-info-col">
            <div class="req-qty-line">Estimated: ${req.estimatedKg} kg ${req.actualKg ? `• <span class="text-emerald">Verified: ${req.actualKg} kg</span>` : ''}</div>
            <div class="req-location-line">📍 ${req.address} (Zone: ${req.zone})</div>
            <div class="req-location-line">Assigned Team: <strong>${req.assignedCrew && req.assignedCrew !== 'Unassigned' ? req.assignedCrew : '<span style="color:#d97706; font-weight:700;">⚠️ Unassigned (Pending Dispatch)</span>'}</strong></div>
            ${req.facilityName ? `<div class="req-location-line" style="color:var(--primary); font-weight:600;">♻️ Drop-off MRF: <strong>${req.facilityName}</strong></div>` : ''}
            ${req.notes ? `<div class="req-notes-line">📝 ${req.notes}</div>` : ''}
            ${req.missedReason ? `<div class="req-notes-line" style="color:var(--danger); background:#fee2e2;">⚠️ Failure Reason: ${req.missedReason}</div>` : ''}
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
            ${(function() {
              const roleKey = normalizeRole(store.data.currentUser?.role || store.data.activeRole);
              if (roleKey === 'user') {
                if (req.status !== 'Collected' && req.status !== 'Cancelled') {
                  return `<button class="btn-cancel-req" onclick="cancelPickupRequest('${req.id}')">❌ Cancel Request</button>`;
                } else if (req.status === 'Cancelled') {
                  return `<span class="status-pill cancelled">Cancelled</span>`;
                } else {
                  return `<span style="font-size:0.75rem; color:var(--primary); font-weight:700;">+${req.pointsAwarded || 0} pts awarded</span>`;
                }
              } else if (roleKey === 'crew_leader') {
                if (req.status === 'Cancelled') {
                  return `<span class="status-pill cancelled">Cancelled</span>`;
                }
                const isUnassigned = !req.assignedCrew || req.assignedCrew === 'Unassigned' || req.status === 'Submitted';
                return `
                  <button class="btn btn-sm ${isUnassigned ? 'btn-primary' : 'btn-outline'} btn-update-req" onclick="openUpdateRequestModal('${req.id}')">${isUnassigned ? '📋 Assign Crew' : '✏️ Update Request'}</button>
                  ${req.status !== 'Collected' && req.status !== 'Missed' ? `
                    <button class="btn btn-sm btn-primary" onclick="openRecordCollectionModal('${req.id}')">⚖️ Weigh & Complete</button>
                  ` : req.status === 'Collected' ? `
                    <span style="font-size:0.75rem; color:var(--primary); font-weight:700;">+${req.pointsAwarded} pts verified</span>
                  ` : `
                    <button class="btn btn-sm btn-danger" onclick="rescheduleMissed('${req.id}')">Reschedule</button>
                  `}
                `;
              } else {
                const isUnassigned = !req.assignedCrew || req.assignedCrew === 'Unassigned' || req.status === 'Submitted';
                return `
                  <button class="btn btn-sm ${isUnassigned ? 'btn-primary' : 'btn-outline'} btn-update-req" onclick="openUpdateRequestModal('${req.id}')">${isUnassigned ? '📋 Assign Crew' : '✏️ Update Request'}</button>
                  ${req.status !== 'Collected' && req.status !== 'Missed' && req.status !== 'Cancelled' ? `
                    <button class="btn btn-sm btn-primary" onclick="openRecordCollectionModal('${req.id}')">Crew Action</button>
                    <button class="btn-cancel-req" onclick="cancelPickupRequest('${req.id}')">❌ Cancel</button>
                  ` : req.status === 'Cancelled' ? `
                    <span class="status-pill cancelled">Cancelled</span>
                  ` : req.status === 'Collected' ? `
                    <span style="font-size:0.75rem; color:var(--primary); font-weight:700;">+${req.pointsAwarded} pts awarded</span>
                  ` : `
                    <button class="btn btn-sm btn-danger" onclick="rescheduleMissed('${req.id}')">Reschedule</button>
                  `}
                `;
              }
            })()}
          </div>
        </div>

        <div class="stepper-wrap">
          <div class="stepper-track">
            ${stages.map((st, idx) => {
              const isCompleted = currentIndex >= idx;
              const isActive = currentIndex === idx;
              return `
                <div class="step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
                  <div class="step-circle">${isCompleted ? '✓' : idx + 1}</div>
                  <span class="step-title">${st}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderCollectionHistory(searchQuery = '') {
  const tbody = document.getElementById('f1HistoryTableBody');
  if (!tbody) return;

  const history = store.data.requests.filter(r => {
    if (!searchQuery) return true;
    return r.id.toLowerCase().includes(searchQuery) ||
           r.category.toLowerCase().includes(searchQuery) ||
           r.address.toLowerCase().includes(searchQuery);
  });

  if (history.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">No collection history recorded yet. Completed pickups will be archived here.</td></tr>`;
    return;
  }

  tbody.innerHTML = history.map(r => `
    <tr>
      <td><strong>${r.id}</strong></td>
      <td>${r.category}</td>
      <td>${r.estimatedKg} kg ${r.actualKg ? `/ <strong>${r.actualKg} kg</strong>` : '/ Pending'}</td>
      <td>${r.date}</td>
      <td>${r.assignedCrew || 'Unassigned'}</td>
      <td><span class="status-pill ${r.status === 'Collected' ? 'active' : r.status === 'Cancelled' ? 'cancelled' : r.status === 'Missed' ? 'danger' : 'pending'}">${r.status}</span></td>
      <td><strong class="text-emerald">${r.pointsAwarded ? `+${r.pointsAwarded}` : '0'}</strong></td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="alert('Digital Municipal Weight Receipt\\n\\nID: ${r.id}\\nResident: ${r.residentName}\\nWeight: ${r.actualKg || r.estimatedKg} kg\\nDate: ${r.date}\\nZone: ${r.zone}\\nStatus: Verified')">Receipt</button>
      </td>
    </tr>
  `).join('');
}

function renderWeeklySchedules(zone) {
  const container = document.getElementById('zoneScheduleGrid');
  if (!container) return;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const scheds = store.data.schedules.filter(s => s.zone === zone);

  container.innerHTML = days.map(day => {
    const dayScheds = scheds.filter(s => s.day === day);
    return `
      <div class="schedule-day-card">
        <div class="day-name">${day}</div>
        ${dayScheds.length > 0 ? dayScheds.map(daySched => `
          <div style="margin-bottom:8px; padding-bottom:6px; border-bottom:1px dashed var(--border-color);">
            <div class="sched-stream-pill">${daySched.stream}</div>
            <div class="sched-time">⏰ ${daySched.timeSlot}</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">🚛 ${daySched.crewName}</div>
          </div>
        `).join('') : `
          <div style="font-size:0.75rem; color:var(--text-subtle);">No route scheduled</div>
        `}
      </div>
    `;
  }).join('');
}

// -----------------------------------------------------------------------------
// Render Function 2 (Crew, Personnel & Scheduling)
// -----------------------------------------------------------------------------
function renderFunction2() {
  populateCrewSelector();
  populatePersonnelDatalists();
  renderDailyJobs();
  renderCrewRoster();
  renderPersonnelRoster();
  renderDispatchBoard();
  renderMasterSchedules();
}

function populateCrewPersonnelDropdowns() {
  const staff = store.data.personnel || [];

  // 1. Crew Leaders (Strictly from registered personnel)
  const leaders = staff.filter(p => p.role === 'Crew Leader');
  const leaderList = leaders.length > 0 ? leaders : staff;
  const leaderOptions = leaderList.map(p => `
    <option value="${p.name}">${p.name} — ${p.role} (${p.zone})</option>
  `).join('');

  const newLeaderSel = document.getElementById('newCrewLeader');
  if (newLeaderSel) newLeaderSel.innerHTML = leaderOptions || '<option value="">No registered personnel available</option>';

  const editLeaderSel = document.getElementById('editCrewLeader');
  if (editLeaderSel) editLeaderSel.innerHTML = leaderOptions || '<option value="">No registered personnel available</option>';

  // 2. Heavy Vehicle Drivers
  const drivers = staff.filter(p => p.role === 'Driver');
  const driverList = drivers.length > 0 ? drivers : staff;
  const driverOptions = driverList.map(p => `
    <option value="${p.name}">${p.name} (${p.assignment || p.zone})</option>
  `).join('');

  const newDriverSel = document.getElementById('newCrewDriver');
  if (newDriverSel) newDriverSel.innerHTML = driverOptions || '<option value="">No registered drivers</option>';

  const editDriverSel = document.getElementById('editCrewDriver');
  if (editDriverSel) editDriverSel.innerHTML = driverOptions || '<option value="">No registered drivers</option>';

  // 3. Center Managers
  const managers = staff.filter(p => p.role === 'Recycling Center Manager');
  const mgrList = managers.length > 0 ? managers : staff;
  const mgrOptions = mgrList.map(p => `
    <option value="${p.name}">${p.name} (${p.assignment || p.zone})</option>
  `).join('');

  const newMgrSel = document.getElementById('newCrewCenterManager');
  if (newMgrSel) newMgrSel.innerHTML = mgrOptions || '<option value="">No registered center managers</option>';

  const editMgrSel = document.getElementById('editCrewCenterManager');
  if (editMgrSel) editMgrSel.innerHTML = mgrOptions || '<option value="">No registered center managers</option>';
}
window.populateCrewPersonnelDropdowns = populateCrewPersonnelDropdowns;

function populatePersonnelDatalists() {
  populateCrewPersonnelDropdowns();
  const leaderList = document.getElementById('crewLeaderList');
  const driverList = document.getElementById('crewDriverList');
  const managerList = document.getElementById('crewCenterManagerList');

  const staff = store.data.personnel || [];

  if (leaderList) {
    const leaders = staff.filter(p => p.role === 'Crew Leader');
    leaderList.innerHTML = leaders.map(l => `<option value="${l.name}">${l.name} (${l.zone})</option>`).join('');
  }

  if (driverList) {
    const drivers = staff.filter(p => p.role === 'Driver');
    driverList.innerHTML = drivers.map(d => `<option value="${d.name}">${d.name} (${d.assignment || d.zone})</option>`).join('');
  }

  if (managerList) {
    const managers = staff.filter(p => p.role === 'Recycling Center Manager');
    managerList.innerHTML = managers.map(m => `<option value="${m.name}">${m.name} (${m.assignment || m.zone})</option>`).join('');
  }
}

let currentPersonnelRoleFilter = 'all';
let currentPersonnelSearchTerm = '';

function initPersonnelSearchAndFilter() {
  const searchInput = document.getElementById('personnelSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentPersonnelSearchTerm = e.target.value.toLowerCase().trim();
      renderPersonnelCards();
    });
  }

  const pills = document.querySelectorAll('#personnelRoleFilterPills .pill-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentPersonnelRoleFilter = pill.getAttribute('data-role-filter');
      renderPersonnelCards();
    });
  });
}

function renderPersonnelRoster() {
  if (!store.data.personnel) store.data.personnel = [];

  const staff = store.data.personnel;

  // Update KPI counters
  const totalEl = document.getElementById('kpiTotalPersonnel');
  const leadersEl = document.getElementById('kpiCrewLeaders');
  const driversEl = document.getElementById('kpiDrivers');
  const managersEl = document.getElementById('kpiCenterManagers');

  if (totalEl) totalEl.textContent = staff.length;
  if (leadersEl) leadersEl.textContent = staff.filter(p => p.role === 'Crew Leader').length;
  if (driversEl) driversEl.textContent = staff.filter(p => p.role === 'Driver').length;
  if (managersEl) managersEl.textContent = staff.filter(p => p.role === 'Recycling Center Manager').length;

  renderPersonnelCards();
}

function renderPersonnelCards() {
  const container = document.getElementById('personnelCardsGrid');
  if (!container) return;

  if (!store.data.personnel) store.data.personnel = [];
  let filtered = store.data.personnel;

  if (currentPersonnelRoleFilter !== 'all') {
    filtered = filtered.filter(p => p.role === currentPersonnelRoleFilter);
  }

  if (currentPersonnelSearchTerm) {
    filtered = filtered.filter(p =>
      (p.name && p.name.toLowerCase().includes(currentPersonnelSearchTerm)) ||
      (p.role && p.role.toLowerCase().includes(currentPersonnelSearchTerm)) ||
      (p.phone && p.phone.toLowerCase().includes(currentPersonnelSearchTerm)) ||
      (p.zone && p.zone.toLowerCase().includes(currentPersonnelSearchTerm)) ||
      (p.assignment && p.assignment.toLowerCase().includes(currentPersonnelSearchTerm))
    );
  }

  if (filtered.length === 0) {
    const isFiltered = store.data.personnel.length > 0;
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <span class="empty-state-icon">👥</span>
        <div class="empty-state-title">${isFiltered ? 'No Matching Personnel Found' : 'No Operations Personnel Registered'}</div>
        <p class="empty-state-desc">${isFiltered ? 'Try adjusting your search query or role filter.' : 'Add Crew Leaders, Heavy Vehicle Drivers, and Recycling Center Managers to build your operations roster.'}</p>
        <button class="btn btn-primary" onclick="openModal('registerPersonnelModal')">+ Add Operations Personnel</button>
      </div>
    `;
    return;
  }

  const roleMeta = {
    'Crew Leader': { icon: '🎖️', class: 'role-tag-leader', title: 'Crew Leader / Field Supervisor' },
    'Driver': { icon: '🚛', class: 'role-tag-driver', title: 'Heavy Vehicle Driver' },
    'Recycling Center Manager': { icon: '♻️', class: 'role-tag-manager', title: 'Recycling Center Manager' }
  };

  container.innerHTML = filtered.map(p => {
    const meta = roleMeta[p.role] || { icon: '👤', class: 'role-tag-default', title: p.role };
    const statusClass = (p.status || '').includes('Active') ? 'active' : (p.status || '').includes('Standby') ? 'info' : 'neutral';

    return `
      <div class="personnel-card">
        <div class="personnel-card-header">
          <div class="personnel-avatar-wrap">
            <div class="personnel-avatar ${meta.class}">
              <span>${meta.icon}</span>
            </div>
            <div>
              <div class="personnel-name">${p.name}</div>
              <span class="personnel-role-tag ${meta.class}">${meta.icon} ${p.role}</span>
            </div>
          </div>
          <span class="status-pill ${statusClass}">${p.status || 'Active'}</span>
        </div>

        <div class="personnel-details-list">
          <div class="personnel-detail-row">
            <span class="detail-label">📞 Phone:</span>
            <span class="detail-val"><strong>${formatToSriLankanPhone(p.phone) || 'N/A'}</strong></span>
          </div>
          <div class="personnel-detail-row">
            <span class="detail-label">✉️ Email:</span>
            <span class="detail-val text-muted">${p.email || 'N/A'}</span>
          </div>
          <div class="personnel-detail-row">
            <span class="detail-label">📍 Zone:</span>
            <span class="detail-val"><span class="tag-badge info">${p.zone || 'All Zones'}</span></span>
          </div>
          <div class="personnel-detail-row">
            <span class="detail-label">📌 Scope / Unit:</span>
            <span class="detail-val"><strong>${p.assignment || 'General Field Unit'}</strong></span>
          </div>
        </div>

        <div class="personnel-card-footer">
          <button class="btn-outline-danger" onclick="deletePersonnel('${p.id}')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            <span>Remove</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.deletePersonnel = function(id) {
  const person = (store.data.personnel || []).find(p => p.id === id);
  const name = person ? person.name : 'this staff member';
  if (confirm(`Are you sure you want to remove ${name} from operations personnel?`)) {
    store.data.personnel = (store.data.personnel || []).filter(p => p.id !== id);
    store.saveState();
    renderPersonnelRoster();
    populatePersonnelDatalists();
    showToast(`Removed ${name} from operations personnel.`, 'info');
  }
};

window.deleteCrew = function(crewId) {
  const crew = store.data.crews.find(c => c.id === crewId);
  const name = crew ? crew.name : 'this crew';
  if (confirm(`Are you sure you want to delete ${name}?`)) {
    store.data.crews = store.data.crews.filter(c => c.id !== crewId);
    store.saveState();
    if (window.supabaseSync) {
      window.supabaseSync.deleteCrew(crewId);
    }
    renderAllViews();
    showToast(`Deleted ${name}.`, 'info');
  }
};

function populateCrewSelector() {
  const selector = document.getElementById('activeCrewSelector');
  if (!selector) return;

  const currentVal = selector.value || 'all';
  const allOption = `<option value="all">🌟 All Assigned Requests (All Crews)</option>`;
  const crewOptions = (store.data.crews || []).map(c => `
    <option value="${c.name}">🚛 ${c.name} (${c.zone})</option>
  `).join('');

  selector.innerHTML = allOption + crewOptions;

  if (currentVal && (currentVal === 'all' || Array.from(selector.options).some(o => o.value === currentVal))) {
    selector.value = currentVal;
  } else {
    selector.value = 'all';
  }
}

function renderDailyJobs() {
  const container = document.getElementById('dailyJobsList');
  const selector = document.getElementById('activeCrewSelector');
  if (!container) return;

  // Retrieve current selection or default to 'all' to display all assigned requests
  const selectedCrewName = selector ? (selector.value || 'all') : 'all';
  const isAll = selectedCrewName === 'all';

  // Filter all requests that have been assigned to a crew
  const allAssignedJobs = (store.data.requests || []).filter(r => 
    r.assignedCrew && 
    r.assignedCrew !== 'Unassigned' && 
    r.assignedCrew.trim() !== '' &&
    r.status !== 'Cancelled'
  );

  const crewJobs = isAll 
    ? allAssignedJobs 
    : allAssignedJobs.filter(r => r.assignedCrew === selectedCrewName);

  // Render or update activeCrewMetaBar in the daily jobs subpane
  let metaBar = document.getElementById('activeCrewMetaBar');
  if (!metaBar && container) {
    metaBar = document.createElement('div');
    metaBar.id = 'activeCrewMetaBar';
    metaBar.className = 'crew-active-meta-bar';
    container.parentNode.insertBefore(metaBar, container);
  }

  if (metaBar) {
    metaBar.style.display = 'flex';
    if (isAll) {
      const pendingCount = allAssignedJobs.filter(j => j.status !== 'Collected' && j.status !== 'Missed').length;
      const collectedCount = allAssignedJobs.filter(j => j.status === 'Collected').length;
      const missedCount = allAssignedJobs.filter(j => j.status === 'Missed').length;
      const totalEstimatedKg = allAssignedJobs.reduce((sum, j) => sum + (j.actualKg || j.estimatedKg || 0), 0);

      metaBar.innerHTML = `
        <div class="crew-meta-item"><span>📋 All Assigned Stops:</span> <strong>${allAssignedJobs.length} Stops</strong></div>
        <div class="crew-meta-divider">|</div>
        <div class="crew-meta-item"><span>⏳ Pending / In Route:</span> <strong class="text-primary">${pendingCount}</strong></div>
        <div class="crew-meta-divider">|</div>
        <div class="crew-meta-item"><span>✅ Collected & Weighed:</span> <strong class="text-emerald">${collectedCount}</strong></div>
        ${missedCount > 0 ? `
          <div class="crew-meta-divider">|</div>
          <div class="crew-meta-item"><span class="text-danger">⚠️ Missed:</span> <strong class="text-danger">${missedCount}</strong></div>
        ` : ''}
        <div class="crew-meta-divider">|</div>
        <div class="crew-meta-item"><span>⚖️ Est. Waste Load:</span> <strong>~${totalEstimatedKg} kg</strong></div>
        <div class="crew-meta-divider">|</div>
        <div class="crew-meta-item"><span>🚛 Fleets:</span> <strong>${store.data.crews.length} Crews</strong></div>
      `;
    } else {
      const currentCrewObj = store.data.crews.find(c => c.name === selectedCrewName);
      if (currentCrewObj) {
        metaBar.innerHTML = `
          <div class="crew-meta-item"><span>🎖️ Leader:</span> <strong>${currentCrewObj.leader || currentCrewObj.driver || 'N/A'}</strong></div>
          <div class="crew-meta-divider">|</div>
          <div class="crew-meta-item"><span>🚛 Driver:</span> <strong>${currentCrewObj.driver || 'N/A'}</strong></div>
          <div class="crew-meta-divider">|</div>
          <div class="crew-meta-item"><span>♻️ Center Mgr:</span> <strong>${currentCrewObj.centerManager || 'N/A'}</strong></div>
          <div class="crew-meta-divider">|</div>
          <div class="crew-meta-item"><span>📍 Zone:</span> <strong>${currentCrewObj.zone}</strong></div>
          <div class="crew-meta-divider">|</div>
          <div class="crew-meta-item"><span>🚚 Vehicle:</span> <strong>${currentCrewObj.truckId}</strong></div>
          <div class="crew-meta-divider">|</div>
          <div class="crew-meta-item"><span>📋 Stops:</span> <strong>${crewJobs.length} Assigned</strong></div>
        `;
      } else {
        metaBar.style.display = 'none';
      }
    }
  }

  if (crewJobs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">📋</span>
        <div class="empty-state-title">${isAll ? 'No Assigned Requests Found' : `No Stops Assigned to ${selectedCrewName}`}</div>
        <p class="empty-state-desc">${isAll 
          ? 'There are currently no pickup requests assigned to any collection crew. Dispatch pending citizen requests from the dispatch queue.' 
          : `No stops currently assigned to ${selectedCrewName} for today. Dispatch pending requests from the dispatch queue or switch to All Crews.`}
        </p>
        <button class="btn btn-primary" onclick="document.querySelector('[data-f2sub=dispatch-board]').click()">Go to Dispatch Queue →</button>
      </div>
    `;
    return;
  }

  container.innerHTML = crewJobs.map((job, idx) => `
    <div class="job-card ${job.status === 'Collected' ? 'completed' : job.status === 'Missed' ? 'missed' : ''}">
      <div class="job-info-left">
        <div class="job-seq-badge">#${idx + 1}</div>
        <div class="job-main-data">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">
            <span class="job-address">${job.address} (Zone ${job.zone})</span>
            <span class="tag-badge info" style="font-weight:700;">🚛 ${job.assignedCrew}</span>
            <span class="status-pill ${job.status === 'Collected' ? 'active' : job.status === 'Missed' ? 'danger' : 'pending'}" style="font-size:0.75rem;">${job.status}</span>
          </div>
          <div class="job-submeta">
            <span>Resident: <strong>${job.residentName}</strong></span>
            <span>Waste: <strong>${job.category} (~${job.estimatedKg}kg)</strong></span>
            <span>Slot: <strong>${job.date} • ${job.timeSlot}</strong></span>
          </div>
          ${job.notes ? `<span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-top:3px;">Note: ${job.notes}</span>` : ''}
          ${job.actualKg ? `<span style="font-size:0.75rem; color:var(--success); font-weight:700; display:block; margin-top:2px;">✅ Scale verified: ${job.actualKg} kg (${job.facilityName || 'Storage Center'})</span>` : ''}
          ${job.missedReason ? `<span style="font-size:0.75rem; color:var(--danger); font-weight:700; display:block; margin-top:2px;">⚠️ Missed: ${job.missedReason}</span>` : ''}
        </div>
      </div>
      <div class="job-actions">
        ${job.status !== 'Collected' && job.status !== 'Missed' ? `
          <button class="btn btn-sm btn-primary" onclick="openRecordCollectionModal('${job.id}')">⚖️ Weigh & Complete</button>
          <button class="btn btn-sm btn-danger" onclick="quickMarkMissed('${job.id}')">⚠️ Report Missed</button>
        ` : `
          <span class="status-pill ${job.status === 'Collected' ? 'active' : 'danger'}">${job.status}</span>
        `}
      </div>
    </div>
  `).join('');
}

function renderCrewRoster() {
  const container = document.getElementById('crewCardsGrid');
  if (!container) return;

  if (store.data.crews.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <span class="empty-state-icon">🚛</span>
        <div class="empty-state-title">No Collection Crews Registered</div>
        <p class="empty-state-desc">Add crew leaders, drivers, recycling center managers, vehicles, and zones to build your municipal collection roster.</p>
        <button class="btn btn-primary" onclick="openModal('registerCrewModal')">+ Register New Crew</button>
      </div>
    `;
    return;
  }

  container.innerHTML = store.data.crews.map(c => `
    <div class="crew-card">
      <div class="crew-card-header">
        <span class="crew-title">${c.name}</span>
        <span class="status-pill active">${c.status}</span>
      </div>

      <div class="crew-personnel-block">
        <div class="crew-role-row">
          <span class="role-icon">🎖️</span>
          <span class="role-title">Crew Leader:</span>
          <span class="role-name"><strong>${c.leader || c.driver || 'Unassigned Leader'}</strong></span>
        </div>
        <div class="crew-role-row">
          <span class="role-icon">🚛</span>
          <span class="role-title">Lead Driver:</span>
          <span class="role-name"><strong>${c.driver || 'Unassigned Driver'}</strong></span>
        </div>
        <div class="crew-role-row">
          <span class="role-icon">♻️</span>
          <span class="role-title">Center Manager:</span>
          <span class="role-name"><strong>${c.centerManager || 'Unassigned MRF Liaison'}</strong></span>
        </div>
        <div class="crew-role-row text-muted" style="font-size:0.75rem; margin-top:2px;">
          <span class="role-icon">👥</span>
          <span>Staff Size: ${c.members} • Vehicle: ${c.truckId}</span>
        </div>
      </div>

      <div class="crew-stats-row">
        <div>Zone: <strong>${c.zone}</strong></div>
        <div>On-Time Rate: <strong class="text-emerald">${c.onTimeRate}</strong></div>
        <div>Completed Stops: <strong>${c.stopsCompleted}</strong></div>
        <div>Load Capacity: <strong>${c.truckCapacityKg} kg</strong></div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
        <button class="btn-update-crew" onclick="openUpdateCrewModal('${c.id}')">
          ✏️ Update Crew
        </button>
        ${(function() {
          const roleKey = normalizeRole(store.data.currentUser?.role || store.data.activeRole);
          if (roleKey === 'admin' || roleKey === 'manager') {
            return `
              <button class="btn-outline-danger" onclick="deleteCrew('${c.id}')">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                <span>Delete Crew</span>
              </button>
            `;
          }
          return '';
        })()}
      </div>
    </div>
  `).join('');
}

function renderDispatchBoard() {
  const tbody = document.getElementById('dispatchQueueTableBody');
  const badge = document.getElementById('unassignedCountBadge');
  if (!tbody) return;

  const unassigned = store.data.requests.filter(r => !r.assignedCrew || r.assignedCrew === 'Unassigned' || r.status === 'Submitted');
  if (badge) badge.textContent = `${unassigned.length} Pending Dispatch`;

  if (unassigned.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">No unassigned requests pending dispatch. All citizen requests have been manually assigned.</td></tr>`;
    return;
  }

  tbody.innerHTML = unassigned.map(req => {
    // Sort available crews with zone match prioritized
    const sortedCrews = [...(store.data.crews || [])].sort((a, b) => (a.zone === req.zone ? -1 : 1));
    return `
    <tr>
      <td><strong>${req.id}</strong></td>
      <td>${req.residentName}<br><small class="text-muted">${req.address}</small></td>
      <td>${req.category}</td>
      <td>${req.estimatedKg} kg</td>
      <td><span class="tag-badge info">${req.zone}</span></td>
      <td>${req.date} (${req.timeSlot})</td>
      <td>
        <select id="dispatchSelect_${req.id}" class="form-input" style="padding:4px 8px; font-size:0.8rem;">
          <option value="">-- Select Available Crew --</option>
          ${sortedCrews.length > 0 ? sortedCrews.map(c => `
            <option value="${c.name}">${c.name} (${c.zone}${c.zone === req.zone ? ' • Match' : ''})</option>
          `).join('') : '<option value="" disabled>No crews registered</option>'}
        </select>
      </td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="assignRequestToCrew('${req.id}')" ${store.data.crews.length === 0 ? 'disabled' : ''}>Manual Dispatch</button>
      </td>
    </tr>
  `;
  }).join('');
}

function assignRequestToCrew(reqId) {
  const select = document.getElementById(`dispatchSelect_${reqId}`);
  if (!select) return;
  const crewName = select.value;
  if (!crewName || crewName === 'Unassigned') {
    showToast('Please select an available crew before dispatching!', 'warning');
    return;
  }
  const req = store.data.requests.find(r => r.id === reqId);
  if (req) {
    const oldCrew = req.assignedCrew;
    req.assignedCrew = crewName;
    req.status = 'Assigned';

    // Update crew stops counters
    const newCrewObj = store.data.crews.find(c => c.name === crewName);
    if (newCrewObj) {
      newCrewObj.stopsAssigned = (newCrewObj.stopsAssigned || 0) + 1;
    }
    if (oldCrew && oldCrew !== 'Unassigned' && oldCrew !== crewName) {
      const oldCrewObj = store.data.crews.find(c => c.name === oldCrew);
      if (oldCrewObj && oldCrewObj.stopsAssigned > 0) oldCrewObj.stopsAssigned -= 1;
    }

    store.data.activityFeed.unshift({
      text: `Request ${req.id} manually dispatched to ${crewName} (${req.zone}).`,
      time: 'Just now',
      dot: 'blue'
    });

    store.saveState();
    if (window.supabaseSync) {
      window.supabaseSync.updateRequest(req);
      if (newCrewObj) window.supabaseSync.updateCrew(newCrewObj);
      if (store.data.activityFeed.length > 0) window.supabaseSync.pushActivity(store.data.activityFeed[0]);
    }
    renderAllViews();
    showToast(`Request ${reqId} successfully assigned to ${crewName}!`, 'success');
  }
}

function renderMasterSchedules() {
  const tbody = document.getElementById('masterSchedulesTableBody');
  if (!tbody) return;

  if (store.data.schedules.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">No recurring route schedules published yet. Click "+ Create Route Schedule" to set up weekly collection routes.</td></tr>`;
    return;
  }

  tbody.innerHTML = store.data.schedules.map(s => `
    <tr>
      <td><strong>${s.id}</strong></td>
      <td><span class="tag-badge emerald">${s.zone}</span></td>
      <td>${s.stream}</td>
      <td><strong>${s.day}</strong></td>
      <td>${s.timeSlot}</td>
      <td>${s.crewName}</td>
      <td>
        <button class="link-btn" onclick="alert('Route manifest for ${s.id} exported to GPS telematics.')">Export Route</button>
      </td>
    </tr>
  `).join('');
}

function quickMarkMissed(reqId) {
  const reason = prompt('Specify reason for missed collection (e.g. Gate locked, Hazardous contamination, Waste not curbside):', 'Gate locked / No access');
  if (reason) {
    const req = store.data.requests.find(r => r.id === reqId);
    if (req) {
      req.status = 'Missed';
      req.missedReason = reason;
      store.data.activityFeed.unshift({
        text: `Stop ${reqId} flagged MISSED: ${reason}.`,
        time: 'Just now',
        dot: 'red'
      });
      store.saveState();
      if (window.supabaseSync) {
        window.supabaseSync.updateRequest(req);
      }
      renderAllViews();
      showToast(`Stop ${reqId} marked missed and added to triage.`, 'warning');
    }
  }
}

function rescheduleMissed(reqId) {
  const newDate = prompt('Enter rescheduled pickup date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
  if (newDate) {
    const req = store.data.requests.find(r => r.id === reqId);
    if (req) {
      req.status = 'Assigned';
      req.date = newDate;
      delete req.missedReason;
      store.saveState();
      if (window.supabaseSync) {
        window.supabaseSync.updateRequest(req);
      }
      renderAllViews();
      showToast(`Stop ${reqId} rescheduled for ${newDate}!`, 'success');
    }
  }
}

// -----------------------------------------------------------------------------
// Render Function 3 (Segregation & Recycling)
// -----------------------------------------------------------------------------
function renderFunction3() {
  filterSegregationGuide();
  renderWasteCategoriesTable();
  renderRecyclableBatches();
  renderFacilities();
  renderRecyclingHistory();
}

function renderWasteCategoriesTable() {
  const tbody = document.getElementById('wasteCategoriesTableBody');
  if (!tbody) return;

  tbody.innerHTML = store.data.wasteCategories.map(c => `
    <tr>
      <td><strong>${c.category}</strong></td>
      <td>${c.binColor}</td>
      <td>${c.accepted}</td>
      <td><span style="color:var(--danger);">${c.prohibited}</span></td>
      <td>${c.prepRule}</td>
      <td><strong class="text-emerald">${c.rating}</strong></td>
    </tr>
  `).join('');
}

function renderRecyclableBatches() {
  const container = document.getElementById('recyclableBatchesContainer');
  if (!container) return;

  if (store.data.recyclableBatches.length === 0) {
    const roleKey = normalizeRole(store.data.currentUser?.role || store.data.activeRole);
    const actionBtn = (roleKey === 'admin' || roleKey === 'manager')
      ? `<button class="btn btn-primary" onclick="openModal('recordBatchModal')">+ Record Recyclable Batch</button>`
      : '';
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <span class="empty-state-icon">📦</span>
        <div class="empty-state-title">No Batches in Municipal Yard</div>
        <p class="empty-state-desc">Incoming batches generated from verified crew collections or logged manually will be stored here ready for allocation.</p>
        ${actionBtn}
      </div>
    `;
    return;
  }

  container.innerHTML = store.data.recyclableBatches.map(b => `
    <div class="batch-card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:1.05rem;">${b.id}</span>
        <span class="status-pill ${b.status === 'Processed' ? 'active' : b.status === 'Allocated' ? 'pending' : 'active'}">${b.status}</span>
      </div>
      <div>
        <strong>Material:</strong> ${b.stream}<br>
        <strong>Gross Weight:</strong> ${b.weightKg.toLocaleString()} kg | <strong>Source:</strong> Zone ${b.sourceZone}
      </div>
      <div style="font-size:0.8rem; color:var(--text-muted); background:var(--bg-surface-subtle); padding:8px; border-radius:var(--radius-sm);">
        Facility: <strong>${b.facilityName}</strong><br>
        Carrier: ${b.carrierVehicle || 'Pending Transfer'}<br>
        CO₂ Offset: <strong class="text-emerald">~${b.co2SavedKg} kg CO₂e avoided</strong>
      </div>
      <div style="display:flex; gap:8px; margin-top:auto;">
        ${(function() {
          const roleKey = normalizeRole(store.data.currentUser?.role || store.data.activeRole);
          if (roleKey === 'user') {
            return b.status === 'Processed'
              ? `<span style="font-size:0.75rem; color:var(--primary); font-weight:700;">✅ Certified Yield: ${b.yieldKg} kg (${b.recoveryRate})</span>`
              : `<span style="font-size:0.75rem; color:var(--text-muted);">Status: ${b.status}</span>`;
          }
          return b.status === 'In Yard'
            ? `<button class="btn btn-sm btn-primary" onclick="openAllocateBatchModal('${b.id}')">Allocate to MRF</button>`
            : b.status === 'Allocated'
            ? `<button class="btn btn-sm btn-secondary" onclick="openRecordYieldModal('${b.id}')">Log Yield / Recovery</button>`
            : `<span style="font-size:0.75rem; color:var(--primary); font-weight:700;">✅ Certified Yield: ${b.yieldKg} kg (${b.recoveryRate})</span>`;
        })()}
      </div>
    </div>
  `).join('');
}

function renderFacilities() {
  const container = document.getElementById('recyclingFacilitiesGrid');
  if (!container) return;

  const zoneFilter = document.getElementById('facilityZoneFilter')?.value || 'all';

  let facilities = store.data.recyclingFacilities || [];
  if (zoneFilter !== 'all') {
    facilities = facilities.filter(f => (f.zone || '').toLowerCase() === zoneFilter.toLowerCase());
  }

  if (facilities.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <span class="empty-state-icon">🏭</span>
        <div class="empty-state-title">No Segregation Center for ${zoneFilter}</div>
        <p class="empty-state-desc">You can register a new segregation and recycling facility for this zone.</p>
        <button class="btn btn-primary" onclick="openModal('registerFacilityModal')">+ Register Recycling Centre</button>
      </div>
    `;
    return;
  }

  container.innerHTML = facilities.map(f => {
    const loadPct = f.capacityTons > 0 ? Math.min(100, Math.round((f.currentLoadTons / f.capacityTons) * 100)) : 0;
    return `
      <div class="facility-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h3 style="font-family:'Space Grotesk',sans-serif; font-size:1.05rem; font-weight:700;">${f.name}</h3>
            <span style="font-size:0.75rem; color:var(--primary); font-weight:700;">${f.type}</span>
          </div>
          <span class="status-pill active">${f.status}</span>
        </div>
        <div style="display:flex; gap:6px; margin: 8px 0; flex-wrap:wrap;">
          <span class="tag-badge emerald" style="font-weight:700;">📍 Zone: ${f.zone || 'Colombo Fort'}</span>
          <span class="tag-badge info">Center ID: ${f.id}</span>
        </div>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:8px;">📍 ${f.location}<br>📞 ${formatToSriLankanPhone(f.contactPhone)}</p>
        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:4px;">
            <span>Monthly Processing Capacity</span>
            <strong>${f.currentLoadTons} / ${f.capacityTons} Tons (${loadPct}%)</strong>
          </div>
          <div class="zone-bar-bg">
            <div class="zone-bar-fill" style="width:${loadPct}%; background:${loadPct > 85 ? '#ef4444' : loadPct > 60 ? '#f59e0b' : 'var(--primary)'};"></div>
          </div>
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:8px;">
          Accepted Streams: <strong>${Array.isArray(f.acceptedMaterials) ? f.acceptedMaterials.join(', ') : f.acceptedMaterials}</strong>
        </div>
      </div>
    `;
  }).join('');
}

function renderRecyclingHistory() {
  const tbody = document.getElementById('recyclingHistoryTableBody');
  if (!tbody) return;

  const batches = store.data.recyclableBatches;
  if (batches.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">No recycling processing history yet. Material allocated to MRFs will produce verified recovery logs here.</td></tr>`;
    return;
  }

  tbody.innerHTML = batches.map(b => `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td>${b.stream}</td>
      <td>${b.facilityName}</td>
      <td>${b.weightKg.toLocaleString()} kg</td>
      <td><strong>${b.yieldKg ? b.yieldKg.toLocaleString() + ' kg' : 'In Transit'}</strong></td>
      <td><strong class="text-emerald">${b.recoveryRate || 'Pending'}</strong></td>
      <td>~${b.co2SavedKg} kg</td>
      <td><span class="status-pill ${b.status === 'Processed' ? 'active' : 'pending'}">${b.status}</span></td>
    </tr>
  `).join('');

  const exportBtn = document.getElementById('exportRecyclingReportBtn');
  if (exportBtn) {
    exportBtn.onclick = () => {
      alert('Exporting Municipal Recyclables & Carbon Offset Audit Log (CSV format)... Download complete.');
    };
  }
}

// -----------------------------------------------------------------------------
// Render Function 4 (Complaints, Missed, Admin & Reports)
// -----------------------------------------------------------------------------
function renderFunction4() {
  renderComplaints();
  renderMissedCollections();
  renderUserAdmin();
  renderAreaReports();
  renderFleetReports();
}

function renderComplaints(statusFilter = 'all') {
  const container = document.getElementById('complaintsCardsContainer');
  if (!container) return;

  let complaints = store.data.complaints;
  if (statusFilter !== 'all') {
    complaints = complaints.filter(c => c.status === statusFilter);
  }

  if (complaints.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <span class="empty-state-icon">✅</span>
        <div class="empty-state-title">No Grievances or Incidents</div>
        <p class="empty-state-desc">No complaints matching the selected filter. Click "+ Lodge Complaint" to report curbside issues.</p>
        <button class="btn btn-primary" onclick="openModal('complaintModal')">+ Lodge Complaint</button>
      </div>
    `;
    return;
  }

  container.innerHTML = complaints.map(c => `
    <div class="complaint-card ${c.priority === 'High' ? 'high-priority' : ''} ${c.status === 'Resolved' ? 'resolved' : ''}">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-family:'Space Grotesk',sans-serif; font-weight:700;">${c.id}</span>
        <span class="status-pill ${c.status === 'Resolved' ? 'active' : c.priority === 'High' ? 'danger' : 'pending'}">${c.status}</span>
      </div>
      <div>
        <strong>Incident:</strong> ${c.type}<br>
        <span style="font-size:0.78rem; color:var(--text-muted);">📍 ${c.location} (Zone ${c.zone}) • Priority: <strong style="color:${c.priority === 'High' ? 'var(--danger)' : 'inherit'};">${c.priority}</strong></span>
      </div>
      <p style="font-size:0.8rem; color:var(--text-main); background:var(--bg-surface-subtle); padding:8px; border-radius:var(--radius-sm);">
        ${c.details}
      </p>
      ${c.resolutionNotes ? `<p style="font-size:0.75rem; color:var(--primary);"><strong>Resolution:</strong> ${c.resolutionNotes}</p>` : ''}
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; font-size:0.72rem; color:var(--text-muted);">
        <span>${c.date}</span>
        ${c.status !== 'Resolved' ? `
          <button class="btn btn-sm btn-primary" onclick="resolveComplaint('${c.id}')">Resolve Issue</button>
        ` : `
          <span class="text-emerald font-bold">Closed ✓</span>
        `}
      </div>
    </div>
  `).join('');
}

function renderMissedCollections() {
  const tbody = document.getElementById('missedCollectionsTableBody');
  const badge = document.getElementById('missedCountBadge');
  if (!tbody) return;

  const missed = store.data.requests.filter(r => r.status === 'Missed');
  if (badge) badge.textContent = `${missed.length} Active Escalations`;

  if (missed.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">No missed collections currently flagged. Collection operations are on target!</td></tr>`;
    return;
  }

  tbody.innerHTML = missed.map(m => `
    <tr>
      <td><strong>${m.id}</strong></td>
      <td>${m.address}</td>
      <td><span class="tag-badge info">${m.zone}</span></td>
      <td>${m.assignedCrew || 'Unassigned'}</td>
      <td><span style="color:var(--danger); font-weight:600;">${m.missedReason || 'Access obstructed'}</span></td>
      <td>${m.date}</td>
      <td><span class="status-pill danger">Failed</span></td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="rescheduleMissed('${m.id}')">Re-dispatch Truck</button>
      </td>
    </tr>
  `).join('');
}

function renderUserAdmin(query = '') {
  const tbody = document.getElementById('userAdminTableBody');
  if (!tbody) return;

  const filtered = store.data.users.filter(u => {
    if (!query) return true;
    return u.name.toLowerCase().includes(query) ||
           u.role.toLowerCase().includes(query) ||
           u.zone.toLowerCase().includes(query) ||
           u.email.toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">No users in directory. Click "+ Register User" to add citizens or staff accounts.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(u => `
    <tr>
      <td><strong>${u.id}</strong></td>
      <td>${u.name}</td>
      <td>${u.email}<br><small class="text-muted">${formatToSriLankanPhone(u.phone)}</small></td>
      <td>
        <select class="form-input" style="padding:4px 8px; font-size:0.78rem; font-weight:600; width:auto; border-radius:var(--radius-sm);" onchange="updateUserRole('${u.id}', this.value)" title="Change role in backend database">
          <option value="User" ${normalizeRole(u.role) === 'user' ? 'selected' : ''}>👤 Citizen User</option>
          <option value="Crew Leader" ${normalizeRole(u.role) === 'crew_leader' ? 'selected' : ''}>🎖️ Crew Leader</option>
          <option value="Manager" ${normalizeRole(u.role) === 'manager' ? 'selected' : ''}>♻️ Center Manager</option>
          <option value="Admin" ${normalizeRole(u.role) === 'admin' ? 'selected' : ''}>🏛️ Municipal Admin</option>
          <option value="Crew Driver" ${u.role === 'Crew Driver' ? 'selected' : ''}>🚛 Crew Driver</option>
        </select>
      </td>
      <td>${u.zone}</td>
      <td><span class="status-pill active">${u.status}</span></td>
      <td>${u.registeredOn}</td>
      <td>
        <button class="link-btn" onclick="alert('Profile and permissions for ${u.name} are active. Role is controlled via the dropdown.')">Status</button>
      </td>
    </tr>
  `).join('');
}

function updateUserRole(userId, newRole) {
  const user = store.data.users.find(u => u.id === userId);
  if (!user) return;
  const oldRole = user.role;
  user.role = newRole;
  user.accountType = newRole === 'Admin' ? 'Municipal Admin' : newRole === 'Manager' ? 'Center Manager' : newRole === 'Crew Leader' ? 'Operations Personnel' : newRole === 'Crew Driver' ? 'Crew Driver' : 'Residential Account';

  // Synchronize with operations personnel roster
  if (!store.data.personnel) store.data.personnel = [];
  const p = store.data.personnel.find(per => per.email === user.email || per.id === user.id);
  if (p) {
    if (newRole === 'User') {
      store.data.personnel = store.data.personnel.filter(per => per !== p);
    } else {
      p.role = newRole === 'Crew Leader' ? 'Crew Leader' : newRole === 'Crew Driver' ? 'Driver' : 'Recycling Center Manager';
    }
  } else if (newRole === 'Crew Leader' || newRole === 'Manager' || newRole === 'Crew Driver') {
    store.data.personnel.push({
      id: 'PER-' + (100 + store.data.personnel.length + 1),
      name: user.name,
      role: newRole === 'Crew Leader' ? 'Crew Leader' : newRole === 'Crew Driver' ? 'Driver' : 'Recycling Center Manager',
      phone: user.phone,
      email: user.email,
      zone: user.zone,
      assignment: newRole === 'Crew Leader' ? `Field Unit (${user.zone})` : newRole === 'Crew Driver' ? `Heavy Truck (${user.zone})` : `Recycling Center MRF (${user.zone})`,
      status: 'Active / On Duty'
    });
  }

  // If modifying currently active logged-in user, refresh permissions
  if (store.data.currentUser && (store.data.currentUser.id === user.id || store.data.currentUser.email === user.email)) {
    store.data.currentUser.role = newRole;
    store.data.userProfile.role = newRole;
    applyRolePermissions(store.data.currentUser);
  }

  store.saveState();

  // Push role update to live Supabase cloud database
  if (window.supabaseSync) {
    window.supabaseSync.updateUser(user);
    store.data.activityFeed.unshift({
      text: `Role for ${user.name} updated to ${newRole} in database.`,
      time: 'Just now',
      dot: 'emerald'
    });
    window.supabaseSync.pushActivity(store.data.activityFeed[0]);
  }

  renderAllViews();
  showToast(`Role for ${user.name} successfully updated to "${newRole}" and synced to database!`, 'success');
}
window.updateUserRole = updateUserRole;

function renderAreaReports() {
  const tbody = document.getElementById('areaComparisonTableBody');
  if (!tbody) return;

  const zones = ['Colombo Fort', 'Kollupitiya', 'Borella', 'Wellawatte', 'Dehiwala', 'Kotte', 'Nugegoda'];
  tbody.innerHTML = zones.map(z => {
    const zReqs = store.data.requests.filter(r => r.zone === z);
    const totalWeight = zReqs.reduce((sum, r) => sum + (r.actualKg || r.estimatedKg || 0), 0);
    const missedCount = zReqs.filter(r => r.status === 'Missed').length;
    const missedPct = zReqs.length > 0 ? ((missedCount / zReqs.length) * 100).toFixed(1) : '0.0';
    return `
      <tr>
        <td><strong>${z}</strong></td>
        <td>${(totalWeight / 1000).toFixed(2)}t</td>
        <td><strong class="text-emerald">${totalWeight > 0 ? '68.5%' : '0%'}</strong></td>
        <td>${missedPct}%</td>
        <td>Grade A</td>
      </tr>
    `;
  }).join('');
}

function renderFleetReports() {
  const tbody = document.getElementById('fleetPerformanceTableBody');
  if (!tbody) return;

  if (store.data.crews.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">No fleet crew records available. Register crews to view telemetry ratings.</td></tr>`;
    return;
  }

  tbody.innerHTML = store.data.crews.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.truckId}</td>
      <td>${c.stopsCompleted} stops</td>
      <td>7.4 mins</td>
      <td><strong class="text-emerald">${c.onTimeRate}</strong></td>
      <td>★★★★★ (4.9)</td>
    </tr>
  `).join('');
}

// =============================================================================
// 5. Canvas Data Visualizations (Responsive Vanilla Canvas Charts)
// =============================================================================
function renderCharts() {
  renderWasteDistributionChart();
  renderAreaBarChart();
}

function renderWasteDistributionChart() {
  const canvas = document.getElementById('wasteDistributionCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const isDark = document.body.classList.contains('theme-dark');

  // Compute live data from user requests and batches
  const streamMap = {
    'Organic Waste': { val: 0, color: '#10b981' },
    'Plastic Recyclable': { val: 0, color: '#f59e0b' },
    'Paper & Cardboard': { val: 0, color: '#0284c7' },
    'Glass & Metal': { val: 0, color: '#06b6d4' },
    'E-Waste': { val: 0, color: '#7c3aed' }
  };

  store.data.requests.forEach(r => {
    const w = r.actualKg || r.estimatedKg || 0;
    if (streamMap[r.category]) streamMap[r.category].val += w;
  });

  store.data.recyclableBatches.forEach(b => {
    if (streamMap[b.stream]) streamMap[b.stream].val += b.weightKg;
  });

  const slices = Object.entries(streamMap).map(([label, item]) => ({
    label,
    val: item.val,
    color: item.color
  }));

  const totalKg = slices.reduce((sum, s) => sum + s.val, 0);

  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(centerX, centerY) - 20;
  const innerRadius = outerRadius * 0.6;

  if (totalKg === 0) {
    // Clean empty circle display
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.arc(centerX, centerY, innerRadius, Math.PI * 2, 0, true);
    ctx.fillStyle = isDark ? '#162032' : '#edf2f7';
    ctx.fill();

    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = "bold 15px 'Space Grotesk', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No Data Logged', centerX, centerY - 8);

    ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText('Awaiting waste streams', centerX, centerY + 12);

    const legendGrid = document.getElementById('wasteChartLegend');
    if (legendGrid) {
      legendGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); font-size:0.8rem;">Add pickup requests or recyclable batches to view stream breakdown.</div>`;
    }
    return;
  }

  let startAngle = -Math.PI / 2;

  slices.filter(s => s.val > 0).forEach(slice => {
    const sliceAngle = (slice.val / totalKg) * (Math.PI * 2);
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = isDark ? '#111927' : '#ffffff';
    ctx.stroke();

    startAngle += sliceAngle;
  });

  ctx.fillStyle = isDark ? '#f1f5f9' : '#0f172a';
  ctx.font = "bold 20px 'Space Grotesk', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${(totalKg / 1000).toFixed(1)}t`, centerX, centerY - 6);

  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText('Total Weighed', centerX, centerY + 14);

  const legendGrid = document.getElementById('wasteChartLegend');
  if (legendGrid) {
    legendGrid.innerHTML = slices.filter(s => s.val > 0).map(d => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${d.color};"></span>
        <span>${d.label}</span>
        <span class="legend-val">${(d.val / 1000).toFixed(1)}t (${Math.round((d.val / totalKg) * 100)}%)</span>
      </div>
    `).join('');
  }
}

function renderAreaBarChart() {
  const canvas = document.getElementById('areaBarChartCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const isDark = document.body.classList.contains('theme-dark');

  const zonesData = ['Colombo Fort', 'Kollupitiya', 'Borella', 'Wellawatte', 'Dehiwala', 'Kotte', 'Nugegoda'].map(name => {
    const reqs = store.data.requests.filter(r => r.zone === name);
    const gen = reqs.reduce((sum, r) => sum + (r.actualKg || r.estimatedKg || 0), 0) / 1000;
    const rec = reqs.filter(r => r.status === 'Collected').reduce((sum, r) => sum + (r.actualKg || 0), 0) / 1000;
    return { name, gen, rec };
  });

  const padding = { top: 30, right: 30, bottom: 40, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = Math.max(10, Math.ceil(Math.max(...zonesData.map(d => d.gen)) * 1.2));

  // Grid
  ctx.strokeStyle = isDark ? '#22324d' : '#e2e8f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartH / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartW, y);
    ctx.stroke();

    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = "10px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = 'right';
    ctx.fillText(`${(maxVal - (i / 5) * maxVal).toFixed(1)}t`, padding.left - 10, y + 4);
  }

  // Draw Bars
  const barGroupWidth = chartW / zonesData.length;
  const singleBarW = 28;

  zonesData.forEach((d, idx) => {
    const groupX = padding.left + idx * barGroupWidth + (barGroupWidth - (singleBarW * 2 + 8)) / 2;

    const genH = maxVal > 0 ? (d.gen / maxVal) * chartH : 0;
    const genY = padding.top + chartH - genH;
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(groupX, genY, singleBarW, genH);

    const recH = maxVal > 0 ? (d.rec / maxVal) * chartH : 0;
    const recY = padding.top + chartH - recH;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(groupX + singleBarW + 8, recY, singleBarW, recH);

    ctx.fillStyle = isDark ? '#f1f5f9' : '#0f172a';
    ctx.font = "bold 11px 'Space Grotesk', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(d.name, groupX + singleBarW + 4, padding.top + chartH + 20);
  });

  // Legend
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(width - 240, 10, 12, 12);
  ctx.fillStyle = isDark ? '#f1f5f9' : '#0f172a';
  ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = 'left';
  ctx.fillText('Generated Waste (t)', width - 222, 20);

  ctx.fillStyle = '#10b981';
  ctx.fillRect(width - 110, 10, 12, 12);
  ctx.fillStyle = isDark ? '#f1f5f9' : '#0f172a';
  ctx.fillText('Recycled (t)', width - 92, 20);
}

// =============================================================================
// 6. Toast Notification Helper
// =============================================================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'danger' ? '⛔' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      if (toast.parentNode) {
        container.removeChild(toast);
      }
    }, 400);
  }, 4000);
}
