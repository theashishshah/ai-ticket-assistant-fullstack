import app from "./app.js";
import "dotenv/config";
import dbConnect from "./db/db.config.js";

const PORT = process.env.PORT || 3000;

dbConnect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(`Error while connecting to database. ${error}`);
        process.exit(1);
    });
