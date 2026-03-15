const express = require("express");
const cors = require("cors");
const path = require("path");
const projectsRouter = require("./routes/projects");
const contactRouter = require("./routes/contact");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use("/api/projects", projectsRouter);
app.use("/api/contact", contactRouter);

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

module.exports = app;
