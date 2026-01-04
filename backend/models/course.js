const { getDb, saveDatabase } = require('../config/database');

// Helper to convert row to object
const rowToObject = (result) => {
  if (!result || result.length === 0 || result[0].values.length === 0) return null;
  const row = result[0].values[0];
  const columns = result[0].columns;
  const obj = {};
  columns.forEach((col, idx) => obj[col] = row[idx]);
  return obj;
};

// Helper to convert all rows to objects
const rowsToObjects = (result) => {
  if (!result || result.length === 0) return [];
  const columns = result[0].columns;
  return result[0].values.map(row => {
    const obj = {};
    columns.forEach((col, idx) => obj[col] = row[idx]);
    return obj;
  });
};

const Course = {
  // Create a new course
  create: (data) => {
    const { name, description, instructor, duration } = data;
    const db = getDb();
    db.run(`INSERT INTO courses (name, description, instructor, duration) VALUES (?, ?, ?, ?)`,
      [name, description || null, instructor, duration || null]);
    const result = db.exec('SELECT last_insert_rowid() as id');
    const id = result[0].values[0][0];
    saveDatabase();
    return Course.findById(id);
  },

  // Get all courses
  findAll: () => {
    const db = getDb();
    const result = db.exec('SELECT * FROM courses ORDER BY created_at DESC');
    return rowsToObjects(result);
  },

  // Find course by ID
  findById: (id) => {
    const db = getDb();
    const result = db.exec('SELECT * FROM courses WHERE id = ?', [id]);
    return rowToObject(result);
  },

  // Update a course
  update: (id, data) => {
    const { name, description, instructor, duration } = data;
    const db = getDb();
    db.run(`
      UPDATE courses 
      SET name = ?, description = ?, instructor = ?, duration = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description || null, instructor, duration || null, id]);
    saveDatabase();
    return Course.findById(id);
  },

  // Delete a course
  delete: (id) => {
    const db = getDb();
    db.run('DELETE FROM courses WHERE id = ?', [id]);
    saveDatabase();
    return true;
  },

  // Check if course exists
  exists: (id) => {
    const db = getDb();
    const result = db.exec('SELECT COUNT(*) as count FROM courses WHERE id = ?', [id]);
    return result[0].values[0][0] > 0;
  }
};

module.exports = Course;
