import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Repeat, Flame, Filter } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import type { Exercise } from "@shared/schema";

export default function Exercises() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ["/api/exercises", selectedCategory !== "all" ? `?category=${selectedCategory}` : ""],
  });

  const categories = [
    { id: "all", name: "All Exercises" },
    { id: "chest", name: "Chest" },
    { id: "back", name: "Back" },
    { id: "legs", name: "Legs" },
    { id: "core", name: "Core" },
    { id: "cardio", name: "Cardio" },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-yellow-500";
      case "advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Exercise Library</h1>
        <p className="text-xl text-gray-600">Discover hundreds of bodyweight exercises for every muscle group</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`${
              selectedCategory === category.id 
                ? "filter-btn active" 
                : "filter-btn"
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {exercises.map((exercise: Exercise) => (
          <Card key={exercise.id} className="exercise-card overflow-hidden">
            <img 
              src={exercise.imageUrl || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"} 
              alt={`${exercise.name} demonstration`} 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{exercise.name}</h3>
                <Badge className={`${getDifficultyColor(exercise.difficulty)} text-white`}>
                  {exercise.difficulty}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{exercise.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> 3 sets
                </span>
                <span className="flex items-center">
                  <Repeat className="w-4 h-4 mr-1" /> 8-12 reps
                </span>
                <span className="flex items-center">
                  <Flame className="w-4 h-4 mr-1" /> {exercise.caloriesBurnedPerRep || 1} cal/rep
                </span>
              </div>
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {exercise.muscleGroups.slice(0, 3).map((muscle) => (
                    <Badge key={muscle} variant="secondary" className="text-xs">
                      {muscle}
                    </Badge>
                  ))}
                  {exercise.muscleGroups.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{exercise.muscleGroups.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-blue-700">
                View Instructions
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Personalized Routine Section */}
      <Card className="bg-white shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Personalized Routine</h2>
          <Button className="accent-bg hover:bg-red-600 text-white">
            Generate New Routine
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Monday - Upper Body</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span>Push-ups</span>
                <span className="text-sm">3x12</span>
              </li>
              <li className="flex justify-between">
                <span>Pike Push-ups</span>
                <span className="text-sm">3x8</span>
              </li>
              <li className="flex justify-between">
                <span>Tricep Dips</span>
                <span className="text-sm">3x10</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Wednesday - Lower Body</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span>Squats</span>
                <span className="text-sm">3x15</span>
              </li>
              <li className="flex justify-between">
                <span>Lunges</span>
                <span className="text-sm">3x12</span>
              </li>
              <li className="flex justify-between">
                <span>Calf Raises</span>
                <span className="text-sm">3x20</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Friday - Full Body</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span>Burpees</span>
                <span className="text-sm">3x8</span>
              </li>
              <li className="flex justify-between">
                <span>Mountain Climbers</span>
                <span className="text-sm">3x30s</span>
              </li>
              <li className="flex justify-between">
                <span>Plank</span>
                <span className="text-sm">3x45s</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
