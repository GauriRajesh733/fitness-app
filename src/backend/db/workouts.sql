SELECT 
w.id as workout_id, 
JSON_AGG(DISTINCT eq.name) as workout_equipment,
JSON_AGG(DISTINCT c.name) as workout_categories,
w.name as workout_name,
JSON_AGG(DISTINCT 
JSONB_BUILD_OBJECT('exercise_id', we.exercise_id, 'exercise_name', e.name, 'exercise_description',
e.description, 'exercise_sets', we.sets, 'exercise_reps', we.repetitions)) as workout_exercises
FROM
user_workouts uw
JOIN workouts w ON uw.workout_id = w.id
JOIN workout_exercises we ON we.workout_id = w.id
JOIN exercises e ON e.id = we.exercise_id
JOIN exercise_category c ON e.category_id = c.id
JOIN users u ON uw.user_id = u.id
JOIN exercise_equipment ee ON e.id = ee.exercise_id
JOIN equipment eq ON ee.equipment_id = eq.id