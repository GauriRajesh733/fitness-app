import pool from "../db/db.js";
import fsPromises from "fs/promises";

export async function getExercisesService({
  equipment: allEquipment,
  categories: allCategories,
  muscles: allMuscles,
  limit: exerciseLimit,
}) {
  // EXTRACT DATA

  // get list of equipment
  const equipment = allEquipment?.split(",") || [];

  // get list of categories
  const categories = allCategories?.split(",") || [];

  // get list of muscles
  const muscles = allMuscles?.split(",") || [];

  // get limit for number of exercises
  const limit = parseInt(exerciseLimit) || 50;

  console.log("service equipment: ", equipment);
  console.log("service categories: ", categories);
  console.log("service muscles: ", muscles);

  // QUERY DB

  let query = "";
  try {
    query += await fsPromises.readFile(
      "src/backend/db/filteredExercises.sql",
      "utf-8"
    );
  } catch (err) {
    console.error("Error reading file", err);
  }

  if (categories.length > 0 || muscles.length > 0 || equipment.length > 0) {
    query += " WHERE ";
    const filters = [];
    let equipment_filter, category_filter, muscle_filter;

    if (equipment.length > 0) {
      equipment_filter = equipment.reduce((accum, one_equipment, index) => {
        if (index != equipment.length - 1) {
          accum += "'" + one_equipment + "'" + ", ";
        } else {
          accum += "'" + one_equipment + "'" + ")";
        }
        return accum;
      }, "(");
      filters.push("eq.name in " + equipment_filter);
    }

    if (categories.length > 0) {
      category_filter = categories.reduce((accum, category, index) => {
        if (index != categories.length - 1) {
          accum += "'" + category + "'" + ", ";
        } else {
          accum += "'" + category + "'" + ")";
        }
        return accum;
      }, "(");
    }

    if (muscles.length > 0) {
      muscle_filter = muscles.reduce((accum, muscle, index) => {
        if (index != muscles.length - 1) {
          accum += "'" + muscle + "'" + ", ";
        } else {
          accum += "'" + muscle + "'" + ")";
        }
        return accum;
      }, "(");
    }

    if (muscles.length > 0 && categories.length > 0) {
      filters.push(
        "(ec.name in " + category_filter + " OR m.name in" + muscle_filter + ")"
      );
    } else if (muscles.length > 0) {
      filters.push("m.name in " + muscle_filter);
    } else if (categories.length > 0) {
      filters.push("ec.name in " + category_filter);
    }

    if (filters.length == 1) {
      query += filters[0];
    }
    if (filters.length > 1) {
      filters.map((filter, index) => {
        if (index != filters.length - 1) {
          query += filter + " AND ";
        } else {
          query += filter;
        }
      });
    }
  }

  query += ` GROUP BY e.id LIMIT ${limit};`;

  // query database
  const result = pool.query(query);
  return (await result).rows;
}

export async function getExerciseByNameService(name) {
  console.log("name: ", name);
  let query = `SELECT * FROM exercises WHERE name = $1`;
  const result = await pool.query(query, [name]);

  if (result.rows.length < 1) {
    return result.rows;
  }
  return result.rows[0];
}

export async function getMusclesService() {
  let query = `SELECT JSON_AGG(name) as muscles FROM muscles`;
  const result = await pool.query(query);

  if (result.rows.length < 1) {
    return [];
  }
  return result.rows[0].muscles;
}

export async function getCategoriesService() {
  let query = `SELECT JSON_AGG(name) as categories FROM exercise_category`;
  const result = await pool.query(query);

  if (result.rows.length < 1) {
    return [];
  }
  return result.rows[0].categories;
}

export async function getEquipmentService() {
  let query = `SELECT JSON_AGG(name) as equipment FROM equipment`;
  const result = await pool.query(query);

  if (result.rows.length < 1) {
    return [];
  }
  return result.rows[0].equipment;
}
