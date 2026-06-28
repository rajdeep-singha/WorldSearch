export interface GeoEvent {
  id: string
  title: string
  lat: number
  lng: number
  category: 'conflict_zone' | 'iran_attack' | 'intel_hotspot' | 'military_base' |
             'nuclear_site' | 'radiation' | 'spaceport' | 'undersea_cable' |
             'pipeline' | 'fuel_shortage' | 'tech' | 'geopolitics'
  severity: number
  source: string
  time: string
  description: string
}

export const SEED_EVENTS: GeoEvent[] = [
  { id: '1', title: 'US-Iran Exchange: Ceasefire Under Strain', lat: 26.5, lng: 56.2, category: 'iran_attack', severity: 88, source: 'Reuters', time: '2h ago', description: 'Multiple strikes exchanged near Strait of Hormuz' },
  { id: '2', title: 'IDF Operations: Northern Border Active', lat: 33.2, lng: 35.5, category: 'conflict_zone', severity: 74, source: 'AP', time: '3h ago', description: 'Artillery exchanges along the northern frontier' },
  { id: '3', title: 'Houthi Drone Alert: Red Sea Shipping', lat: 15.5, lng: 42.8, category: 'iran_attack', severity: 71, source: 'AFP', time: '1h ago', description: 'Commercial shipping on high alert' },
  { id: '4', title: 'Russia Missile Strike: Kyiv Infrastructure', lat: 50.4, lng: 30.5, category: 'conflict_zone', severity: 82, source: 'BBC', time: '4h ago', description: 'Critical infrastructure targeted overnight' },
  { id: '5', title: 'NATO Rapid Response: Eastern Flank', lat: 54.0, lng: 23.0, category: 'military_base', severity: 65, source: 'Defense News', time: '6h ago', description: 'Alliance forces positioned near Belarus border' },
  { id: '6', title: 'Black Sea Fleet Movement Detected', lat: 44.0, lng: 33.0, category: 'intel_hotspot', severity: 60, source: 'OSINT', time: '5h ago', description: 'Unusual vessel positioning via satellite' },
  { id: '7', title: 'PLA Navy Exercise: South China Sea', lat: 15.0, lng: 113.0, category: 'conflict_zone', severity: 70, source: 'Reuters', time: '2h ago', description: 'Large-scale naval exercises near disputed waters' },
  { id: '8', title: 'North Korea ICBM Test Preparation', lat: 39.0, lng: 125.7, category: 'nuclear_site', severity: 85, source: 'NTI', time: '1h ago', description: 'Activity at known launch site detected' },
  { id: '9', title: 'Taiwan Strait: PLA Air Incursions', lat: 24.0, lng: 120.0, category: 'intel_hotspot', severity: 76, source: 'CSIS', time: '3h ago', description: 'Multiple sorties crossing median line' },
  { id: '10', title: 'India-Pakistan LoC: Artillery Exchange', lat: 34.5, lng: 73.5, category: 'conflict_zone', severity: 68, source: 'ANI', time: '7h ago', description: 'Exchanges in Kashmir border region' },
  { id: '11', title: 'Sudan Civil War: Khartoum Fighting', lat: 15.5, lng: 32.5, category: 'conflict_zone', severity: 79, source: 'Al Jazeera', time: '5h ago', description: 'RSF and SAF in urban combat' },
  { id: '12', title: 'Sahel: Wagner Forces Advance in Mali', lat: 17.0, lng: -4.0, category: 'military_base', severity: 58, source: 'Le Monde', time: '8h ago', description: 'Russian-linked mercenaries near Timbuktu' },
  { id: '13', title: 'Ethiopia: Tigray Ceasefire Fragile', lat: 14.0, lng: 38.5, category: 'conflict_zone', severity: 55, source: 'Reuters', time: '12h ago', description: 'Isolated skirmishes despite peace deal' },
  { id: '14', title: 'Venezuela-Guyana: Border Tension', lat: 6.0, lng: -63.0, category: 'intel_hotspot', severity: 62, source: 'AP', time: '10h ago', description: 'Military presence near Essequibo increases' },
  { id: '15', title: 'Mexico: Cartel vs Military Clash', lat: 25.0, lng: -107.0, category: 'conflict_zone', severity: 50, source: 'Reuters', time: '6h ago', description: 'Army deployed after cartel ambush' },
  { id: '16', title: 'Zaporizhzhia NPP: Power Grid Crisis', lat: 47.5, lng: 34.6, category: 'nuclear_site', severity: 80, source: 'IAEA', time: '2h ago', description: 'Third grid connection lost, IAEA monitoring' },
  { id: '17', title: 'Iran Fordow: Enrichment Activity', lat: 34.9, lng: 49.9, category: 'nuclear_site', severity: 83, source: 'IAEA', time: '4h ago', description: '60% enrichment at underground facility' },
  { id: '18', title: 'Baltic Sea Cable Disruption', lat: 57.0, lng: 19.0, category: 'undersea_cable', severity: 65, source: 'Telegeography', time: '3h ago', description: 'Fiber optic cut, cause under investigation' },
  { id: '19', title: 'Nord Stream: Forensic Evidence Update', lat: 55.0, lng: 15.0, category: 'pipeline', severity: 55, source: 'Reuters', time: '24h ago', description: 'New evidence presented to investigators' },
  { id: '20', title: 'Hormuz: Oil Tanker Seized by IRGC', lat: 26.0, lng: 56.5, category: 'fuel_shortage', severity: 72, source: 'Splash247', time: '1h ago', description: '24 crew held, shipping markets react' },
  { id: '21', title: 'China Releases Military AI Model', lat: 39.9, lng: 116.4, category: 'tech', severity: 60, source: 'The Verge', time: '5h ago', description: 'PLA-affiliated group releases unrestricted LLM' },
  { id: '22', title: 'Cyberattack: European Energy Grid', lat: 52.5, lng: 13.4, category: 'intel_hotspot', severity: 67, source: 'CISA', time: '3h ago', description: 'State-sponsored attack hits German power infrastructure' },
  { id: '23', title: 'SpaceX Starlink: Ukraine Expansion', lat: 48.3, lng: 31.2, category: 'spaceport', severity: 40, source: 'Space News', time: '8h ago', description: 'Additional satellites for frontline coverage' },
  { id: '24', title: 'Pakistan Political Crisis: Army Deployed', lat: 33.6, lng: 73.0, category: 'intel_hotspot', severity: 58, source: 'Dawn', time: '6h ago', description: 'Military deployed amid Islamabad protests' },
  { id: '25', title: 'Syria: US Base Attacked at Al-Tanf', lat: 37.0, lng: 41.0, category: 'conflict_zone', severity: 69, source: 'Pentagon', time: '4h ago', description: 'Rocket attack, no casualties reported' },
  { id: '26', title: 'Turkey: Drone Strikes on PKK', lat: 37.5, lng: 43.5, category: 'conflict_zone', severity: 54, source: 'Reuters', time: '7h ago', description: 'TB2 operations across northern Syria' },
  { id: '27', title: 'Somalia: Al-Shabaab Offensive', lat: 2.0, lng: 45.3, category: 'conflict_zone', severity: 61, source: 'UN OCHA', time: '9h ago', description: 'Militant advance repelled by ATMIS' },
  { id: '28', title: 'Arctic: Russia Expands Murmansk Base', lat: 68.9, lng: 33.0, category: 'military_base', severity: 52, source: "Jane's", time: '24h ago', description: 'New submarine berths under construction' },
  { id: '29', title: 'Japan: Hypersonic Intercept Test', lat: 35.7, lng: 139.7, category: 'military_base', severity: 45, source: 'NHK', time: '10h ago', description: 'JSDF conducts successful intercept test' },
  { id: '30', title: 'Gaza Ceasefire Negotiations Stall', lat: 31.5, lng: 34.5, category: 'conflict_zone', severity: 77, source: 'Haaretz', time: '2h ago', description: 'Qatar-mediated talks suspended' },
  { id: '31', title: 'Chernobyl: Radiation Spike Detected', lat: 51.3, lng: 30.1, category: 'radiation', severity: 48, source: 'SNRIU', time: '12h ago', description: 'Elevated but safe readings at monitoring stations' },
  { id: '32', title: 'Fukushima Water Release Continues', lat: 37.4, lng: 141.0, category: 'radiation', severity: 38, source: 'TEPCO', time: '24h ago', description: 'ALPS-treated water within safe limits' },
  { id: '33', title: 'SpaceX Starship: Orbital Test Success', lat: 28.5, lng: -80.6, category: 'spaceport', severity: 20, source: 'Space.com', time: '3h ago', description: 'Successful orbital test flight completed' },
  { id: '34', title: 'Baikonur: Russia Soyuz Launch', lat: 45.6, lng: 63.3, category: 'spaceport', severity: 15, source: 'Roscosmos', time: '8h ago', description: 'ISS resupply mission on track' },
  { id: '35', title: 'Myanmar: Junta Airstrikes on Rebels', lat: 20.0, lng: 96.0, category: 'conflict_zone', severity: 63, source: 'Radio Free Asia', time: '5h ago', description: 'SAC jets bomb resistance strongholds' },
  { id: '36', title: 'Philippines-China: Spratlys Standoff', lat: 10.0, lng: 114.0, category: 'intel_hotspot', severity: 66, source: 'AFP', time: '4h ago', description: 'Water cannons used against Philippine resupply' },
  { id: '37', title: 'Iraq: ISIS Resurgence in Anbar', lat: 33.4, lng: 41.0, category: 'conflict_zone', severity: 57, source: 'Al Monitor', time: '8h ago', description: 'Ambush kills 6 Iraqi security personnel' },
  { id: '38', title: 'Cameroon: Anglophone Separatist Attack', lat: 5.9, lng: 10.2, category: 'conflict_zone', severity: 46, source: 'Jeune Afrique', time: '15h ago', description: 'Ambazonian forces attack government convoy' },
  { id: '39', title: 'Colombia: FARC Attacks Oil Infrastructure', lat: 4.5, lng: -76.0, category: 'conflict_zone', severity: 49, source: 'El Tiempo', time: '11h ago', description: 'Guerrilla attacks on oil infrastructure in Chocó' },
  { id: '40', title: 'Azerbaijan: Military Exercises Near Iran', lat: 39.5, lng: 47.5, category: 'military_base', severity: 53, source: 'Turan', time: '7h ago', description: 'Baku deploys armored units south' },
  { id: '41', title: 'Hormuz: Tanker Traffic Disruption', lat: 26.5, lng: 56.4, category: 'fuel_shortage', severity: 73, source: "Lloyd's List", time: '2h ago', description: '40% reduction in tanker crossings' },
  { id: '42', title: 'Trans-Caspian Pipeline: Pressure Drop', lat: 41.0, lng: 50.0, category: 'pipeline', severity: 55, source: 'S&P Platts', time: '6h ago', description: 'Technical fault reduces exports' },
  { id: '43', title: 'East African Cable Cut: 5 Nations Hit', lat: -4.0, lng: 40.0, category: 'undersea_cable', severity: 58, source: 'RIPE NCC', time: '3h ago', description: 'TEAMS cable break affects Kenya, Tanzania' },
  { id: '44', title: 'US AI Chip Export Controls: China Reacts', lat: 37.7, lng: -122.4, category: 'tech', severity: 55, source: 'Bloomberg', time: '5h ago', description: 'Beijing announces countermeasures' },
  { id: '45', title: 'ISS Collision Warning: Debris Avoidance', lat: 51.6, lng: 0.0, category: 'spaceport', severity: 42, source: 'NASA', time: '4h ago', description: 'Station performs debris avoidance burn' },
  { id: '46', title: 'CIA Warning: Terror Plot Western Europe', lat: 48.8, lng: 2.3, category: 'intel_hotspot', severity: 75, source: 'ODNI', time: '1h ago', description: 'Multiple agencies on heightened alert' },
  { id: '47', title: 'Bosphorus: Russian Naval Monitoring', lat: 41.0, lng: 29.0, category: 'intel_hotspot', severity: 50, source: 'Bosphorus Observer', time: '6h ago', description: 'Unusual traffic pattern observed' },
  { id: '48', title: 'China Volt Typhoon Cyber Campaign', lat: 31.2, lng: 121.5, category: 'intel_hotspot', severity: 70, source: 'CISA', time: '8h ago', description: 'Targets US critical infrastructure' },
  { id: '49', title: 'Ecuador: Gang Violence Emergency', lat: -0.2, lng: -78.5, category: 'conflict_zone', severity: 64, source: 'Reuters', time: '10h ago', description: 'State of emergency in 6 provinces' },
  { id: '50', title: 'UN Emergency: Global Food Crisis', lat: 40.7, lng: -74.0, category: 'geopolitics', severity: 68, source: 'UN WFP', time: '5h ago', description: '345M people facing acute food insecurity' },
]

export const LAYER_CONFIG = [
  { id: 'iran_attack', label: 'IRAN ATTACKS', color: '#ff4444' },
  { id: 'intel_hotspot', label: 'INTEL HOTSPOTS', color: '#ff8800' },
  { id: 'conflict_zone', label: 'CONFLICT ZONES', color: '#ff4444' },
  { id: 'military_base', label: 'MILITARY BASES', color: '#4488ff' },
  { id: 'nuclear_site', label: 'NUCLEAR SITES', color: '#ffff00' },
  { id: 'radiation', label: 'RADIATION WATCH', color: '#88ff00' },
  { id: 'spaceport', label: 'SPACEPORTS', color: '#00aaff' },
  { id: 'undersea_cable', label: 'UNDERSEA CABLES', color: '#00ddff' },
  { id: 'pipeline', label: 'PIPELINES', color: '#ffaa00' },
  { id: 'fuel_shortage', label: 'FUEL SHORTAGES', color: '#ff6600' },
  { id: 'tech', label: 'TECHNOLOGY', color: '#44ffaa' },
  { id: 'geopolitics', label: 'GEOPOLITICS', color: '#cc88ff' },
]
