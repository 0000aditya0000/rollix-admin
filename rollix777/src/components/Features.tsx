import React from 'react';
import { Trophy, Users, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: <Trophy className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />,
    title: "Competitive Gaming",
    description: "Join tournaments and win prizes"
  },
  {
    icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />,
    title: "Multiplayer",
    description: "Play with friends worldwide"
  },
  {
    icon: <Zap className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />,
    title: "Fast Performance",
    description: "Smooth gameplay experience"
  },
  {
    icon: <Shield className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />,
    title: "Secure Platform",
    description: "Safe and protected gaming"
  }
];

const Features = () => {
  return (
    <>
      {/* Mobile View */}
      <section className="md:hidden py-12 px-4 bg-gray-900">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Why Choose Rollix777
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800 rounded-xl border border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop View */}
      <section className="hidden md:block py-16 px-6 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Why Choose Rollix777
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:bg-gray-800/80"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-purple-600/20 rounded-2xl mb-6 group-hover:bg-purple-600/30 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
                {/* Decorative gradient line */}
                <div className="mt-6 h-1 w-full bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;