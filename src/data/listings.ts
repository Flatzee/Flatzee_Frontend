export type Listing = {
  id: string
  title: string
  city: string
  area?: string
  rating: number
  reviews: number
  verified?: boolean
  pricePerNight: number
  images: string[]
  hostName: string
  hostYears: number
  badges?: ("premium" | "popular" | "verified" | "sponsored" | "featured" | "forYou")[];
  short?: string
  maxGuests?: number
  availability?: { start: string; end: string }[]
};

export const LISTINGS: Listing[] = [
  {
    id: "ktm-01",
    title: "Lovely 2-Bedroom in Bhaktapur",
    city: "Bhaktapur",
    area: "Sundhara",
    rating: 4.8,
    reviews: 110,
    verified: true,
    pricePerNight: 1100,
    hostName: "Sishir",
    hostYears: 2,
    badges: ["verified","popular"],
    short: "Spacious 2BHK with balcony & city views.",
    maxGuests: 4,
    availability: [
      { start: new Date().toISOString(), end: new Date(Date.now() + 7*24*60*60*1000).toISOString() },
      { start: new Date(Date.now() + 14*24*60*60*1000).toISOString(), end: new Date(Date.now() + 21*24*60*60*1000).toISOString() },
      { start: new Date(Date.now() + 30*24*60*60*1000).toISOString(), end: new Date(Date.now() + 36*24*60*60*1000).toISOString() },
    ],
    images: [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop",
    ],
  },
  {
    id: "ktm-02",
    title: "Minimal Studio in Lazimpat",
    city: "Kathmandu",
    rating: 4.6,
    reviews: 68,
    pricePerNight: 1600,
    hostName: "Rita",
    hostYears: 3,
    badges: ["premium","popular"],
    short: "Bright studio, walk to cafes.",
    maxGuests: 2,
    availability: [
      { start: new Date(Date.now() + 3*24*60*60*1000).toISOString(), end: new Date(Date.now() + 10*24*60*60*1000).toISOString() },
      { start: new Date(Date.now() + 24*60*60*1000).toISOString(), end: new Date(Date.now() + 2*24*60*60*1000).toISOString() },
      { start: new Date(Date.now() + 20*24*60*60*1000).toISOString(), end: new Date(Date.now() + 26*24*60*60*1000).toISOString() },
    ],
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8a?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
    ],
  },
  {
    id: "pkh-01",
    title: "Lake View Apartment",
    city: "Pokhara",
    rating: 4.9,
    reviews: 201,
    verified: true,
    pricePerNight: 2800,
    hostName: "Anish",
    hostYears: 4,
    badges: ["verified","premium"],
    short: "Balcony over Phewa Lake. Sunset heaven.",
    maxGuests: 5,
    availability: [
      { start: new Date(Date.now() + 8*24*60*60*1000).toISOString(), end: new Date(Date.now() + 15*24*60*60*1000).toISOString() },
      { start: new Date(Date.now() + 28*24*60*60*1000).toISOString(), end: new Date(Date.now() + 35*24*60*60*1000).toISOString() },
      { start: new Date(Date.now() + 40*24*60*60*1000).toISOString(), end: new Date(Date.now() + 46*24*60*60*1000).toISOString() },
    ],
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1600&auto=format&fit=crop",
    ],
  },
  {
    id: "btl-014",
    title: "Cozy Attic near Patan Durbar",
    city: "Lalitpur",
    rating: 4.5,
    reviews: 42,
    pricePerNight: 1200,
    hostName: "Prakash",
    hostYears: 1,
    badges: ["popular"],
    short: "Wooden beams, artsy neighborhood.",
    maxGuests: 3,
    availability: [
      { start: new Date(Date.now() + 1*24*60*60*1000).toISOString(), end: new Date(Date.now() + 5*24*60*60*1000).toISOString() },
      { start: new Date(Date.now() + 18*24*60*60*1000).toISOString(), end: new Date(Date.now() + 22*24*60*60*1000).toISOString() },
      { start: new Date(Date.now() + 33*24*60*60*1000).toISOString(), end: new Date(Date.now() + 39*24*60*60*1000).toISOString() },
    ],
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520881363902-a0ff4e722963?q=80&w=1600&auto=format&fit=crop",
    ],
  },
  {
  id: "ktm-101",
  title: "Sunny Studio in Thamel",
  city: "Kathmandu",
  rating: 4.7,
  reviews: 128,
  pricePerNight: 1500,
  hostName: "Anita",
  hostYears: 2,
  badges: ["popular"],
  short: "Bright studio in the heart of Thamel—walk to cafes & shops.",
  maxGuests: 2,
  availability: [
    { start: new Date(Date.now() + 2*24*60*60*1000).toISOString(), end: new Date(Date.now() + 6*24*60*60*1000).toISOString() },
    { start: new Date(Date.now() + 14*24*60*60*1000).toISOString(), end: new Date(Date.now() + 18*24*60*60*1000).toISOString() },
    { start: new Date(Date.now() + 30*24*60*60*1000).toISOString(), end: new Date(Date.now() + 36*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop",
  ],
},
{
  id: "ktm-023",
  title: "Modern 1BR near Boudha Stupa",
  city: "Kathmandu",
  rating: 4.8,
  reviews: 86,
  pricePerNight: 1800,
  hostName: "Tsering",
  hostYears: 3,
  badges: ["verified"],
  short: "Quiet apartment steps from Boudhanath; fast Wi-Fi & balcony.",
  maxGuests: 3,
  availability: [
    { start: new Date(Date.now() + 1*24*60*60*1000).toISOString(), end: new Date(Date.now() + 4*24*60*60*1000).toISOString() },
    { start: new Date(Date.now() + 12*24*60*60*1000).toISOString(), end: new Date(Date.now() + 16*24*60*60*1000).toISOString() },
    { start: new Date(Date.now() + 28*24*60*60*1000).toISOString(), end: new Date(Date.now() + 34*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520881363902-a0ff4e722963?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
  ],
},
{
  id: "ktm-032",
  title: "Family Apartment in Lazimpat",
  city: "Kathmandu",
  rating: 4.6,
  reviews: 64,
  pricePerNight: 2200,
  hostName: "Roshani",
  hostYears: 5,
  badges: ["premium"],
  short: "Spacious 2BR close to embassies; elevator & parking included.",
  maxGuests: 4,
  availability: [
    { start: new Date(Date.now() + 3*24*60*60*1000).toISOString(), end: new Date(Date.now() + 7*24*60*60*1000).toISOString() },
    { start: new Date(Date.now() + 20*24*60*60*1000).toISOString(), end: new Date(Date.now() + 24*24*60*60*1000).toISOString() },
    { start: new Date(Date.now() + 37*24*60*60*1000).toISOString(), end: new Date(Date.now() + 42*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520881363902-a0ff4e722963?q=80&w=1600&auto=format&fit=crop",
  ],
},
{
  id: "ktm-034",
  title: "Designer Loft in New Baneshwor",
  city: "Kathmandu",
  rating: 4.9,
  reviews: 210,
  pricePerNight: 2600,
  hostName: "Ashish",
  hostYears: 4,
  badges: ["verified", "popular"],
  short: "Airy loft with double-height windows; near cafes & transit.",
  maxGuests: 2,
  availability: [
    { start: new Date(Date.now() + 5*24*60*60*1000).toISOString(), end: new Date(Date.now() + 9*24*60*60*1000).toISOString() },
    { start: new Date(Date.now() + 17*24*60*60*1000).toISOString(), end: new Date(Date.now() + 21*24*60*60*1000).toISOString() },
    { start: new Date(Date.now() + 32*24*60*60*1000).toISOString(), end: new Date(Date.now() + 38*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
  ],
},
{
  id: "ktm-075",
  title: "Calm 2BR in Baluwatar",
  city: "Kathmandu",
  rating: 4.7,
  reviews: 95,
  pricePerNight: 2000,
  hostName: "Meera",
  hostYears: 6,
  badges: ["verified"],
  short: "Quiet lane, tree views, workspace & fast Wi-Fi.",
  maxGuests: 4,
  availability: [
    { start: new Date(Date.now() + 4*24*60*60*1000).toISOString(), end: new Date(Date.now() + 8*24*60*60*1000).toISOString() },
    { start: new Date(Date.now() + 15*24*60*60*1000).toISOString(), end: new Date(Date.now() + 19*24*60*60*1000).toISOString() },
    { start: new Date(Date.now() + 35*24*60*60*1000).toISOString(), end: new Date(Date.now() + 41*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520881363902-a0ff4e722963?q=80&w=1600&auto=format&fit=crop",
  ],
}

  
];

