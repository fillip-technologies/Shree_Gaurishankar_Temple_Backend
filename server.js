import { envConfig } from "./src/config/env.config.js";

import { app } from "./app.js";
import { connectDb } from "./src/config/db.config.js";

const port = envConfig.PORT;

app.listen(port, () => {
  connectDb();
  console.log(`Listening on port ${port}`);
});
