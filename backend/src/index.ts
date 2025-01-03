import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

app.get("/test", (req: Request, res: Response) => {
  res.send([{ name: "test" }, { name: "test123" }, { name: "321" }]);
});

app.get("/data/devices", (req: Request, res: Response) => {
    const devicesPath = path.join(__dirname, "data/devices.json");
    fs.readFile(devicesPath, "utf8", (err, data) => {
        if(err) {
            res.status(500).send({error: "Could not read devices file"});
        } else {
            res.json(JSON.parse(data));
        }
        });
});


app.listen(port, () => {
  console.log(`[backend]: Server is running at port: ${port}`);
});
