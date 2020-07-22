const express = require("express");
const router = express.Router();
const connection = require("../config");

// Get all the facts
router.get("/", (req, res) => {
  let sql = "SELECT * FROM fact";

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

//Get one fact with ID
router.get("/:id", (req, res) => {
  let sql = "SELECT * FROM fact WHERE id = ?";
  const idFact = req.params.id;

  connection.query(sql, [idFact], (err, results) => {
    if (err) {
      console.log(err);
      res.status(404).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

module.exports = router;
