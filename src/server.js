require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`API running on port ${PORT}`),
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
