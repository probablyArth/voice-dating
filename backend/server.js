require("dotenv").config();
const express = require("express");
const DBConnect = require("./database");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const connectToRedis = require("./redis");
const app = express();
const PORT = process.env.PORT || 5000;

const morganMiddleware = morgan(function (tokens, req, res) {
  return [
    "\n",
    "🍄  Morgan --> ",
    tokens.method(req, res),
    tokens.status(req, res),
    tokens.url(req, res),
    tokens["response-time"](req, res) + " ms",
    "@ " + tokens.date(req, res),
    "\n",
  ].join(" ");
});

(async () => {
  try {
    DBConnect();
    await connectToRedis();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
app.use(morganMiddleware);

const cors = require("cors");
const corsOptions = {
  origin: true,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "8mb" }));
app.use(cookieParser());

app.use("/storage", express.static("storage"));

app.use(router);

app.get("/", (req, res) => {
  res.send("Hello from express");
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
