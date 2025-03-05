import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './db/MongoConnect.js';

dotenv.config();

const port = process.env.PORT || 3000;

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is up and running`);
    });
})
.catch((error) => {
    console.log("Connection error while setting it up in index.js file", error);
    process.exit(1);
});
