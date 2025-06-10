import React from "react";
import { 
  Home, 
  Gamepad2, 
  Gift, 
  User, 
  ExternalLink,
  Linkedin,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  Crown,
  Shield,
  HelpCircle,
  Phone,
  Mail
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Footer: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isAuthenticated);
  const location = useLocation();

  // Define footer menu items by category
  const footerCategories = [
    {
      title: "Casino",
      links: [
        { label: "Casino Games", url: "/games" },
        { label: "Slots", url: "/games" },
        { label: "Live Casino", url: "/games" },
        { label: "Roulette", url: "/games" },
        { label: "Blackjack", url: "/games" },
        { label: "Poker", url: "/games" },
        { label: "Promos & Competitions", url: "/promotions" }
      ]
    },
    {
      title: "Sports",
      links: [
        { label: "Sportsbook", url: "/games" },
        { label: "Live Sports", url: "/games" },
        { label: "Soccer", url: "/games" },
        { label: "Basketball", url: "/games" },
        { label: "Tennis", url: "/games" },
        { label: "eSports", url: "/games" },
        { label: "Bet Bonuses", url: "/games" },
        { label: "Sports Rules", url: "/games" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", url: "/support", external: true },
        { label: "Gambling Helpline", url: "/support", external: true },
        { label: "Live Support", url: "/support" },
      ]
    },
    {
      title: "Contact",
      links: [
        { label: "Email Support", url: "mailto:support@rollix777.com", icon: <Mail className="w-4 h-4" /> },
        { label: "24/7 Support", url: "tel:+1234567890", icon: <Phone className="w-4 h-4" /> },
        { label: "FAQ", url: "/support", icon: <HelpCircle className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Footer */}
      <footer className="md:hidden fixed bottom-0 w-full max-w-[430px] bg-[#0F0F19]/90 backdrop-blur-lg border-t border-gray-800 z-30">
        <nav className="flex justify-around py-3 px-4">
          <Link to="/" className="flex flex-col items-center gap-1">
            <Home className={`w-6 h-6 ${location.pathname === "/" ? "text-purple-500" : "text-gray-400"}`} />
            <span className={`text-xs ${location.pathname === "/" ? "text-purple-500" : "text-gray-400"}`}>Home</span>
          </Link>
          <Link to="/games" className="flex flex-col items-center gap-1">
            <Gamepad2 className={`w-6 h-6 ${location.pathname === "/games" ? "text-purple-500" : "text-gray-400"}`} />
            <span className={`text-xs ${location.pathname === "/games" ? "text-purple-500" : "text-gray-400"}`}>Games</span>
          </Link>
          <Link to="/promotions" className="flex flex-col items-center gap-1">
            <Gift className={`w-6 h-6 ${location.pathname === "/promotions" ? "text-purple-500" : "text-gray-400"}`} />
            <span className={`text-xs ${location.pathname === "/promotions" ? "text-purple-500" : "text-gray-400"}`}>Promotions</span>
          </Link>
          <Link to="/account" className="flex flex-col items-center gap-1">
            <User className={`w-6 h-6 ${location.pathname === "/account" ? "text-purple-500" : "text-gray-400"}`} />
            <span className={`text-xs ${location.pathname === "/account" ? "text-purple-500" : "text-gray-400"}`}>
              {isLoggedIn ? "Account" : "Login"}
            </span>
          </Link>
        </nav>
      </footer>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-gradient-to-b from-[#0F0F19] to-[#0A0A12] text-gray-300 border-t border-gray-800/30">
        {/* Top section with logo and social icons */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Rollix777
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="p-2 rounded-lg bg-[#1A1A2E] hover:bg-purple-500/20 transition-colors">
                  <Facebook className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-[#1A1A2E] hover:bg-purple-500/20 transition-colors">
                  <Twitter className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-[#1A1A2E] hover:bg-purple-500/20 transition-colors">
                  <Instagram className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-[#1A1A2E] hover:bg-purple-500/20 transition-colors">
                  <Youtube className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Secure Gaming</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Crown className="w-4 h-4" />
                <span>Licensed & Regulated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer links section */}
        <div className="container mx-auto px-6 py-8 border-t border-gray-800/30">
          <div className="grid grid-cols-4 gap-8">
            {footerCategories.map((category, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-4 text-lg">{category.title}</h3>
                <ul className="space-y-3">
                  {category.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.external ? (
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-purple-400 text-sm flex items-center gap-2 transition-colors"
                        >
                          {link.icon}
                          {link.label}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link 
                          to={link.url} 
                          className="text-gray-400 hover:text-purple-400 text-sm flex items-center gap-2 transition-colors"
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section with language, currency selectors and copyright */}
        <div className="container mx-auto px-6 py-6 border-t border-gray-800/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="w-40">
                <select className="w-full bg-[#1A1A2E] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-800">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div className="w-40">
                <select className="w-full bg-[#1A1A2E] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-800">
                  <option>Decimal</option>
                  <option>Fractional</option>
                  <option>American</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 Rollix777 | All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
