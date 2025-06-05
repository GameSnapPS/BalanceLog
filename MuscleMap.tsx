import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Trophy, Target, Hand } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MuscleMapSVG from "@/components/MuscleMapSVG";
import type { UserMuscleRating } from "@shared/schema";

interface MuscleData {
  name: string;
  rating: number;
  exercises: string[];
}

const defaultMuscleData: Record<string, MuscleData> = {
  chest: { name: 'Chest', rating: 78, exercises: ['Push-ups', 'Chest Dips', 'Pike Push-ups'] },
  arms: { name: 'Arms', rating: 55, exercises: ['Tricep Dips', 'Arm Circles', 'Diamond Push-ups'] },
  core: { name: 'Core', rating: 82, exercises: ['Plank', 'Mountain Climbers', 'Russian Twists'] },
  legs: { name: 'Legs', rating: 89, exercises: ['Squats', 'Lunges', 'Calf Raises'] },
  back: { name: 'Back', rating: 67, exercises: ['Pull-ups', 'Superman', 'Reverse Flys'] },
  shoulders: { name: 'Shoulders', rating: 71, exercises: ['Pike Push-ups', 'Handstand Hold', 'Shoulder Circles'] },
};

export default function MuscleMap() {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: muscleRatings = [] } = useQuery({
    queryKey: ["/api/muscle-ratings"],
  });

  const updateRatingMutation = useMutation({
    mutationFn: async ({ muscleGroup, rating }: { muscleGroup: string; rating: number }) => {
      await apiRequest("PUT", "/api/muscle-ratings", { muscleGroup, rating });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/muscle-ratings"] });
      toast({
        title: "Success",
        description: "Muscle rating updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update muscle rating",
        variant: "destructive",
      });
    },
  });

  const getMuscleRating = (muscleGroup: string): number => {
    const rating = muscleRatings.find((r: UserMuscleRating) => r.muscleGroup === muscleGroup);
    return rating?.rating || defaultMuscleData[muscleGroup]?.rating || 50;
  };

  const handleMuscleClick = (muscleGroup: string) => {
    setSelectedMuscle(muscleGroup);
  };

  const handleRatingUpdate = (muscleGroup: string, newRating: number) => {
    updateRatingMutation.mutate({ muscleGroup, rating: newRating });
  };

  const calculateAverageStrength = () => {
    const muscles = Object.keys(defaultMuscleData);
    const total = muscles.reduce((sum, muscle) => sum + getMuscleRating(muscle), 0);
    return Math.round(total / muscles.length);
  };

  const getStrongestMuscle = () => {
    const muscles = Object.keys(defaultMuscleData);
    let strongest = muscles[0];
    let highestRating = getMuscleRating(strongest);

    muscles.forEach(muscle => {
      const rating = getMuscleRating(muscle);
      if (rating > highestRating) {
        highestRating = rating;
        strongest = muscle;
      }
    });

    return { muscle: defaultMuscleData[strongest].name, rating: highestRating };
  };

  const getWeakestMuscle = () => {
    const muscles = Object.keys(defaultMuscleData);
    let weakest = muscles[0];
    let lowestRating = getMuscleRating(weakest);

    muscles.forEach(muscle => {
      const rating = getMuscleRating(muscle);
      if (rating < lowestRating) {
        lowestRating = rating;
        weakest = muscle;
      }
    });

    return { muscle: defaultMuscleData[weakest].name, rating: lowestRating };
  };

  const selectedMuscleData = selectedMuscle ? {
    ...defaultMuscleData[selectedMuscle],
    rating: getMuscleRating(selectedMuscle)
  } : null;

  const averageStrength = calculateAverageStrength();
  const strongestMuscle = getStrongestMuscle();
  const weakestMuscle = getWeakestMuscle();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Muscle Strength Map</h1>
        <p className="text-xl text-gray-600">Click on muscle groups to view your strength ratings and progress</p>
      </div>

      <Card className="p-8 mb-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Muscle Map */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Interactive Body Map</h3>
            <MuscleMapSVG 
              onMuscleClick={handleMuscleClick}
              getMuscleRating={getMuscleRating}
            />
            <p className="text-sm text-gray-500 mt-4">Click on highlighted areas to view muscle details</p>
          </div>

          {/* Muscle Details Panel */}
          <div>
            <div id="muscle-details" className="space-y-6">
              {selectedMuscleData ? (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{selectedMuscleData.name}</h3>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Strength Rating</span>
                      <span className="font-bold text-lg">{selectedMuscleData.rating}/100</span>
                    </div>
                    <Progress value={selectedMuscleData.rating} className="h-3" />
                  </div>
                  <div className="mb-6">
                    <h4 className="font-medium mb-2 text-gray-900">Recommended Exercises:</h4>
                    <ul className="space-y-1">
                      {selectedMuscleData.exercises.map(exercise => (
                        <li key={exercise} className="text-gray-600 text-sm">• {exercise}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-primary hover:bg-blue-700"
                      onClick={() => handleRatingUpdate(selectedMuscle!, Math.min(100, selectedMuscleData.rating + 5))}
                      disabled={updateRatingMutation.isPending}
                    >
                      Mark Progress (+5)
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleRatingUpdate(selectedMuscle!, Math.max(0, selectedMuscleData.rating - 5))}
                        disabled={updateRatingMutation.isPending}
                      >
                        Decrease (-5)
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setSelectedMuscle(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Hand className="text-4xl mb-4 mx-auto" />
                  <p className="text-lg">Select a muscle group to view your strength rating and recommended exercises</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overall Progress Summary */}
        <div className="mt-12 border-t pt-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Overall Progress Summary</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="gradient-bg text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Average Strength</p>
                    <p className="text-3xl font-bold">{averageStrength}/100</p>
                  </div>
                  <TrendingUp className="text-3xl opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="success-bg text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Strongest Area</p>
                    <p className="text-xl font-bold">{strongestMuscle.muscle} ({strongestMuscle.rating}/100)</p>
                  </div>
                  <Trophy className="text-3xl opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="accent-bg text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">Focus Area</p>
                    <p className="text-xl font-bold">{weakestMuscle.muscle} ({weakestMuscle.rating}/100)</p>
                  </div>
                  <Target className="text-3xl opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
