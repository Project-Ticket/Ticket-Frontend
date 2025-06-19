import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Banner() {
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
    <section className="relative h-[80vh] overflow-hidden">
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
  );
}
