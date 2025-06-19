import { Container } from "@radix-ui/themes";
import { Calendar, ChevronRight, MapPin } from "lucide-react";

export default function Featured() {
  const featuredEvents = [
    {
      id: 1,
      title: "Rock Festival 2025",
      date: "March 15, 2025",
      location: "Jakarta Convention Center",
      price: "From Rp 350,000",
      image:
        "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Music",
    },
    {
      id: 2,
      title: "Tech Summit Indonesia",
      date: "April 20, 2025",
      location: "Bali International Convention Centre",
      price: "From Rp 500,000",
      image:
        "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Conference",
    },
    {
      id: 3,
      title: "Food & Culture Expo",
      date: "May 10, 2025",
      location: "Surabaya Expo Center",
      price: "From Rp 150,000",
      image:
        "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Exhibition",
    },
    {
      id: 5,
      title: "Food & Culture Expo",
      date: "May 10, 2025",
      location: "Surabaya Expo Center",
      price: "From Rp 150,000",
      image:
        "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Exhibition",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <Container className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
            Featured Events
          </h2>
          <a
            href="/blog"
            className="text-rose-600 hover:text-rose-700 flex items-center text-sm font-medium transition-colors duration-200"
          >
            Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-red-800 font-bold text-lg">
                    {event.price}
                  </div>
                  <button className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                    Buy Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-red-800 font-bold text-lg">
                    {event.price}
                  </div>
                  <button className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                    Buy Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-red-800 font-bold text-lg">
                    {event.price}
                  </div>
                  <button className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                    Buy Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-red-800 font-bold text-lg">
                    {event.price}
                  </div>
                  <button className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                    Buy Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-red-800 font-bold text-lg">
                    {event.price}
                  </div>
                  <button className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                    Buy Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-red-800 font-bold text-lg">
                    {event.price}
                  </div>
                  <button className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                    Buy Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-red-800 font-bold text-lg">
                    {event.price}
                  </div>
                  <button className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                    Buy Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-red-800 font-bold text-lg">
                    {event.price}
                  </div>
                  <button className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                    Buy Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
