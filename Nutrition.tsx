import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Scale, Target, Droplets, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface NutritionData {
  targetCalories: number;
  bmr: number;
  tdee: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export default function Nutrition() {
  const [selectedGoal, setSelectedGoal] = useState<string>("weight-loss");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: nutritionData, isLoading } = useQuery({
    queryKey: ["/api/nutrition/calculate"],
    queryFn: async () => {
      const res = await apiRequest("POST", "/api/nutrition/calculate", {});
      return await res.json() as NutritionData;
    },
    enabled: !!user?.age && !!user?.height && !!user?.weight,
  });

  const updateGoalMutation = useMutation({
    mutationFn: async (goal: string) => {
      await apiRequest("PATCH", "/api/user/profile", { fitnessGoal: goal });
    },
    onSuccess: () => {
      toast({
        title: "Goal Updated",
        description: "Your fitness goal has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update goal",
        variant: "destructive",
      });
    },
  });

  const handleGoalChange = (goal: string) => {
    setSelectedGoal(goal);
    updateGoalMutation.mutate(goal);
  };

  const goals = [
    {
      id: "weight-loss",
      name: "Weight Loss",
      icon: Scale,
      description: "Lose body fat while maintaining muscle",
    },
    {
      id: "muscle-gain",
      name: "Muscle Gain",
      icon: Dumbbell,
      description: "Build lean muscle mass",
    },
    {
      id: "maintenance",
      name: "Maintenance",
      icon: Target,
      description: "Maintain current weight and fitness",
    },
  ];

  if (!user?.age || !user?.height || !user?.weight) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
          <p className="text-gray-600 mb-6">
            Please complete your profile with age, height, and weight to get personalized nutrition recommendations.
          </p>
          <Button onClick={() => window.location.href = "/"}>
            Complete Profile
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nutrition Guide</h1>
        <p className="text-xl text-gray-600">Personalized nutrition recommendations based on your goals and metrics</p>
      </div>

      {/* Goal Selection */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Your Fitness Goal</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isActive = selectedGoal === goal.id || user.fitnessGoal === goal.id;
            return (
              <Button
                key={goal.id}
                onClick={() => handleGoalChange(goal.id)}
                variant="outline"
                className={`goal-btn p-6 h-auto text-left ${isActive ? "active" : ""}`}
              >
                <div className="text-center w-full">
                  <Icon className={`text-3xl mb-3 mx-auto ${isActive ? "text-primary" : "text-gray-400"}`} />
                  <h3 className="font-semibold text-lg text-gray-900">{goal.name}</h3>
                  <p className="text-gray-600 text-sm mt-2">{goal.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Nutrition Results */}
      {nutritionData && (
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Calorie Breakdown */}
          <Card className="p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Daily Calorie Target</h3>
            
            <Card className="gradient-bg text-white p-6 mb-6">
              <div className="text-center">
                <p className="text-blue-100 text-lg">Total Daily Calories</p>
                <p className="text-4xl font-bold">{nutritionData.targetCalories.toLocaleString()}</p>
                <p className="text-blue-100 text-sm mt-2">Based on your profile and goals</p>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                  <span className="font-medium">Protein</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">{nutritionData.protein}g</span>
                  <span className="text-gray-500 text-sm block">30% ({nutritionData.protein * 4} cal)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="font-medium">Carbohydrates</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">{nutritionData.carbs}g</span>
                  <span className="text-gray-500 text-sm block">40% ({nutritionData.carbs * 4} cal)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-medium">Fats</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">{nutritionData.fat}g</span>
                  <span className="text-gray-500 text-sm block">30% ({nutritionData.fat * 9} cal)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Sample Meal Plan */}
          <Card className="p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Sample Meal Plan</h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-yellow-400 pl-4">
                <h4 className="font-semibold text-gray-900">Breakfast ({Math.round(nutritionData.targetCalories * 0.25)} cal)</h4>
                <p className="text-gray-600 text-sm">2 eggs, oatmeal with berries, Greek yogurt</p>
              </div>

              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-gray-900">Lunch ({Math.round(nutritionData.targetCalories * 0.3)} cal)</h4>
                <p className="text-gray-600 text-sm">Grilled chicken salad, quinoa, mixed vegetables</p>
              </div>

              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-gray-900">Snack ({Math.round(nutritionData.targetCalories * 0.1)} cal)</h4>
                <p className="text-gray-600 text-sm">Apple with almond butter</p>
              </div>

              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-gray-900">Dinner ({Math.round(nutritionData.targetCalories * 0.35)} cal)</h4>
                <p className="text-gray-600 text-sm">Salmon, sweet potato, steamed broccoli</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center text-green-700">
                <CheckCircle className="mr-2" />
                <span className="font-medium">Optimized for your goals</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                This meal plan supports {selectedGoal === "weight-loss" ? "weight loss" : selectedGoal === "muscle-gain" ? "muscle gain" : "maintenance"} 
                {selectedGoal === "weight-loss" ? " while maintaining muscle mass" : ""}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Additional Info */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Hydration Goal</h3>
          <div className="flex items-center justify-center mb-4">
            <Droplets className="text-blue-500 text-4xl mr-4" />
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {nutritionData ? (nutritionData.water / 1000).toFixed(1) : "2.5"}L
              </p>
              <p className="text-gray-600">per day</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 Drink a glass of water before each meal to support digestion and help control portion sizes.
            </p>
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Nutrition Tips</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
              <span className="text-sm">Eat protein with every meal to support muscle recovery</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
              <span className="text-sm">Time carbs around your workouts for optimal energy</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
              <span className="text-sm">Include healthy fats to support hormone production</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
              <span className="text-sm">Eat plenty of vegetables for micronutrients and fiber</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
