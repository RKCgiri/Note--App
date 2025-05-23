const mongoose = require('mongoose');

// ✅ Add database name (e.g., "inotebook") at the end of the URI
const mongoURI = "mongodb://localhost:27017/inotebook";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB successfully");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectToMongo;
