import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertUserSchema, insertMuscleRatingSchema, insertWorkoutRoutineSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile routes
  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertUserSchema.parse(req.body);
      const updatedUser = await storage.updateUserProfile(userId, profileData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  // Exercise routes
  app.get('/api/exercises', async (req, res) => {
    try {
      const category = req.query.category as string;
      const exercises = category 
        ? await storage.getExercisesByCategory(category)
        : await storage.getExercises();
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  // Muscle rating routes
  app.get('/api/muscle-ratings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ratings = await storage.getUserMuscleRatings(userId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching muscle ratings:", error);
      res.status(500).json({ message: "Failed to fetch muscle ratings" });
    }
  });

  app.put('/api/muscle-ratings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ratingData = insertMuscleRatingSchema.parse({
        ...req.body,
        userId,
      });
      const updatedRating = await storage.updateMuscleRating(ratingData);
      res.json(updatedRating);
    } catch (error) {
      console.error("Error updating muscle rating:", error);
      res.status(400).json({ message: "Failed to update muscle rating" });
    }
  });

  // Workout routine routes
  app.get('/api/workout-routines', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const routines = await storage.getUserWorkoutRoutines(userId);
      res.json(routines);
    } catch (error) {
      console.error("Error fetching workout routines:", error);
      res.status(500).json({ message: "Failed to fetch workout routines" });
    }
  });

  app.post('/api/workout-routines', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const routineData = insertWorkoutRoutineSchema.parse({
        ...req.body,
        userId,
      });
      const newRoutine = await storage.createWorkoutRoutine(routineData);
      res.json(newRoutine);
    } catch (error) {
      console.error("Error creating workout routine:", error);
      res.status(400).json({ message: "Failed to create workout routine" });
    }
  });

  // Nutrition calculation route
  app.post('/api/nutrition/calculate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.age || !user.height || !user.weight) {
        return res.status(400).json({ message: "Complete user profile required for nutrition calculations" });
      }

      const { age, height, weight, fitnessGoal, activityLevel } = user;
      
      // Calculate BMR using Mifflin-St Jeor Equation (assuming male for simplicity)
      const bmr = 10 * parseFloat(weight.toString()) + 6.25 * height - 5 * age + 5;
      
      // Activity level multipliers
      const activityMultipliers = {
        'sedentary': 1.2,
        'lightly-active': 1.375,
        'moderately-active': 1.55,
        'very-active': 1.725,
        'extremely-active': 1.9
      };
      
      const multiplier = activityLevel ? activityMultipliers[activityLevel] : 1.55;
      const tdee = bmr * multiplier;
      
      // Adjust calories based on goal
      let targetCalories = tdee;
      if (fitnessGoal === 'weight-loss') {
        targetCalories = tdee - 500; // 500 calorie deficit
      } else if (fitnessGoal === 'muscle-gain') {
        targetCalories = tdee + 300; // 300 calorie surplus
      }
      
      // Calculate macros (example distribution)
      const proteinCalories = targetCalories * 0.3;
      const carbCalories = targetCalories * 0.4;
      const fatCalories = targetCalories * 0.3;
      
      const nutrition = {
        targetCalories: Math.round(targetCalories),
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        protein: Math.round(proteinCalories / 4), // 4 cal per gram
        carbs: Math.round(carbCalories / 4), // 4 cal per gram
        fat: Math.round(fatCalories / 9), // 9 cal per gram
        water: Math.round(parseFloat(weight.toString()) * 35), // 35ml per kg
      };
      
      res.json(nutrition);
    } catch (error) {
      console.error("Error calculating nutrition:", error);
      res.status(500).json({ message: "Failed to calculate nutrition" });
    }
  });

  // Progress tracking routes
  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Seed exercises route (for development)
  app.post('/api/seed-exercises', async (req, res) => {
    try {
      const exercisesData = [
        {
          name: "Push-ups",
          description: "Classic upper body exercise targeting chest, shoulders, and triceps",
          category: "chest",
          difficulty: "beginner" as const,
          muscleGroups: ["chest", "shoulders", "triceps"],
          instructions: [
            "Start in a plank position with hands slightly wider than shoulders",
            "Lower your body until chest nearly touches the floor",
            "Push back up to starting position",
            "Keep your body straight throughout the movement"
          ],
          caloriesBurnedPerRep: 1,
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
        },
        {
          name: "Bodyweight Squats",
          description: "Fundamental lower body exercise for quads, glutes, and hamstrings",
          category: "legs",
          difficulty: "beginner" as const,
          muscleGroups: ["quadriceps", "glutes", "hamstrings"],
          instructions: [
            "Stand with feet shoulder-width apart",
            "Lower down as if sitting back into a chair",
            "Keep chest up and knees tracking over toes",
            "Rise back to starting position"
          ],
          caloriesBurnedPerRep: 1,
          imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
        },
        {
          name: "Plank Hold",
          description: "Isometric core exercise that strengthens the entire midsection",
          category: "core",
          difficulty: "intermediate" as const,
          muscleGroups: ["core", "shoulders", "glutes"],
          instructions: [
            "Start in a push-up position",
            "Lower to forearms, keeping elbows under shoulders",
            "Hold body straight from head to heels",
            "Engage core and breathe steadily"
          ],
          caloriesBurnedPerRep: 2,
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
        },
        {
          name: "Pull-ups",
          description: "Upper body compound exercise targeting back, biceps, and shoulders",
          category: "back",
          difficulty: "advanced" as const,
          muscleGroups: ["back", "biceps", "shoulders"],
          instructions: [
            "Hang from a pull-up bar with palms facing away",
            "Pull your body up until chin clears the bar",
            "Lower with control to full arm extension",
            "Avoid swinging or kipping"
          ],
          caloriesBurnedPerRep: 3,
          imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
        },
        {
          name: "Forward Lunges",
          description: "Unilateral leg exercise for balance, strength, and coordination",
          category: "legs",
          difficulty: "beginner" as const,
          muscleGroups: ["quadriceps", "glutes", "hamstrings", "calves"],
          instructions: [
            "Stand tall with feet hip-width apart",
            "Step forward with one leg, lowering hips",
            "Lower until both knees are at 90-degree angles",
            "Push back to starting position and repeat"
          ],
          caloriesBurnedPerRep: 1,
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
        },
        {
          name: "Burpees",
          description: "Full-body explosive exercise combining squat, plank, and jump",
          category: "cardio",
          difficulty: "advanced" as const,
          muscleGroups: ["full-body"],
          instructions: [
            "Start standing, then squat down and place hands on floor",
            "Jump feet back into plank position",
            "Do a push-up, then jump feet back to squat",
            "Explosively jump up with arms overhead"
          ],
          caloriesBurnedPerRep: 4,
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
        }
      ];

      const createdExercises = [];
      for (const exerciseData of exercisesData) {
        const exercise = await storage.createExercise(exerciseData);
        createdExercises.push(exercise);
      }

      res.json({ message: "Exercises seeded successfully", exercises: createdExercises });
    } catch (error) {
      console.error("Error seeding exercises:", error);
      res.status(500).json({ message: "Failed to seed exercises" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
