import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import compression from 'compression';

// Custom routes
import routes from './routes';

// Define app
const app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set headers
app.use((req, res, next) => {
  // Cors
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization, Authorization');

  // Nocache
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  next();
});
app.use(compression());

// Serve
app.get('/', (req, res) => {
  res.redirect('https://satfstatic.z6.web.core.windows.net/?page=install');
});
app.use('/api', routes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`HTTP server running on port: ${port}`);
});
