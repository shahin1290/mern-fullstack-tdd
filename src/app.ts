import { config } from './config/config';
import Logging from './library/Logging';
import connect from './utils/connect';
import createServer from './utils/server';

const app = createServer();

app.listen(config.server.port, async () => {
    Logging.info(`App is running at http://localhost:${config.server.port}`);

    await connect();
});
