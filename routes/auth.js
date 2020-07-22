const router = require("express").Router();
const connection = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Validation
const Joi = require("@hapi/joi");

const schema = Joi.object({
  firstname: Joi.string().min(3).required(),
  lastname: Joi.string().min(3).required(),
  email: Joi.string().min(3).required().email(),
  password: Joi.string().min(6).required(),
  nickname: Joi.string().min(2),
});

//Create User
router.post("/register", async (req, res) => {
  //Validate Data
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Create Hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const formData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hashedPassword,
    nickname: req.body.nickname,
  };

  const sql = "INSERT INTO user SET ?";
  connection.query(sql, [formData], (err, result) => {
    if (err) {
      res.status(500).send("Erreur lors de la création d'un utilisateur");
    } else {
      res.sendStatus(200);
    }
  });
});

//Login user
router.post("/login", (req, res) => {
  const formData = {
    email: req.body.userEmail,
    password: req.body.userPassword,
  };
  const sql = "SELECT * FROM user WHERE email = ?";

  connection.query(sql, [formData.email], (err, result) => {
    if (err || result.length == 0) {
      res.status(500).send("Cette adresse email n'existe pas");
    } else {
      const isSamePass = bcrypt.compareSync(
        formData.password,
        result[0].password
      );
      if (!isSamePass) {
        res.status(500).send("Mot de passe incorrect");
      } else {
        // 'secretKey' will be in .env file => here, process.env.TOKEN_SECRET_KEY
        jwt.sign(
          { result },
          process.env.DB_JWT_SECRET,
          { expiresIn: "10h" },
          (err, token) => {
            if (err) {
              res.status(500).send("Token non crée");
            } else {
              res.json({ token });
            }
          }
        );
      }
    }
  });
});

// Token verify
router.post("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.DB_JWT_SECRET, (err, dataUser) => {
    //Secret key is environment var > add in .env
    if (err) {
      res.status(401).send("token non valide"); //Use for expiration
    } else {
      res.json(dataUser);
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(500).send("votre token n'existe pas");
  }
}

module.exports = router;
