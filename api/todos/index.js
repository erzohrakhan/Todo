const { getPool } = require("../db");

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const pool = await getPool();

  try {
    if (req.method === "GET") {
      const result = await pool.query("SELECT * FROM todo ORDER BY todo_id DESC");
      return res.status(200).json(result.rows);
    }

    if (req.method === "POST") {
      const { description } = req.body;
      const result = await pool.query(
        "INSERT INTO todo (description) VALUES ($1) RETURNING *",
        [description]
      );
      return res.status(201).json(result.rows[0]);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
