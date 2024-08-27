import express from 'express'
import http from 'http'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE'

export class SimpleTestsServer {

  public app: express.Application = express()
  public server: http.Server = http.createServer(this.app)

  public start() {
    this.server.listen(0)
  }

  public stop() {
    this.server.close()
  }

  public get port(): number {
    const address = this.server.address()
    if (address == null) {
      throw new Error('Could not start server')
    } else if (typeof address === 'string') {
      const url = new URL(address)
      return parseInt(url.port)
    } else {
      return address.port
    }
  }

  public addRoute(methods: HttpMethod[], path: string, handler: express.RequestHandler) {
    this.app.use(path, (req, res, next) => {
      if (req.method == "HEAD") {
        res.sendStatus(200);
      } else if (methods.indexOf(req.method as HttpMethod) !== -1) {
        handler(req, res, next)
      } else {
        next();
      }
    });
  }
}
