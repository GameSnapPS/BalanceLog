import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  age: integer("age"),
  height: integer("height"), // in cm
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
  fitnessGoal: varchar("fitness_goal", { enum: ["weight-loss", "muscle-gain", "maintenance"] }).default("maintenance"),
  activityLevel: varchar("activity_level", { enum: ["sedentary", "lightly-active", "moderately-active", "very-active", "extremely-active"] }).default("moderately-active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  difficulty: varchar("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  muscleGroups: text("muscle_groups").array().notNull(),
  instructions: text("instructions").array().notNull(),
  caloriesBurnedPerRep: integer("calories_burned_per_rep").default(1),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userMuscleRatings = pgTable("user_muscle_ratings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  muscleGroup: varchar("muscle_group", { length: 100 }).notNull(),
  rating: integer("rating").notNull().default(50), // 0-100
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const workoutRoutines = pgTable("workout_routines", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  exercises: jsonb("exercises").notNull(), // Array of exercise objects with sets/reps
  difficulty: varchar("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  duration: integer("duration"), // in minutes
  isPersonalized: boolean("is_personalized").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").defaultNow(),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  muscleRatings: jsonb("muscle_ratings"), // Snapshot of muscle ratings
  workoutCompleted: boolean("workout_completed").default(false),
  caloriesConsumed: integer("calories_consumed"),
  notes: text("notes"),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;
export type UserMuscleRating = typeof userMuscleRatings.$inferSelect;
export type InsertUserMuscleRating = typeof userMuscleRatings.$inferInsert;
export type WorkoutRoutine = typeof workoutRoutines.$inferSelect;
export type InsertWorkoutRoutine = typeof workoutRoutines.$inferInsert;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

export const insertUserSchema = createInsertSchema(users).pick({
  age: true,
  height: true,
  weight: true,
  fitnessGoal: true,
  activityLevel: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  createdAt: true,
});

export const insertMuscleRatingSchema = createInsertSchema(userMuscleRatings).omit({
  id: true,
  lastUpdated: true,
});

export const insertWorkoutRoutineSchema = createInsertSchema(workoutRoutines).omit({
  id: true,
  createdAt: true,
});
