const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const meRoutes = require("./routes/me.routes");
const goalsRoutes = require("./routes/goals.routes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true, // Enable cookies and other credentials
  }),
);

app.use(helmet());

app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/goals", goalsRoutes);

module.exports = app;
