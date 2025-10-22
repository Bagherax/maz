import { Ad, User, Report, Review, Comment } from '../types';

export const MOCK_SELLERS: Omit<User, 'password'>[] = [
  {
    id: 'seller-1', name: 'TechieTom', email: 'tom@example.com', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=TechieTom',
    tier: 'gold', createdAt: '2022-01-15T10:00:00Z', bio: 'Your go-to for the latest gadgets and electronics.',
    isVerified: true, rating: 4.9, reviewCount: 152, status: 'active', ipAddress: '73.125.68.21',
    cloudSync: { isEnabled: true, provider: 'google-drive', syncOnWifiOnly: true, mediaCompression: 'medium', lastSync: '2024-05-22T11:00:00Z' }
  },
  {
    id: 'seller-2', name: 'FashionistaFiona', email: 'fiona@example.com', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Fiona',
    tier: 'platinum', createdAt: '2021-03-20T14:30:00Z', bio: 'Curated vintage and modern fashion pieces.',
    isVerified: true, rating: 4.8, reviewCount: 340, status: 'active', ipAddress: '108.45.91.170',
    cloudSync: { isEnabled: true, provider: 'dropbox', syncOnWifiOnly: false, mediaCompression: 'high' }
  },
  {
    id: 'seller-3', name: 'HomebodyHenry', email: 'henry@example.com', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Henry',
    tier: 'silver', createdAt: '2023-05-10T09:00:00Z', bio: 'Making your house a home, one piece of furniture at a time.',
    isVerified: true, rating: 4.7, reviewCount: 88, status: 'active', ipAddress: '24.12.119.5',
    cloudSync: { isEnabled: false, provider: 'none', syncOnWifiOnly: true, mediaCompression: 'medium' }
  },
  {
    id: 'seller-4', name: 'GearheadGary', email: 'gary@example.com', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Gary',
    tier: 'diamond', createdAt: '2020-11-01T18:00:00Z', bio: 'Collector of classic cars and rare motorcycles.',
    isVerified: true, rating: 5.0, reviewCount: 75, status: 'active', ipAddress: '98.207.23.14',
    cloudSync: { isEnabled: true, provider: 'google-drive', syncOnWifiOnly: true, mediaCompression: 'none' }
  },
  {
    id: 'seller-5', name: 'RealtorRita', email: 'rita@example.com', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Rita',
    tier: 'su_diamond', createdAt: '2019-08-12T11:00:00Z', bio: 'Finding your dream home or commercial space.',
    isVerified: true, rating: 4.9, reviewCount: 210, status: 'active', ipAddress: '172.58.99.82',
    cloudSync: { isEnabled: false, provider: 'none', syncOnWifiOnly: true, mediaCompression: 'medium' }
  },
  {
    id: 'seller-6', name: 'ServiceSam', email: 'sam@example.com', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Sam',
    tier: 'bronze', createdAt: '2023-09-01T12:00:00Z', bio: 'Freelance web developer and IT support specialist.',
    isVerified: false, rating: 4.6, reviewCount: 32, status: 'active', ipAddress: '68.5.122.34',
    cloudSync: { isEnabled: false, provider: 'none', syncOnWifiOnly: true, mediaCompression: 'medium' }
  },
  {
    id: 'seller-7', name: 'NewbieNick', email: 'nick@example.com', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Nick',
    tier: 'normal', createdAt: '2024-02-15T16:00:00Z', bio: 'Just getting started, selling some old stuff!',
    isVerified: false, rating: 4.5, reviewCount: 4, status: 'active', ipAddress: '208.73.180.10',
    cloudSync: { isEnabled: false, provider: 'none', syncOnWifiOnly: true, mediaCompression: 'medium' }
  },
  {
    id: 'seller-8', name: 'AdminAnna', email: 'admin@example.com', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Anna',
    tier: 'MAZ', createdAt: '2018-01-01T00:00:00Z', bio: 'MAZDADY Marketplace Administrator.',
    isVerified: true, rating: 5.0, reviewCount: 999, status: 'active', isAdmin: true, ipAddress: '127.0.0.1',
    cloudSync: { isEnabled: false, provider: 'none', syncOnWifiOnly: true, mediaCompression: 'medium' }
  }
];

