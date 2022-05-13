const express = require("express");
const { body } = require("express-validator");

const sitesController = require("../controllers/sites");

const router = express.Router();

// GET /sites
router.get("/", sitesController.getSites);

// POST /sites
router.post("/", sitesController.createSite);

// DELETE /sites
router.delete("/:siteId", sitesController.deleteSite);

module.exports = router;
