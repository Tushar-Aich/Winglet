import dotenv from 'dotenv';
import { server } from './app.js';
import connectDB from './db/MongoConnect.js';

dotenv.config();

const port = process.env.PORT || 3000;

connectDB()
.then(() => {
    server.listen(port, () => {
        console.log(`Server is up and running at ${port}`);
    });
})
.catch((error) => {
    console.log("Connection error while setting it up in index.js file", error);
    process.exit(1);
});
