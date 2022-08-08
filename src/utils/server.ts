import express from 'express';
import Logging from '../library/Logging';
import userRoutes from '../routes/user.routes';
import bookRoutes from '../routes/Book';
import errorHandler from '../error/ErrorHandler';

function createServer() {
    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    /** Rules of our API */
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    /** Routes */
    app.use('/api/users', userRoutes);
    app.use('/books', bookRoutes);

    /** Healthcheck */
    app.get('/ping', (req, res, next) => res.status(200).json({ hello: 'world' }));

    /** Error handling */
    app.use(errorHandler);

    return app;
}

export default createServer;
