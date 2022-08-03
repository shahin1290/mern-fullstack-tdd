import mongoose from 'mongoose';
import { config } from '../config/config';
import Logging from '../library/Logging';

async function connect() {
    try {
        await mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' });
        Logging.info('DB connected');
    } catch (error) {
        Logging.error('Could not connect to db');
        process.exit(1);
    }
}

export default connect;
