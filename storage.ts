import {
  users,
  exercises,
  userMuscleRatings,
  workoutRoutines,
  userProgress,
  type User,
  type UpsertUser,
  type Exercise,
  type InsertExercise,
  type UserMuscleRating,
  type InsertUserMuscleRating,
  type WorkoutRoutine,
  type InsertWorkoutRoutine,
  type UserProgress,
  type InsertUserProgress,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, profile: Partial<UpsertUser>): Promise<User>;
  
  // Exercise operations
  getExercises(): Promise<Exercise[]>;
  getExercisesByCategory(category: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // Muscle rating operations
  getUserMuscleRatings(userId: string): Promise<UserMuscleRating[]>;
  updateMuscleRating(rating: InsertUserMuscleRating): Promise<UserMuscleRating>;
  
  // Workout routine operations
  getUserWorkoutRoutines(userId: string): Promise<WorkoutRoutine[]>;
  createWorkoutRoutine(routine: InsertWorkoutRoutine): Promise<WorkoutRoutine>;
  
  // Progress tracking
  getUserProgress(userId: string, limit?: number): Promise<UserProgress[]>;
  addProgressEntry(progress: InsertUserProgress): Promise<UserProgress>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, profile: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Exercise operations
  async getExercises(): Promise<Exercise[]> {
    return await db.select().from(exercises);
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return await db.select().from(exercises).where(eq(exercises.category, category));
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db.insert(exercises).values(exercise).returning();
    return newExercise;
  }

  // Muscle rating operations
  async getUserMuscleRatings(userId: string): Promise<UserMuscleRating[]> {
    return await db
      .select()
      .from(userMuscleRatings)
      .where(eq(userMuscleRatings.userId, userId));
  }

  async updateMuscleRating(rating: InsertUserMuscleRating): Promise<UserMuscleRating> {
    const [existingRating] = await db
      .select()
      .from(userMuscleRatings)
      .where(
        and(
          eq(userMuscleRatings.userId, rating.userId),
          eq(userMuscleRatings.muscleGroup, rating.muscleGroup)
        )
      );

    if (existingRating) {
      const [updatedRating] = await db
        .update(userMuscleRatings)
        .set({ rating: rating.rating, lastUpdated: new Date() })
        .where(eq(userMuscleRatings.id, existingRating.id))
        .returning();
      return updatedRating;
    } else {
      const [newRating] = await db
        .insert(userMuscleRatings)
        .values(rating)
        .returning();
      return newRating;
    }
  }

  // Workout routine operations
  async getUserWorkoutRoutines(userId: string): Promise<WorkoutRoutine[]> {
    return await db
      .select()
      .from(workoutRoutines)
      .where(eq(workoutRoutines.userId, userId))
      .orderBy(desc(workoutRoutines.createdAt));
  }

  async createWorkoutRoutine(routine: InsertWorkoutRoutine): Promise<WorkoutRoutine> {
    const [newRoutine] = await db.insert(workoutRoutines).values(routine).returning();
    return newRoutine;
  }

  // Progress tracking
  async getUserProgress(userId: string, limit = 30): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.date))
      .limit(limit);
  }

  async addProgressEntry(progress: InsertUserProgress): Promise<UserProgress> {
    const [newProgress] = await db.insert(userProgress).values(progress).returning();
    return newProgress;
  }
}

export const storage = new DatabaseStorage();
