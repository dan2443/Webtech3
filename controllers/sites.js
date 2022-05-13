const { validationResult } = require("express-validator");

const Site = require("../models/site");

exports.getSites = (req, res, next) => {
  Site.find()
    .then((sites) => {
      res.status(200).json({
        message: "sites fetched.",
        sites: sites,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createSite = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrls = [];
  if (req.files) {
    for (let file of req.files) {
      imageUrls.push(file.path);
    }
  } else imageUrls = req.body.imageUrls;
  const site = new Site({
    title: title,
    content: content,
    imageUrls: imageUrls,
  });
  site
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Site created successfully!",
        site: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteSite = (req, res, next) => {
  const siteId = req.params.siteId;
  Site.findById(siteId)
    .then((site) => {
      if (!site) {
        const error = new Error("Could not find site by siteId.");
        error.statusCode = 404;
        throw error;
      }

      return Site.findByIdAndRemove(siteId);
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted site" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
