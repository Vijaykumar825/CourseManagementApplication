const { getDb, saveDatabase } = require('../config/database');

const User = {
  // Create a new user
  create: (name, email, hashedPassword) => {
    const db = getDb();
    db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword]);
    const result = db.exec('SELECT last_insert_rowid() as id');
    const id = result[0].values[0][0];
    saveDatabase();
    return { id, name, email };
  },

  // Find user by email
  findByEmail: (email) => {
    const db = getDb();
    const result = db.exec('SELECT * FROM users WHERE email = ?', [email]);
    if (result.length === 0 || result[0].values.length === 0) return null;
    const row = result[0].values[0];
    const columns = result[0].columns;
    const user = {};
    columns.forEach((col, idx) => user[col] = row[idx]);
    return user;
  },

  // Find user by ID
  findById: (id) => {
    const db = getDb();
    const result = db.exec('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);
    if (result.length === 0 || result[0].values.length === 0) return null;
    const row = result[0].values[0];
    const columns = result[0].columns;
    const user = {};
    columns.forEach((col, idx) => user[col] = row[idx]);
    return user;
  },

  // Check if email exists
  emailExists: (email) => {
    const db = getDb();
    const result = db.exec('SELECT COUNT(*) as count FROM users WHERE email = ?', [email]);
    return result[0].values[0][0] > 0;
  }
};

module.exports = User;
