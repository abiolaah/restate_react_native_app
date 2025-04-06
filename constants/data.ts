import icons from "./icons";
import images from "./images";

export const cards = [
  {
    title: "Card 1",
    location: "Location 1",
    price: "$100",
    rating: 4.8,
    category: "house",
    image: images.newYork,
  },
  {
    title: "Card 2",
    location: "Location 2",
    price: "$200",
    rating: 3,
    category: "house",
    image: images.japan,
  },
  {
    title: "Card 3",
    location: "Location 3",
    price: "$300",
    rating: 2,
    category: "flat",
    image: images.newYork,
  },
  {
    title: "Card 4",
    location: "Location 4",
    price: "$400",
    rating: 5,
    category: "villa",
    image: images.japan,
  },
];

export const featuredCards = [
  {
    title: "Featured 1",
    location: "Location 1",
    price: "$100",
    rating: 4.8,
    image: images.newYork,
    category: "house",
  },
  {
    title: "Featured 2",
    location: "Location 2",
    price: "$200",
    rating: 3,
    image: images.japan,
    category: "flat",
  },
];

export const categories = [
  { title: "All", category: "All" },
  { title: "Houses", category: "House" },
  { title: "Condos", category: "Condos" },
  { title: "Duplexes", category: "Duplexes" },
  { title: "Studios", category: "Studios" },
  { title: "Villas", category: "Villa" },
  { title: "Apartments", category: "Apartments" },
  { title: "Townhomes", category: "Townhomes" },
  { title: "Others", category: "Others" },
];

export const settings = [
  {
    title: "My Bookings",
    icon: icons.calendar,
  },
  {
    title: "Profile",
    icon: icons.person,
  },
  {
    title: "Favourites",
    icon: icons.like,
  },
  {
    title: "Chats",
    icon: icons.message,
  },
  {
    title: "Help Center",
    icon: icons.info,
  },
];

export const facilities = [
  {
    title: "Laundry",
    icon: icons.laundry,
  },
  {
    title: "Car Parking",
    icon: icons.carPark,
  },
  {
    title: "Sports Center",
    icon: icons.run,
  },
  {
    title: "Cutlery",
    icon: icons.cutlery,
  },
  {
    title: "Gym",
    icon: icons.dumbell,
  },
  {
    title: "Swimming pool",
    icon: icons.swim,
  },
  {
    title: "Wifi",
    icon: icons.wifi,
  },
  {
    title: "Pet Center",
    icon: icons.dog,
  },
];

export const gallery = [
  {
    id: 1,
    image: images.newYork,
  },
  {
    id: 2,
    image: images.japan,
  },
  {
    id: 3,
    image: images.newYork,
  },
  {
    id: 4,
    image: images.japan,
  },
  {
    id: 5,
    image: images.newYork,
  },
  {
    id: 6,
    image: images.japan,
  },
];


export const reviews = [
  {
    $id: "1",
    name: "John Smith",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    review: "This property was absolutely fantastic! Great location and amenities.",
    $createdAt: "2024-05-15T10:30:00.000Z",
    likes: 120
  },
  {
    $id: "2",
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    review: "Loved the modern design and friendly staff. Would definitely stay here again!",
    $createdAt: "2024-05-10T14:45:00.000Z",
    likes: 95
  },
  {
    $id: "3",
    name: "Michael Brown",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    review: "The view from the apartment was breathtaking. Highly recommended!",
    $createdAt: "2024-04-28T09:15:00.000Z",
    likes: 78
  },
  {
    $id: "4",
    name: "Emily Davis",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    review: "Clean, comfortable, and great value for money. Perfect for our family vacation.",
    $createdAt: "2024-04-20T16:20:00.000Z",
    likes: 112
  },
  {
    $id: "5",
    name: "David Wilson",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    review: "Excellent service and beautiful interior design. Will be coming back next year!",
    $createdAt: "2024-04-15T11:10:00.000Z",
    likes: 64
  },
  {
    $id: "6",
    name: "Jessica Taylor",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    review: "The location couldn't be better - right in the heart of the city with amazing restaurants nearby.",
    $createdAt: "2024-04-05T13:25:00.000Z",
    likes: 87
  }
];
