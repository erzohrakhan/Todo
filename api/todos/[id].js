const { getPool } = require("../db");

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;
  const pool = await getPool();

  try {
    if (req.method === "PUT") {
      const { description, completed } = req.body;
      const result = await pool.query(
        "UPDATE todo SET description = COALESCE($1, description), completed = COALESCE($2, completed) WHERE todo_id = $3 RETURNING *",
        [description, completed, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Todo not found" });
      }
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === "DELETE") {
      const result = await pool.query(
        "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Todo not found" });
      }
      return res.status(200).json({ message: "Todo deleted" });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
