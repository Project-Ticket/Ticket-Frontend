import { Gift, Ticket, TrendingUp, Users } from "lucide-react";

export default function Stats() {
  const stats = [
    { icon: Ticket, label: "Events Hosted", value: "2,500+" },
    { icon: Users, label: "Happy Customers", value: "50,000+" },
    { icon: Gift, label: "Merchandise Sold", value: "15,000+" },
    { icon: TrendingUp, label: "Years Experience", value: "5+" },
  ];

  return (
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
  );
}
