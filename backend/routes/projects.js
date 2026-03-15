const express = require("express");
const router = express.Router();
const projects = require("../data/projects.json");

router.get("/", (_req, res) => {
  res.json(projects);
});

router.get("/:id", (req, res) => {
  const project = projects.find((p) => p.id === parseInt(req.params.id, 10));
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  res.json(project);
});

module.exports = router;
