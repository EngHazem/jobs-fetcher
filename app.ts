import express from 'express';
import * as bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
 
class App {
  public app: express.Application;
  public port: number;
 
  constructor(controllers, port) {
    this.app = express();
    this.port = port;
 
    this.initializeMiddlewares();
    this.initializeControllers(controllers);

    this.app.use(express.static('public'))

    this.app.get('/', (req, resp) => {
        resp.render('index');
    })
  }
 
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    const limiter = rateLimit({
        windowMs: 1000,
        max: 2,
        standardHeaders: true,
        legacyHeaders: false,
    })
    this.app.use(limiter);
  }
 
  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
 
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
 
export default App;