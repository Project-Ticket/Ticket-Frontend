"use client";

import Header from "@/components/header";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  Gift,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "Rock Festival 2025",
      subtitle: "The Biggest Music Event of the Year",
      description:
        "Join thousands of music lovers for an unforgettable night with international and local artists",
      image:
        "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "Get Tickets Now",
      price: "From Rp 350,000",
      badge: "Limited Time",
    },
    {
      id: 2,
      title: "Tech Summit Indonesia",
      subtitle: "Innovation Meets Technology",
      description:
        "Learn from industry leaders and discover the latest technological innovations",
      image:
        "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "Register Now",
      price: "From Rp 500,000",
      badge: "Early Bird",
    },
    {
      id: 3,
      title: "Exclusive Merchandise",
      subtitle: "Official EventHub Collection",
      description:
        "Shop premium quality merchandise from your favorite events and artists",
      image:
        "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "Shop Now",
      price: "Starting Rp 75,000",
      badge: "New Collection",
    },
    {
      id: 4,
      title: "Basketball Championship",
      subtitle: "Finals Week Special",
      description:
        "Witness the most exciting basketball championship final with premium seating",
      image:
        "https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "Book Seats",
      price: "From Rp 200,000",
      badge: "Hot Deal",
    },
  ];

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
  ];

  const stats = [
    { icon: Ticket, label: "Events Hosted", value: "2,500+" },
    { icon: Users, label: "Happy Customers", value: "50,000+" },
    { icon: Gift, label: "Merchandise Sold", value: "15,000+" },
    { icon: TrendingUp, label: "Years Experience", value: "5+" },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getBadgeColor = (badge: string) => {
    const colors: { [key: string]: string } = {
      "Limited Time": "bg-red-500",
      "Early Bird": "bg-blue-500",
      "New Collection": "bg-green-500",
      "Hot Deal": "bg-orange-500",
    };
    return colors[badge] || "bg-yellow-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="relative h-[95vh] overflow-hidden">
        {/* Slides */}
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                index === currentSlide
                  ? "translate-x-0"
                  : index < currentSlide
                  ? "-translate-x-full"
                  : "translate-x-full"
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-3xl">
                    {/* Badge */}
                    <div className="mb-4">
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-white text-sm font-semibold ${getBadgeColor(
                          slide.badge
                        )}`}
                      >
                        {slide.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <h2 className="text-xl md:text-2xl lg:text-3xl text-yellow-400 font-semibold mb-6">
                      {slide.subtitle}
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                      {slide.description}
                    </p>

                    {/* Price and CTA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-2xl md:text-3xl font-bold text-yellow-400">
                        {slide.price}
                      </div>
                      <button className="bg-red-800 hover:bg-red-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                        {slide.cta}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-8 right-8 bg-black/30 text-white px-4 py-2 rounded-full backdrop-blur-sm">
          <span className="text-sm font-medium">
            {currentSlide + 1} / {heroSlides.length}
          </span>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-red-800" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these amazing upcoming events
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Something Amazing?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their
            entertainment needs
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-lg">
            Start Exploring
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
