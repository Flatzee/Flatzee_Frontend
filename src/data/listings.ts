/*───────────────────────────────────────────────────────────────────────────────
MEDIA-CAROUSEL PATCH NOTES  (delete this whole block to remove comments)

What changed & why:
1) type Listing gains:
   - videos?: { src, poster?, type? }[]   // for the "Reel" slide (left-most)
   - coords?: { lat, lng }                 // for the "Map" slide (right-most)

2) Sample data:
   - A few listings now include simple demo videos (royalty-free MP4s) and posters.
   - coords were added to several listings (approximate lat/lng for Nepali cities).

3) Backwards compatibility:
   - Existing code using images continues to work.
   - If a listing has no videos, your carousel can show the “No video uploaded” placeholder.
   - If a listing has no coords, simply omit the map slide.

Next steps:
- Replace ImageCarousel with your new MediaCarousel and derive slides as:
  const slides = [
    ...(listing.videos?.length ? listing.videos.map(v => ({ kind: "video", ...v })) : [{ kind: "placeholder", text: "No video uploaded" }]),
    ...listing.images.map(src => ({ kind: "image", src })),
    ...(listing.coords ? [{ kind: "map", lat: listing.coords.lat, lng: listing.coords.lng }] : []),
  ];

You can safely delete this block anytime.
───────────────────────────────────────────────────────────────────────────────*/

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
  badges?: ("premium" | "popular" | "verified" | "sponsored" | "featured" | "forYou")[]
  short?: string
  maxGuests?: number
  availability?: { start: string; end: string }[]

  // ── MEDIA-CAROUSEL PATCH FIELDS (optional) ────────────────────────────────
  videos?: Array<{ src: string; poster?: string; type?: string }>
  coords?: { lat: number; lng: number }
}

export const LISTINGS: Listing[] = [
  {
    id: "fz-01",
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
    videos: [
      {
        src: "https://pvpplontieikwxwhloyu.supabase.co/storage/v1/object/public/flatzee_video/listing_reel/fz-01-reel.mp4",
        poster: "https://pvpplontieikwxwhloyu.supabase.co/storage/v1/object/public/flatzee_video/listing_reel/fz-01-reel.jpg",
        type: "video/mp4",
      },
    ],
    coords: { lat: 27.671, lng: 85.429 }, // Bhaktapur approx
  },
  {
    id: "fz-02",
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
    videos: [
      {
        src: "https://pvpplontieikwxwhloyu.supabase.co/storage/v1/object/public/flatzee_video/listing_reel/fz-01-reel-20251010-164315-117.mp4",
       poster: "https://pvpplontieikwxwhloyu.supabase.co/storage/v1/object/public/flatzee_video/listing_reel/fz-01-reel-20251010-164315-117.jpg",
        type: "video/mp4",
      },
    ],
    coords: { lat: 27.7172, lng: 85.3240 }, // Kathmandu approx
  },
  {
    id: "fz-03",
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
    // no video here to exercise the "No video uploaded" placeholder
    coords: { lat: 28.2096, lng: 83.9856 }, // Pokhara approx
  },
  {
    id: "fz-04",
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
    coords: { lat: 27.6644, lng: 85.3188 }, // Lalitpur approx
  },
  {
    id: "fz-05",
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
      "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop",
    ],
    videos: [
      {
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        poster: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
        type: "video/mp4",
      },
    ],
    coords: { lat: 27.715, lng: 85.312 }, // Thamel approx
  },
  // ── (unchanged items below; added coords for a few where relevant) ─────────
  {
    id: "fz-06",
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
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    ],
    coords: { lat: 27.7215, lng: 85.3616 }, // Boudha approx
  },
  {
    id: "fz-07",
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
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    ],
    coords: { lat: 27.728, lng: 85.333 }, // Lazimpat approx
  },
  {
    id: "fz-08",
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
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    ],
    coords: { lat: 27.695, lng: 85.345 }, // New Baneshwor approx
  },
  // … (rest of your items unchanged; add coords/videos to whichever you like)
  {
    id: "fz-09",
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
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    ],
    coords: { lat: 27.736, lng: 85.334 }, // Baluwatar approx
  },

  // (All remaining entries from your original file can follow unchanged)
  // I’ll keep your original structure and only add coords where it helps demo.
  {
    id: "fz-10",
    title: "Modern Studio near Thamel",
    city: "Kathmandu",
    area: "Thamel",
    rating: 4.6,
    reviews: 85,
    verified: true,
    pricePerNight: 1800,
    hostName: "Aarav",
    hostYears: 3,
    badges: ["verified","featured"],
    short: "Compact studio with great nightlife access.",
    maxGuests: 2,
    availability: [
      { start: new Date().toISOString(), end: new Date(Date.now() + 5*24*60*60*1000).toISOString() },
    ],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478442-5fdba8d8a648?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop",
    ],
    coords: { lat: 27.715, lng: 85.312 },
  },
  // … keep the remainder of your provided listings as-is …
  // (For brevity, not re-pasting all unchanged entries; you can append the rest of your file below.

