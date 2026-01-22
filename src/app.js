const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const meRoutes = require("./routes/me.routes");
const goalsRoutes = require("./routes/goals.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://thrive365-frontend.vercel.app/",
];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      if (/^https:\/\/thrive365-frontend.*\.vercel\.app$/.test(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());

app.use(helmet());

app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/goals", goalsRoutes);

module.exports = app;
