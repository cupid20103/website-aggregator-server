import express from "express";
import cors from "cors";

import routes from "./api/index.js";

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      return callback(null, true);
    },
  })
);

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
