import sirv from "sirv";
import polka from "polka";
import bodyParser from "body-parser";
import compression from "compression";
import * as sapper from "@sapper/server";
import session from "express-session";
import ms from "memorystore";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
const MemoryStore = ms(session);

const app = polka();
app
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    session({
      cookie: {
        maxAge: 604800000
      },
      secret: "123456789",
      resave: false,
      rolling: true,
      saveUninitialized: true,
      store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      })
    }),
    sapper.middleware({
      session: req => {
        const session = {};
        for (const ndx in req.session) {
          if (ndx !== "cookie" && req.session.hasOwnProperty(ndx)) {
            session[ndx] = req.session[ndx];
          }
        }
        return session;
      }
    })
  )
  .listen(PORT, err => {
    if (err) console.log("error", err);
  });
