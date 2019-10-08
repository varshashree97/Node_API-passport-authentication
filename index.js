const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Homepage
router.get("/",forwardAuthenticated,(req,res) => res.render("Homepage"));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('Dashboard', {
    user: req.user
  })
);
module.exports = router;