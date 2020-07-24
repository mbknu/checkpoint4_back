const express = require("express");
const router = express.Router();
const connection = require("../config");

// Get all the todo
router.get("/", (req, res) => {
  let sql = "SELECT * FROM todo";

  connection.query(sql, (err, results) => {
    if (err) {
      res
        .status(500)
        .send(err, "Erreur lors de la récupération d'une anecdote");
    } else {
      res.json(results);
    }
  });
});

// Delete one todo
router.delete("/:id", (req, res) => {
  let sql = "DELETE FROM todo WHERE id = ?";
  const idParams = req.params.id;

  connection.query(sql, idParams, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
