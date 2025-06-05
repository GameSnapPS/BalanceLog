import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Target, TrendingUp, Calendar } from "lucide-react";
import { Link } from "wouter";
import ProfileSetup from "@/components/ProfileSetup";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isProfileComplete = user?.age && user?.height && user?.weight;

  if (!isProfileComplete) {
    return <ProfileSetup />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {(user as any)?.firstName || 'Fitness Enthusiast'}!
        </h1>
        <p className="text-xl text-gray-600">Ready to crush your fitness goals today?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="gradient-bg text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Weekly Workouts</p>
                <p className="text-3xl font-bold">3/5</p>
              </div>
              <Dumbbell className="text-3xl opacity-80" />
            </div>
            <Progress value={60} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="success-bg text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Avg. Strength</p>
                <p className="text-3xl font-bold">72/100</p>
              </div>
              <Target className="text-3xl opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="accent-bg text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Calories Today</p>
                <p className="text-3xl font-bold">1,850</p>
              </div>
              <TrendingUp className="text-3xl opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Streak</p>
                <p className="text-3xl font-bold">12 days</p>
              </div>
              <Calendar className="text-3xl opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Dumbbell className="mr-2 text-primary" />
              Today's Workout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Upper Body Focus</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Push-ups</span>
                    <span>3x12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pike Push-ups</span>
                    <span>3x8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tricep Dips</span>
                    <span>3x10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plank</span>
                    <span>3x45s</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-primary hover:bg-blue-700">
                  Start Workout
                </Button>
                <Link href="/exercises" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Browse Exercises
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 text-success" />
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Chest</span>
                  <span className="text-sm text-gray-500">78/100</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Arms</span>
                  <span className="text-sm text-gray-500">55/100</span>
                </div>
                <Progress value={55} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Core</span>
                  <span className="text-sm text-gray-500">82/100</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Legs</span>
                  <span className="text-sm text-gray-500">89/100</span>
                </div>
                <Progress value={89} className="h-2" />
              </div>
              <div className="pt-2">
                <Link href="/muscle-map">
                  <Button variant="outline" className="w-full">
                    View Muscle Map
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/exercises">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Dumbbell className="mx-auto text-primary text-3xl mb-3" />
              <h3 className="font-semibold text-lg mb-2">Exercise Library</h3>
              <p className="text-gray-600 text-sm">Browse hundreds of bodyweight exercises</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/muscle-map">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Target className="mx-auto text-accent text-3xl mb-3" />
              <h3 className="font-semibold text-lg mb-2">Muscle Map</h3>
              <p className="text-gray-600 text-sm">Track your strength across muscle groups</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/nutrition">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="mx-auto text-success text-3xl mb-3" />
              <h3 className="font-semibold text-lg mb-2">Nutrition Guide</h3>
              <p className="text-gray-600 text-sm">Get personalized nutrition recommendations</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
