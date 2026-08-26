import { pgTable, uuid, text, integer, real, jsonb, timestamp, index } from "drizzle-orm/pg-core";

export const villageAnalyses = pgTable(
  "village_analyses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    villageName: text("village_name").notNull(),
    district: text("district").notNull(), // kecamatan
    city: text("city").notNull(), // kabupaten/kota
    province: text("province").notNull(), // provinsi
    population: integer("population"),
    areaHa: real("area_ha"),
    contactEmail: text("contact_email"),
    formData: jsonb("form_data").notNull(),
    status: text("status").notNull().default("processing"), // processing | completed | failed
    readinessScore: integer("readiness_score"),
    category: text("category"),
    report: jsonb("report"),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("va_created_at_idx").on(t.createdAt)]
);

export const analysisPhotos = pgTable(
  "analysis_photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    analysisId: uuid("analysis_id")
      .notNull()
      .references(() => villageAnalyses.id, { onDelete: "cascade" }),
    filePath: text("file_path").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    sizeKb: integer("size_kb").notNull(),
    brightness: real("brightness").notNull(),
    colorfulness: real("colorfulness").notNull(),
    greenness: real("greenness").notNull(),
    blueness: real("blueness").notNull(),
    quality: real("quality").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("ap_analysis_idx").on(t.analysisId)]
);

export type VillageAnalysisRow = typeof villageAnalyses.$inferSelect;
export type AnalysisPhotoRow = typeof analysisPhotos.$inferSelect;