{
  id: "fz-11",
  title: "Cozy Family Apartment in Patan",
  city: "Lalitpur",
  area: "Jawalakhel",
  rating: 4.9,
  reviews: 142,
  verified: true,
  pricePerNight: 2500,
  hostName: "Maya",
  hostYears: 4,
  badges: ["premium","popular"],
  short: "Spacious apartment near zoo and cafes.",
  maxGuests: 5,
  availability: [
    { start: new Date().toISOString(), end: new Date(Date.now() + 10*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9d0?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
  ],
},
{
  id: "fz-12",
  title: "Lakeside Retreat with Balcony",
  city: "Pokhara",
  area: "Lakeside",
  rating: 4.7,
  reviews: 98,
  pricePerNight: 3200,
  hostName: "Prakash",
  hostYears: 5,
  badges: ["featured","forYou"],
  short: "Lake-facing view, perfect for couples.",
  maxGuests: 3,
  availability: [
    { start: new Date(Date.now() + 3*24*60*60*1000).toISOString(), end: new Date(Date.now() + 12*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop",
  ],
},
{
  id: "fz-13",
  title: "Budget Room near Lakeside",
  city: "Pokhara",
  area: "Khahare",
  rating: 4.2,
  reviews: 45,
  pricePerNight: 900,
  hostName: "Sunita",
  hostYears: 1,
  badges: ["popular"],
  short: "Affordable stay close to the lake.",
  maxGuests: 2,
  availability: [
    { start: new Date().toISOString(), end: new Date(Date.now() + 20*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478442-5fdba8d8a648?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600047509430-9e4e4e4dca9e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9d0?q=80&w=1600&auto=format&fit=crop",
  ],
},
{
  id: "fz-14",
  title: "Heritage Stay in Old Town",
  city: "Chitwan",
  area: "Bharatpur",
  rating: 4.5,
  reviews: 70,
  verified: true,
  pricePerNight: 2000,
  hostName: "Deepak",
  hostYears: 6,
  badges: ["verified","sponsored"],
  short: "Traditional homestay near Chitwan park.",
  maxGuests: 6,
  availability: [
    { start: new Date(Date.now() + 15*24*60*60*1000).toISOString(), end: new Date(Date.now() + 25*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478442-5fdba8d8a648?q=80&w=1600&auto=format&fit=crop",
  ],
},
{
  id: "fz-16",
  title: "Eco Lodge in Dharan Hills",
  city: "Dharan",
  area: "Bishnupaduka",
  rating: 4.9,
  reviews: 60,
  verified: true,
  pricePerNight: 2800,
  hostName: "Niraj",
  hostYears: 7,
  badges: ["premium","verified"],
  short: "Eco-friendly lodge with forest views.",
  maxGuests: 5,
  availability: [
    { start: new Date(Date.now() + 2*24*60*60*1000).toISOString(), end: new Date(Date.now() + 6*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600047509430-9e4e4e4dca9e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478442-5fdba8d8a648?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
  ],
},
{
  id: "fz-17",
  title: "Business Hotel Room",
  city: "Janakpur",
  rating: 4.1,
  reviews: 38,
  pricePerNight: 1300,
  hostName: "Laxmi",
  hostYears: 1,
  badges: ["sponsored"],
  short: "Convenient stay for quick business trips.",
  maxGuests: 2,
  availability: [
    { start: new Date(Date.now() + 1*24*60*60*1000).toISOString(), end: new Date(Date.now() + 4*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9d0?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600047509430-9e4e4e4dca9e?q=80&w=1600&auto=format&fit=crop",
  ],
},
{
  id: "fz-18",
  title: "Riverside Homestay",
  city: "Hetauda",
  rating: 4.4,
  reviews: 52,
  pricePerNight: 1200,
  hostName: "Santoshi",
  hostYears: 3,
  badges: ["popular","forYou"],
  short: "Peaceful riverside stay with garden.",
  maxGuests: 3,
  availability: [
    { start: new Date(Date.now() + 10*24*60*60*1000).toISOString(), end: new Date(Date.now() + 18*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9d0?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584132905271-6a3b74bf9d5c?q=80&w=1600&auto=format&fit=crop",
  ],
},
{
  id: "fz-19",
  title: "Luxury Villa with Pool",
  city: "Biratnagar",
  area: "Central Park",
  rating: 5.0,
  reviews: 200,
  verified: true,
  pricePerNight: 5500,
  hostName: "Krishna",
  hostYears: 8,
  badges: ["premium","featured","verified"],
  short: "Private villa with swimming pool & garden.",
  maxGuests: 8,
  availability: [
    { start: new Date().toISOString(), end: new Date(Date.now() + 14*24*60*60*1000).toISOString() },
  ],
  images: [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
  ],
},
{
   id: "fz-15",
  title: "Mountain View Cottage",
  city: "Butwal",
  area: "Tilottama",
  rating: 4.3,
  reviews: 54,
  pricePerNight: 1700,
  hostName: "Ramesh",
  hostYears: 2,
  badges: ["forYou"],
  short: "Wooden cottage with panoramic hill views.",
  maxGuests: 4,
  availability: [
    { start: new Date().toISOString(), end: new Date(Date.now() + 8*24*60*60*1000).toISOString() },
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
    id: "fz-21",
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
    id: "fz-22",
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
    id: "fz-23",
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
  id: "fz-24",
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
  "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop",
],
},
{
  id: "fz-25",
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
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
],
},
];

