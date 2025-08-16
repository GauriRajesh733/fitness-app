SELECT 
JSON_AGG(DISTINCT JSONB_BUILD_OBJECT ('id', e.id, 'name', e.name, 'description', e.description)) AS exercise,
JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ec.id, 'name', ec.name)) AS category,
JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', m.id,'name', m.name,'image', m.image)) AS muscles,
JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', eq.id,'name', eq.name)) AS equipment
FROM exercises e
JOIN exercise_category ec ON e.category_id = ec.id
JOIN exercise_muscles em ON e.id = em.exercise_id
JOIN muscles m ON em.muscle_id = m.id
JOIN exercise_equipment ee ON e.id = ee.exercise_id
JOIN equipment eq ON ee.equipment_id = eq.id