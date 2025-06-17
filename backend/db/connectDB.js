const mongoose = require('mongoose');

const DB_URL = process.env.DB_URL;

const connectDB = async () => {
    const maxRetries = 5;
    const baseDelay = 1000; // Initial delay of 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await mongoose.connect(DB_URL, {
                // Additional options for better reliability
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 30000,
            });
            console.log('MongoDB connected');
            return; // Connection successful, exit the function
        } catch (error) {
            console.error(`MongoDB connection attempt ${attempt} failed:`, error.message);
            
            if (attempt === maxRetries) {
                console.error('Max retries reached. Could not connect to MongoDB');
                process.exit(1);
            }

            // Calculate delay with exponential backoff (1s, 2s, 4s, 8s, 16s)
            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.log(`Retrying in ${delay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

module.exports = connectDB;