import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { seedDemoUser } from "./config/seedDemoUser.js";

const port = process.env.PORT || 4000;

await connectDatabase();
await seedDemoUser();

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
