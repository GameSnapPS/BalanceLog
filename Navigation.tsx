import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Dumbbell, Home, Target, Apple, Menu, X } from "lucide-react";
import balanceLogLogo from "@assets/unnamed_1749119743752.png";

export default function Navigation() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/exercises", label: "Exercises", icon: Dumbbell },
    { path: "/muscle-map", label: "Muscle Map", icon: Target },
    { path: "/nutrition", label: "Nutrition", icon: Apple },
  ];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src={balanceLogLogo} 
              alt="Balance Log" 
              className="h-8 w-auto mr-3" 
              style={{ filter: 'brightness(0) saturate(100%)' }}
            />
            <h1 className="text-2xl font-bold text-gray-900">Balance Log</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <button
                  className={`nav-item text-gray-500 hover:text-primary px-3 py-2 font-medium transition-colors ${
                    location === item.path ? "active" : ""
                  }`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={(user as any)?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-gray-700 font-medium">
                {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'User'}
              </span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <button
                      className={`flex items-center px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                        location === item.path
                          ? "text-primary bg-blue-50"
                          : "text-gray-500 hover:text-primary hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="mr-3" size={20} />
                      {item.label}
                    </button>
                  </Link>
                );
              })}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center px-3 py-2 mb-2">
                  <img
                    src={(user as any)?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                  <span className="text-gray-700 font-medium">
                    {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="mx-3 w-[calc(100%-1.5rem)]"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
