import { Event } from './api';

// Sample events that match the actual database schema
export const sampleEventsForDB: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'time' | 'spots' | 'total_spots' | 'image' | 'status' | 'long_description' | 'flyer' | 'rating'>[] = [
  {
    title: "Akosombo Games Day - Action Packed Day Trip",
    description: "Full day trip to Akosombo with games, sightseeing, and community fun",
    date: "2025-06-15",
    time_range: "6:00 AM - 8:00 PM",
    location: "Akosombo, Eastern Region",
    category: "travel",
    capacity: 20,
    price: "₵180",
    image_url: "🏞️",
    organizer: "G&C Adventure Team",
    requirements: ["Comfortable walking shoes", "Swimming gear (optional)", "Valid ID for travel", "Positive attitude"],
    includes: ["Round-trip transportation", "Lunch and refreshments", "Guided tour", "Games equipment", "Photography"],
    agenda: [
      { time: "6:00 AM", activity: "Departure from Accra" },
      { time: "8:30 AM", activity: "Arrival and orientation" },
      { time: "9:00 AM", activity: "Akosombo Dam tour" },
      { time: "11:00 AM", activity: "Outdoor games session" },
      { time: "1:00 PM", activity: "Lunch by the lake" },
      { time: "2:30 PM", activity: "Boat cruise (optional)" },
      { time: "4:00 PM", activity: "Team building activities" },
      { time: "6:00 PM", activity: "Return journey to Accra" }
    ],
    gallery: [
      "https://khwlznxnqlhxvyktsymy.supabase.co/storage/v1/object/sign/event-images/Akosombo%20Games%20Day%20(5).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQWtvc29tYm8gR2FtZXMgRGF5ICg1KS5qcGciLCJpYXQiOjE3NDc4MjEzOTAsImV4cCI6MTgzNDIyMTM5MH0.9Dg6FqJcPIo2vRgDrX_k1nSNZGaRzjQDf2BHR9c_IpY",
      "https://khwlznxnqlhxvyktsymy.supabase.co/storage/v1/object/sign/event-images/Akosombo%20Games%20Day%20(4).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQWtvc29tYm8gR2FtZXMgRGF5ICg0KS5qcGciLCJpYXQiOjE3NDc4MjEzOTAsImV4cCI6MTgzNDIyMTM5MH0.nYH8VmEoKAP4qKUJpLj2CZA7GJDf_QM8uXzNWaEqTTc"
    ],
    additional_info: {
      long_description: "Join us for an unforgettable day trip to Akosombo! Experience the beautiful scenery of Lake Volta while engaging in exciting outdoor games and activities. This trip combines adventure, relaxation, and community building in one of Ghana's most scenic locations. Perfect for those looking to escape the city and connect with nature and new friends.",
      organizer: "G&C Adventure Team",
      status: "completed"
    }
  },
  {
    title: "Beach Day & Games",
    description: "Sun, sand, games, and great vibes at the beach",
    date: "2025-07-08",
    time_range: "8:00 AM - 6:00 PM",
    location: "Labadi Beach, Accra",
    category: "outdoor",
    capacity: 25,
    price: "₵120",
    image_url: "🏖️",
    organizer: "G&C Beach Squad",
    requirements: ["Swimming skills (optional)", "Sunscreen", "Beach attire", "Towel"],
    includes: ["Beach entry fees", "Games equipment", "Lunch and drinks", "First aid support", "Group photos"],
    agenda: [
      { time: "8:00 AM", activity: "Meet-up and travel to beach" },
      { time: "9:00 AM", activity: "Beach setup and warm-up games" },
      { time: "10:30 AM", activity: "Beach volleyball tournament" },
      { time: "12:00 PM", activity: "Swimming and water activities" },
      { time: "1:00 PM", activity: "Beach picnic lunch" },
      { time: "2:30 PM", activity: "Beach soccer and frisbee" },
      { time: "4:00 PM", activity: "Relaxation and socializing" },
      { time: "5:30 PM", activity: "Cleanup and departure" }
    ],
    gallery: [
      "https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Beach%20day%20%26%20games%20(2).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQmVhY2ggZGF5ICUyNiBnYW1lcyAoMikuanBnIiwiaWF0IjoxNzQ3ODIxNTIzLCJleHAiOjE4MzQyMjE1MjN9.VYX8oS-yJ1MprAhJ9Ht0CXn7ePfWOCWe3x9-j5CKHGY",
      "https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Beach%20day%20%26%20games%20(3).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQmVhY2ggZGF5ICUyNiBnYW1lcyAoMykuanBnIiwiaWF0IjoxNzQ3ODIxNTIzLCJleHAiOjE4MzQyMjE1MjN9.nP2tGxQj8mN_rKL4sE9JcVzThBfA0dRqCaJxM2FQLUY"
    ],
    additional_info: {
      long_description: "Escape to the beautiful beaches of Ghana for a day of sun, sand, and exciting beach games! Join fellow adventure seekers for volleyball, frisbee, beach soccer, and water activities. This event combines the relaxation of beach time with the excitement of friendly competition and community building. All skill levels welcome!",
      organizer: "G&C Beach Squad",
      status: "completed"
    }
  },
  {
    title: "Gaming Tournament & Networking",
    description: "Epic gaming tournament with prizes, networking opportunities, and community building.",
    date: "2025-09-05",
    time_range: "3:00 PM - 10:00 PM",
    location: "East Legon, Accra",
    category: "gaming",
    capacity: 32,
    price: "₵50",
    image_url: "🎮",
    organizer: "G&C Gaming Squad",
    requirements: ["Gaming skills", "Positive attitude", "Team spirit"],
    includes: ["Tournament entry", "Refreshments", "Prizes", "Networking session"],
    agenda: [
      { time: "3:00 PM", activity: "Registration and warm-up" },
      { time: "4:00 PM", activity: "Tournament begins" },
      { time: "6:00 PM", activity: "Break and networking" },
      { time: "7:00 PM", activity: "Finals" },
      { time: "8:30 PM", activity: "Awards and socializing" }
    ],
    gallery: [],
    additional_info: {
      long_description: "Join us for an exciting gaming tournament featuring popular games like FIFA, Mobile Legends, and more. Compete for amazing prizes while networking with fellow gamers and tech enthusiasts. All skill levels welcome!",
      organizer: "G&C Gaming Squad",
      status: "open"
    }
  }
];
