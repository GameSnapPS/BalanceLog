import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, User, Apple, TrendingUp } from "lucide-react";
import balanceLogLogo from "@assets/unnamed_1749119743752.png";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  const handleViewExercises = () => {
    // For demo purposes, show a message
    alert("Please sign in to access the full exercise library");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
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
            <Button onClick={handleGetStarted} className="bg-primary hover:bg-blue-700">
              Sign In with Gmail
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative gradient-bg text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect<br />
              <span className="text-blue-200">Balance</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Track your fitness journey with personalized bodyweight workouts, 
              muscle strength mapping, and balanced nutrition guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                className="accent-bg hover:bg-red-600 text-white px-8 py-4 text-lg font-semibold h-auto"
              >
                Start Your Journey
              </Button>
              <Button 
                onClick={handleViewExercises}
                variant="outline"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-50 px-8 py-4 text-lg font-semibold h-auto backdrop-blur"
              >
                View Exercises
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Get Fit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform combines exercise science with personalized recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 border-0 bg-gray-50 hover:bg-gray-100 transition-colors">
              <CardContent className="p-0">
                <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Personalized Workouts</h3>
                <p className="text-gray-600">Custom routines based on your fitness level, goals, and available time</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 bg-gray-50 hover:bg-gray-100 transition-colors">
              <CardContent className="p-0">
                <div className="accent-bg text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Muscle Tracking</h3>
                <p className="text-gray-600">Interactive body map to track strength progress across all muscle groups</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 bg-gray-50 hover:bg-gray-100 transition-colors">
              <CardContent className="p-0">
                <div className="success-bg text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Apple className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Nutrition Guide</h3>
                <p className="text-gray-600">Personalized calorie and macro recommendations for your specific goals</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 bg-gray-50 hover:bg-gray-100 transition-colors">
              <CardContent className="p-0">
                <div className="bg-purple-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Progress Analytics</h3>
                <p className="text-gray-600">Detailed insights and statistics to keep you motivated and on track</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Transformation?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of users who have found their perfect balance with Balance Log</p>
          <Button 
            onClick={handleGetStarted}
            className="accent-bg hover:bg-red-600 text-white px-10 py-4 text-lg font-semibold h-auto"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
}
