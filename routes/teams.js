const express = require("express");
const router = express.Router();
const connection = require("../config");

// Get all the facts
router.get("/", (req, res) => {
  let sql = "SELECT * FROM team";

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
  let sql = "SELECT * FROM team WHERE id = ?";
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
//Get team with id
router.get("/:idUser/:idTeam", (req, res) => {
  const idUser = req.params.idUser;
  const idTeam = req.params.idTeam;
  let sql =
    "SELECT * FROM user_has_team AS uht JOIN user AS u ON uht.user_id = u.id JOIN team as t ON uht.team_id = t.id WHERE u.id = ? AND t.id = ?";

  connection.query(sql, [idUser, idTeam], (err, results) => {
    if (err) {
      console.log(err);
      res.status(404).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

module.exports = router;
