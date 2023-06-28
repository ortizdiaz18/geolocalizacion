const express = require("express");
const router = express.Router();

const {
   validarCobertura
} = require("../controllers/cobertura");

router.get("/", validarCobertura);


module.exports =  router;