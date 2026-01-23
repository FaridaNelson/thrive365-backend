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
  "https://thrive365-frontend.vercel.app",
];

const corsOptions = {
  origin: (origin, cb) => {
    // allow non-browser tools (curl/postman) which have no origin
    if (!origin) return cb(null, true);

    if (allowedOrigins.includes(origin)) return cb(null, true);

    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(helmet());

app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/goals", goalsRoutes);

module.exports = app;
