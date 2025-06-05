import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Target } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    fitnessGoal: "maintenance",
    activityLevel: "moderately-active",
  });

  const { toast } = useToast();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("PATCH", "/api/user/profile", {
        age: parseInt(data.age),
        height: parseInt(data.height),
        weight: parseFloat(data.weight),
        fitnessGoal: data.fitnessGoal,
        activityLevel: data.activityLevel,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been set up successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.age || !formData.height || !formData.weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    updateProfileMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-2xl" />
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <p className="text-gray-600">
            Help us create personalized workouts and nutrition plans just for you
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  min="13"
                  max="100"
                  required
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  min="100"
                  max="250"
                  required
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  min="30"
                  max="300"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fitnessGoal">Fitness Goal</Label>
              <Select value={formData.fitnessGoal} onValueChange={(value) => handleInputChange("fitnessGoal", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange("activityLevel", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                  <SelectItem value="lightly-active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderately-active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="very-active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="extremely-active">Extremely Active (very hard exercise, physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center text-primary mb-2">
                <Target className="mr-2" size={20} />
                <span className="font-medium">What happens next?</span>
              </div>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• We'll calculate your daily calorie needs</li>
                <li>• Create personalized workout routines</li>
                <li>• Set up your muscle strength tracking</li>
                <li>• Provide tailored nutrition recommendations</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-blue-700"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Setting up..." : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