// Helper function to create an Ad object with less boilerplate
const createAd = (id: number, sellerIndex: number, data: any, reports: Report[] = []): Ad => {
    return {
        id: `ad-${id.toString().padStart(2, '0')}`,
        seller: MOCK_SELLERS[sellerIndex] as User,
        reports,
        ...data,
        rating: 0,
        reviews: [],
        comments: [],
        status: 'active'
    } as Ad;
}

export const MOCK_ADS: Ad[] = [
  // 6 Electronics
  createAd(1, 0, {
    title: 'Pristine iPhone 14 Pro', description: 'Barely used iPhone 14 Pro, 256GB, Deep Purple. Comes with original box and cable. No scratches or dents.', price: 850, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1678695193933-4a696a63503a?q=80&w=500', 'https://images.unsplash.com/photo-1663183578338-12585394285b?q=80&w=500', 'https://images.unsplash.com/photo-1664353424454-34327389a952?q=80&w=500'], category: 'Electronics', condition: 'used',
    location: { city: 'San Francisco', country: 'USA', coordinates: { lat: 37.7749, lng: -122.4194 } },
    specifications: { brand: 'Apple', model: 'iPhone 14 Pro', color: 'Deep Purple', size: '256GB', warranty: false },
    stats: { views: 1205, likes: 88, shares: 12, createdAt: '2024-05-20T10:00:00Z', updatedAt: '2024-05-22T11:00:00Z' },
    delivery: { available: true, cost: 15, time: '3-5 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(2, 0, {
    title: 'Dell XPS 15 Laptop', description: 'Powerful developer laptop. Intel i7, 32GB RAM, 1TB SSD, 4K OLED screen. Excellent condition.', price: 1600, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=500', 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=500', 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=500'], category: 'Electronics', condition: 'used',
    location: { city: 'Austin', country: 'USA', coordinates: { lat: 30.2672, lng: -97.7431 } },
    specifications: { brand: 'Dell', model: 'XPS 15 9520', color: 'Silver', warranty: true },
    stats: { views: 850, likes: 65, shares: 8, createdAt: '2024-05-18T14:00:00Z', updatedAt: '2024-05-21T10:00:00Z' },
    delivery: { available: true, cost: 25, time: '2-4 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(3, 6, {
    title: 'Brand New Sony WH-1000XM5 Headphones', description: 'Unopened, factory-sealed Sony noise-cancelling headphones. Won them in a contest but already have a pair.', price: 350, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1654572233687-343d64a81b37?q=80&w=500', 'https://images.unsplash.com/photo-1627916573383-568853a0f7c2?q=80&w=500'], category: 'Electronics', condition: 'new',
    location: { city: 'Miami', country: 'USA', coordinates: { lat: 25.7617, lng: -80.1918 } },
    specifications: { brand: 'Sony', model: 'WH-1000XM5', color: 'Black', warranty: true },
    stats: { views: 2510, likes: 210, shares: 35, createdAt: '2024-05-22T08:00:00Z', updatedAt: '2024-05-22T08:00:00Z' },
    delivery: { available: true, cost: 0, time: '5-7 days', type: 'both' },
    availability: { quantity: 1, inStock: true }
  }, [
    { id: 'rep1', reporter: MOCK_SELLERS[2] as User, reason: 'Price seems too good to be true.', createdAt: new Date('2024-05-22T09:00:00Z') },
    { id: 'rep2', reporter: MOCK_SELLERS[3] as User, reason: 'Suspected scam.', createdAt: new Date('2024-05-22T10:30:00Z') }
  ]),
  createAd(4, 0, {
    title: 'Refurbished Samsung Galaxy Tab S8', description: 'Professionally refurbished tablet. Works like new. Great for media and productivity. 128GB model.', price: 400, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1616443254103-649339463b36?q=80&w=500', 'https://images.unsplash.com/photo-1621360124973-5105e1a35a11?q=80&w=500'], category: 'Electronics', condition: 'refurbished',
    location: { city: 'Seattle', country: 'USA', coordinates: { lat: 47.6062, lng: -122.3321 } },
    specifications: { brand: 'Samsung', model: 'Galaxy Tab S8', color: 'Graphite', size: '128GB', warranty: true },
    stats: { views: 430, likes: 25, shares: 5, createdAt: '2024-05-15T12:00:00Z', updatedAt: '2024-05-20T18:00:00Z' },
    delivery: { available: true, cost: 10, time: '4-6 days', type: 'delivery' },
    availability: { quantity: 5, inStock: true }
  }),
   createAd(5, 7, {
    title: 'GoPro HERO11 Black Action Camera', description: 'Used for one trip, fantastic condition. Includes battery, case, and a few mounts.', price: 300, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1676348149372-76493545464b?q=80&w=500'], category: 'Electronics', condition: 'used',
    location: { city: 'Denver', country: 'USA', coordinates: { lat: 39.7392, lng: -104.9903 } },
    specifications: { brand: 'GoPro', model: 'HERO11', color: 'Black', warranty: false },
    stats: { views: 950, likes: 115, shares: 15, createdAt: '2024-05-23T10:00:00Z', updatedAt: '2024-05-23T10:00:00Z' },
    delivery: { available: true, cost: 10, time: '3-5 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(6, 6, {
    title: 'Nintendo Switch OLED Model', description: 'Like new condition, includes all original accessories and packaging. Super Mario Odyssey included.', price: 320, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1653503525433-213795a1b327?q=80&w=500'], category: 'Electronics', condition: 'used',
    location: { city: 'Tokyo', country: 'Japan', coordinates: { lat: 35.6762, lng: 139.6503 } },
    specifications: { brand: 'Nintendo', model: 'Switch OLED', color: 'White', size: '64GB', warranty: false },
    stats: { views: 1800, likes: 250, shares: 30, createdAt: '2024-05-19T08:30:00Z', updatedAt: '2024-05-22T19:00:00Z' },
    delivery: { available: true, cost: 25, time: '7-10 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  // 6 Fashion
  createAd(7, 1, {
    title: 'Vintage Levi\'s Denim Jacket', description: 'Classic trucker jacket from the 80s. Perfectly worn in. Men\'s size Large.', price: 120, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500', 'https://images.unsplash.com/photo-1608234807921-a3591e84732a?q=80&w=500'], category: 'Fashion', condition: 'used',
    location: { city: 'New York', country: 'USA', coordinates: { lat: 40.7128, lng: -74.0060 } },
    specifications: { brand: 'Levi\'s', model: 'Trucker Jacket', color: 'Blue Denim', size: 'L', warranty: false },
    stats: { views: 980, likes: 150, shares: 20, createdAt: '2024-05-19T11:00:00Z', updatedAt: '2024-05-20T09:00:00Z' },
    delivery: { available: true, cost: 10, time: '3-5 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(8, 1, {
    title: 'Gucci Marmont Handbag', description: 'Authentic Gucci Marmont small matelassé shoulder bag in black leather. Used twice, in mint condition. Comes with dust bag and authenticity cards.', price: 1800, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=500', 'https://images.unsplash.com/photo-1579540645217-a875a5091550?q=80&w=500'], category: 'Fashion', condition: 'used',
    location: { city: 'Los Angeles', country: 'USA', coordinates: { lat: 34.0522, lng: -118.2437 } },
    specifications: { brand: 'Gucci', model: 'Marmont', color: 'Black', warranty: false },
    stats: { views: 2200, likes: 350, shares: 45, createdAt: '2024-05-21T18:00:00Z', updatedAt: '2024-05-21T18:00:00Z' },
    delivery: { available: true, cost: 50, time: '1-3 days (insured)', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(9, 6, {
    title: 'Nike Air Max 90 Sneakers', description: 'Brand new, never worn Air Max 90s in classic white. Size 10 US Men\'s.', price: 130, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500', 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcdda9?q=80&w=500'], category: 'Fashion', condition: 'new',
    location: { city: 'Chicago', country: 'USA', coordinates: { lat: 41.8781, lng: -87.6298 } },
    specifications: { brand: 'Nike', model: 'Air Max 90', color: 'White', size: '10', warranty: false },
    stats: { views: 1500, likes: 180, shares: 25, createdAt: '2024-05-22T12:00:00Z', updatedAt: '2024-05-22T12:00:00Z' },
    delivery: { available: true, cost: 12, time: '4-6 days', type: 'both' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(10, 3, {
    title: 'Ray-Ban Aviator Sunglasses', description: 'Classic Ray-Ban Aviators with gold frame and green lenses. Lightly used, no scratches.', price: 80, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500', 'https://images.unsplash.com/photo-1577803645773-0ab7d374e2d3?q=80&w=500'], category: 'Fashion', condition: 'used',
    location: { city: 'Las Vegas', country: 'USA', coordinates: { lat: 36.1699, lng: -115.1398 } },
    specifications: { brand: 'Ray-Ban', model: 'Aviator Classic', color: 'Gold', warranty: false },
    stats: { views: 640, likes: 70, shares: 10, createdAt: '2024-05-17T09:00:00Z', updatedAt: '2024-05-19T15:00:00Z' },
    delivery: { available: true, cost: 5, time: '3-5 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
    createAd(11, 1, {
    title: 'Men\'s Leather Dress Shoes', description: 'Brand new Italian leather shoes. Size 11 US, black. Never worn, perfect for formal events.', price: 180, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1449505978122-05f32b35a231?q=80&w=500'], category: 'Fashion', condition: 'new',
    location: { city: 'Milan', country: 'Italy', coordinates: { lat: 45.4642, lng: 9.1900 } },
    specifications: { brand: 'Bontoni', model: 'Classic Oxford', color: 'Black', size: '11', warranty: false },
    stats: { views: 550, likes: 85, shares: 10, createdAt: '2024-05-21T14:00:00Z', updatedAt: '2024-05-21T14:00:00Z' },
    delivery: { available: true, cost: 30, time: '5-8 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(12, 1, {
    title: 'Designer Silk Scarf', description: 'Beautiful 100% silk scarf with a unique pattern. Large size, can be worn many ways.', price: 250, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=500'], category: 'Fashion', condition: 'new',
    location: { city: 'Paris', country: 'France', coordinates: { lat: 48.8566, lng: 2.3522 } },
    specifications: { brand: 'Hermès', model: 'Carré', color: 'Multicolor', size: '90cm x 90cm', warranty: false },
    stats: { views: 900, likes: 180, shares: 28, createdAt: '2024-04-30T10:00:00Z', updatedAt: '2024-05-15T12:00:00Z' },
    delivery: { available: true, cost: 20, time: '4-7 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  // 4 Home & Garden
  createAd(13, 2, {
    title: 'Mid-Century Modern Sofa', description: 'Three-seater sofa in teal fabric with wooden legs. Great condition, from a smoke-free home.', price: 600, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500', 'https://images.unsplash.com/photo-1540574163024-583d3f2c5d49?q=80&w=500'], category: 'Home & Garden', condition: 'used',
    location: { city: 'Portland', country: 'USA', coordinates: { lat: 45.5051, lng: -122.6750 } },
    specifications: { brand: 'West Elm', model: 'Andes', color: 'Teal', warranty: false },
    stats: { views: 750, likes: 95, shares: 15, createdAt: '2024-05-16T19:00:00Z', updatedAt: '2024-05-20T14:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'pickup' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(14, 7, {
    title: 'Dyson V11 Cordless Vacuum', description: 'Powerful and lightweight vacuum. Comes with all original attachments. Battery holds a full charge.', price: 300, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1583744946564-b5291c3874f2?q=80&w=500', 'https://images.unsplash.com/photo-1629102717834-5c90538a8511?q=80&w=500'], category: 'Home & Garden', condition: 'used',
    location: { city: 'London', country: 'UK', coordinates: { lat: 51.5072, lng: -0.1276 } },
    specifications: { brand: 'Dyson', model: 'V11', color: 'Blue', warranty: false },
    stats: { views: 1800, likes: 160, shares: 30, createdAt: '2024-05-20T13:00:00Z', updatedAt: '2024-05-21T16:00:00Z' },
    delivery: { available: true, cost: 20, time: '2-4 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(15, 2, {
    title: 'Set of 4 Patio Chairs', description: 'Brand new, unassembled wicker patio chairs. Weather-resistant and very comfortable. Cushions included.', price: 250, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1598532289940-1a2218635b7a?q=80&w=500', 'https://images.unsplash.com/photo-1617104677243-57053a45c345?q=80&w=500'], category: 'Home & Garden', condition: 'new',
    location: { city: 'San Diego', country: 'USA', coordinates: { lat: 32.7157, lng: -117.1611 } },
    specifications: { brand: 'Hampton Bay', model: 'Cambridge', color: 'Brown', warranty: false },
    stats: { views: 350, likes: 40, shares: 5, createdAt: '2024-05-21T10:00:00Z', updatedAt: '2024-05-21T10:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'pickup' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(16, 2, {
    title: 'Refurbished KitchenAid Mixer', description: 'Artisan Series 5-quart stand mixer, professionally refurbished. Works perfectly. Comes with three attachments.', price: 220, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1558985228-a2a4a75a7453?q=80&w=500', 'https://images.unsplash.com/photo-1607920591851-970c6ba1c74a?q=80&w=500'], category: 'Home & Garden', condition: 'refurbished',
    location: { city: 'Paris', country: 'France', coordinates: { lat: 48.8566, lng: 2.3522 } },
    specifications: { brand: 'KitchenAid', model: 'Artisan', color: 'Empire Red', warranty: true },
    stats: { views: 990, likes: 110, shares: 18, createdAt: '2024-04-19T16:00:00Z', updatedAt: '2024-05-22T09:00:00Z' },
    delivery: { available: true, cost: 30, time: '5-8 days', type: 'delivery' },
    availability: { quantity: 3, inStock: true }
  }),
  // 3 Vehicles
  createAd(17, 3, {
    title: '2019 Toyota RAV4 Hybrid', description: 'Excellent condition, one owner, low mileage (35,000 miles). All-wheel drive, great fuel economy. All service records available.', price: 28000, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1626953424151-487213425e43?q=80&w=500', 'https://images.unsplash.com/photo-1617469739922-26645e12f1a6?q=80&w=500'], category: 'Vehicles', condition: 'used',
    location: { city: 'Denver', country: 'USA', coordinates: { lat: 39.7392, lng: -104.9903 } },
    specifications: { brand: 'Toyota', model: 'RAV4 Hybrid XLE', color: 'Magnetic Gray', warranty: false },
    stats: { views: 3500, likes: 250, shares: 40, createdAt: '2024-05-20T15:00:00Z', updatedAt: '2024-05-21T11:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'pickup' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(18, 3, {
    title: 'Custom Cafe Racer Motorcycle', description: 'Beautifully restored and customized 1978 Honda CB750. A real head-turner. Runs perfectly.', price: 8500, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=500', 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=500'], category: 'Vehicles', condition: 'used',
    location: { city: 'Berlin', country: 'Germany', coordinates: { lat: 52.5200, lng: 13.4050 } },
    specifications: { brand: 'Honda', model: 'CB750 Custom', color: 'Matte Black', warranty: false },
    stats: { views: 1900, likes: 300, shares: 50, createdAt: '2024-05-18T20:00:00Z', updatedAt: '2024-05-20T21:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'pickup' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(19, 7, {
    title: 'Trek Marlin 5 Mountain Bike', description: 'Brand new Marlin 5, size M/L. Great for trails and city commuting. Never ridden.', price: 650, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1576426863848-c21f68c6aa92?q=80&w=500', 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=500'], category: 'Vehicles', condition: 'new',
    location: { city: 'Vancouver', country: 'Canada', coordinates: { lat: 49.2827, lng: -123.1207 } },
    specifications: { brand: 'Trek', model: 'Marlin 5', color: 'Red', size: 'M/L', warranty: true },
    stats: { views: 500, likes: 45, shares: 10, createdAt: '2024-05-22T14:00:00Z', updatedAt: '2024-05-22T14:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'pickup' },
    availability: { quantity: 1, inStock: true }
  }),
  // 3 Real Estate
  createAd(20, 4, {
    title: 'Downtown Loft Apartment for Rent', description: 'Spacious 1-bedroom loft with high ceilings, exposed brick, and city views. 12-month lease. Price is per month.', price: 3200, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=500', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=500'], category: 'Real Estate', condition: 'used', // 'used' for rentals
    location: { city: 'New York', country: 'USA', coordinates: { lat: 40.7128, lng: -74.0060 } },
    specifications: { brand: 'N/A', model: 'Apartment', color: 'N/A', size: '800 sqft', warranty: false },
    stats: { views: 5600, likes: 300, shares: 50, createdAt: '2024-05-15T10:00:00Z', updatedAt: '2024-05-20T12:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'pickup' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(21, 4, {
    title: 'Luxury Villa with Pool for Sale', description: 'Stunning 5-bedroom villa in a gated community. Features a private pool, home theater, and modern kitchen.', price: 2500000, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=500', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=500'], category: 'Real Estate', condition: 'used', // 'used' for resales
    location: { city: 'Dubai', country: 'UAE', coordinates: { lat: 25.276987, lng: 55.296249 } },
    specifications: { brand: 'N/A', model: 'Villa', color: 'N/A', size: '6,000 sqft', warranty: false },
    stats: { views: 8900, likes: 800, shares: 120, createdAt: '2024-05-10T11:00:00Z', updatedAt: '2024-05-19T17:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'pickup' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(22, 4, {
    title: 'Cozy Suburban House', description: 'Charming 3-bed, 2-bath house with a large backyard. Perfect for a family. Located in a great school district.', price: 650000, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=500', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=500'], category: 'Real Estate', condition: 'used',
    location: { city: 'Sydney', country: 'Australia', coordinates: { lat: -33.8688, lng: 151.2093 } },
    specifications: { brand: 'N/A', model: 'House', color: 'N/A', size: '2,200 sqft', warranty: false },
    stats: { views: 4500, likes: 420, shares: 80, createdAt: '2024-05-17T13:00:00Z', updatedAt: '2024-05-22T10:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'pickup' },
    availability: { quantity: 1, inStock: true }
  }),
  // 2 Services
  createAd(23, 5, {
    title: 'Freelance Web Development', description: 'Professional website design and development services. Specializing in React, Node.js, and e-commerce solutions. Price is per hour.', price: 75, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=500', 'https://images.unsplash.com/photo-1522071820081-009f0129c7da?q=80&w=500'], category: 'Services', condition: 'new',
    location: { city: 'Remote', country: 'Worldwide', coordinates: { lat: 0, lng: 0 } },
    specifications: { brand: 'N/A', model: 'Web Development', warranty: false, color: 'N/A' },
    stats: { views: 1300, likes: 90, shares: 15, createdAt: '2024-05-21T11:00:00Z', updatedAt: '2024-05-21T11:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'delivery' },
    availability: { quantity: 99, inStock: true }
  }, [
    { id: 'rep3', reporter: MOCK_SELLERS[1] as User, reason: 'This seems like spam.', createdAt: new Date('2024-05-21T15:00:00Z') }
  ]),
  createAd(24, 6, {
    title: 'Math & Physics Tutoring', description: 'Experienced tutor available for high school and university level math and physics. Online sessions via Zoom. Price is per hour.', price: 50, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=500', 'https://images.unsplash.com/photo-1596495577886-d9256f442323?q=80&w=500'], category: 'Services', condition: 'new',
    location: { city: 'Remote', country: 'Worldwide', coordinates: { lat: 0, lng: 0 } },
    specifications: { brand: 'N/A', model: 'Tutoring', warranty: false, color: 'N/A' },
    stats: { views: 450, likes: 30, shares: 3, createdAt: '2024-04-18T17:00:00Z', updatedAt: '2024-05-18T17:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'delivery' },
    availability: { quantity: 99, inStock: true },
    documents: [{
      name: 'Course_Syllabus.pdf',
      url: '#', // In a real app, this would be a URL to the PDF file
      previewUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=500' // A placeholder image simulating the first page
    }]
  }),
];

// --- Augment Ads with Social Data ---

// Ad 1: iPhone 14 Pro
const ad01 = MOCK_ADS.find(ad => ad.id === 'ad-01');
if (ad01) {
    ad01.reviews = [
        {
            id: 'review-1-1', author: MOCK_SELLERS[2] as User, text: "Got the phone, it's exactly as described. Flawless condition. Thanks Tom!",
            rating: 5, likes: 12, replies: [], createdAt: new Date('2024-05-23T10:00:00Z'), isEdited: false,
        },
        {
            id: 'review-1-2', author: MOCK_SELLERS[1] as User, text: "Fast shipping and great communication. The phone is perfect.",
            rating: 5, likes: 8, replies: [], createdAt: new Date('2024-05-24T11:00:00Z'), isEdited: false,
        },
    ];
    ad01.comments = [
        {
            id: 'comment-1-1', author: MOCK_SELLERS[6] as User, text: "Is the price negotiable?",
            likes: 2,
            replies: [
                {
                    id: 'reply-1-1-1', author: MOCK_SELLERS[0] as User, text: "Hi Nick, the price is firm for now as it's already a good deal for its condition. Thanks for your interest!",
                    likes: 5, replies: [], createdAt: new Date('2024-05-21T14:00:00Z'), isEdited: false,
                }
            ],
            createdAt: new Date('2024-05-21T12:30:00Z'), isEdited: false,
        },
        {
            id: 'comment-1-2', author: MOCK_SELLERS[3] as User, text: "Does it come with a case?",
            likes: 1, replies: [], createdAt: new Date('2024-05-22T09:00:00Z'), isEdited: false,
        }
    ];
    const totalRating = ad01.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    ad01.rating = totalRating / (ad01.reviews.length || 1);
}

// Ad 7: Vintage Levi's Denim Jacket
const ad07 = MOCK_ADS.find(ad => ad.id === 'ad-07');
if (ad07) {
    ad07.reviews = [
        {
            id: 'review-7-1', author: MOCK_SELLERS[3] as User, text: "This jacket is even better in person. Perfectly worn in. A real classic.",
            rating: 5, likes: 15, replies: [], createdAt: new Date('2024-05-21T18:00:00Z'), isEdited: false,
        },
        {
            id: 'review-7-2', author: MOCK_SELLERS[6] as User, text: "Shipping was a bit slow, but the item is great.",
            rating: 4, likes: 2, replies: [], createdAt: new Date('2024-05-22T19:00:00Z'), isEdited: false,
        },
    ];
    ad07.comments = [
        {
            id: 'comment-7-1', author: MOCK_SELLERS[2] as User, text: "What are the measurements (pit to pit, length)?",
            likes: 4, 
            replies: [
                {
                    id: 'reply-7-1-1', author: MOCK_SELLERS[1] as User, text: "Sure! It's 22 inches pit to pit and 25 inches from collar to hem.",
                    likes: 3, replies: [], createdAt: new Date('2024-05-20T10:00:00Z'), isEdited: false,
                }
            ], 
            createdAt: new Date('2024-05-19T20:00:00Z'), isEdited: false,
        }
    ];
    const totalRating = ad07.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    ad07.rating = totalRating / (ad07.reviews.length || 1);
}

// Ad 17: Toyota RAV4 - Add a review
const ad17 = MOCK_ADS.find(ad => ad.id === 'ad-17');
if (ad17) {
    ad17.reviews = [
        {
            id: 'review-17-1', author: MOCK_SELLERS[0] as User, text: "Gary is a true professional. The car was in even better condition than described. Smooth transaction.",
            rating: 5, likes: 10, replies: [], createdAt: new Date('2024-05-23T18:00:00Z'), isEdited: false,
        }
    ];
    ad17.comments = [
        {
            id: 'comment-17-1', author: MOCK_SELLERS[2] as User, text: "Has the car been in any accidents?",
            likes: 7, 
            replies: [
                {
                    id: 'reply-17-1-1', author: MOCK_SELLERS[3] as User, text: "Nope, clean title and no accidents. Happy to provide the CARFAX report.",
                    likes: 9, replies: [], createdAt: new Date('2024-05-21T10:00:00Z'), isEdited: false,
                }
            ], 
            createdAt: new Date('2024-05-20T21:00:00Z'), isEdited: false,
        }
    ];
    const totalRating = ad17.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    ad17.rating = totalRating / (ad17.reviews.length || 1);
}

// Ad 2: Dell XPS 15 Laptop
const ad02 = MOCK_ADS.find(ad => ad.id === 'ad-02');
if (ad02) {
    ad02.reviews = [
        {
            id: 'review-2-1', author: MOCK_SELLERS[6] as User, text: "Laptop is a beast! Arrived quickly and was packaged securely. Exactly as described.",
            rating: 5, likes: 7, replies: [], createdAt: new Date('2024-05-22T10:00:00Z'), isEdited: false,
        },
        {
            id: 'review-2-2', author: MOCK_SELLERS[5] as User, text: "Great laptop, fair price. There was a minor issue with a driver but the seller was super helpful in resolving it.",
            rating: 4, likes: 3, replies: [], createdAt: new Date('2024-05-23T11:00:00Z'), isEdited: false,
        },
    ];
    ad02.comments = [
        {
            id: 'comment-2-1', author: MOCK_SELLERS[5] as User, text: "Is the RAM user-upgradeable on this model?",
            likes: 3,
            replies: [
                {
                    id: 'reply-2-1-1', author: MOCK_SELLERS[0] as User, text: "Yes, it is. This model has two SODIMM slots and supports up to 64GB of RAM.",
                    likes: 6, replies: [], createdAt: new Date('2024-05-20T14:00:00Z'), isEdited: false,
                }
            ],
            createdAt: new Date('2024-05-20T12:30:00Z'), isEdited: false,
        },
    ];
    const totalRating = ad02.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    ad02.rating = totalRating / (ad02.reviews.length || 1);
}

// Ad 8: Gucci Marmont Handbag
const ad08 = MOCK_ADS.find(ad => ad.id === 'ad-08');
if (ad08) {
    ad08.reviews = [
        {
            id: 'review-8-1', author: MOCK_SELLERS[4] as User, text: "Absolutely stunning bag. It's authentic and in perfect condition. Fiona is a pleasure to buy from.",
            rating: 5, likes: 22, replies: [], createdAt: new Date('2024-05-23T14:00:00Z'), isEdited: false,
        }
    ];
    ad08.comments = [
         {
            id: 'comment-8-1', author: MOCK_SELLERS[6] as User, text: "Hi, can you confirm its authenticity? Any proof of purchase?",
            likes: 5,
            replies: [
                {
                    id: 'reply-8-1-1', author: MOCK_SELLERS[1] as User, text: "Hi! Absolutely, it's 100% authentic. I have the original receipt from the Gucci boutique and all authenticity cards, which will be included.",
                    likes: 8, replies: [], createdAt: new Date('2024-05-22T16:00:00Z'), isEdited: false,
                }
            ],
            createdAt: new Date('2024-05-22T15:30:00Z'), isEdited: false,
        },
    ];
    const totalRating = ad08.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    ad08.rating = totalRating / (ad08.reviews.length || 1);
}

// Ad 13: Mid-Century Modern Sofa
const ad13 = MOCK_ADS.find(ad => ad.id === 'ad-13');
if (ad13) {
    ad13.reviews = [
         {
            id: 'review-13-1', author: MOCK_SELLERS[1] as User, text: "Love the sofa! It's the perfect centerpiece for my living room. Henry was very helpful during pickup.",
            rating: 5, likes: 4, replies: [], createdAt: new Date('2024-05-22T15:00:00Z'), isEdited: false,
        },
    ];
    ad13.comments = [
        {
            id: 'comment-13-1', author: MOCK_SELLERS[6] as User, text: "Are there any stains or tears on the fabric? And would you be able to help load it into a truck?",
            likes: 2,
            replies: [
                {
                    id: 'reply-13-1-1', author: MOCK_SELLERS[2] as User, text: "No stains or tears at all! And yes, I can definitely help you load it.",
                    likes: 3, replies: [], createdAt: new Date('2024-05-18T11:00:00Z'), isEdited: false,
                }
            ],
            createdAt: new Date('2024-05-18T10:00:00Z'), isEdited: false,
        },
    ];
    const totalRating = ad13.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    ad13.rating = totalRating / (ad13.reviews.length || 1);
}