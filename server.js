import { envConfig } from "./src/config/configenv.js";

import { app } from "./app.js";

const port = envConfig.PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
