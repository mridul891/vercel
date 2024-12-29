import express from "express";
import cors from "cors";
import { Generateid } from "./utils";
import simpleGit from "simple-git";
import { GetAllFiles } from "./files";
import path, { resolve } from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const PORT = 3000;

//  Why we are Using 2 Clients = Because redis does not allow a single client inorder to update and get the  data
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();

app.use(cors());
app.use(express.json());
// uploadFile("output/cbe60a/app/page.tsx","/Users/mridulpandey/Developer/Projects/vercel/dist/output/cbe60a/app/page.tsx")

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = Generateid();
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

  // Get path of all the file in the Github repo
  const files = GetAllFiles(path.join(__dirname, `output/${id}`));

  await new Promise((resolve) => setTimeout(resolve, 10000));
  // Store all the files in the S3 bucket
  files.forEach(async (elem) => {
    await uploadFile(elem.slice(__dirname.length + 1), elem);
  });

  // upload this to the queue
  publisher.lPush("build-queue", id);
  publisher.hSet("status", id, "uploaded");

  res.json({ id: id });
});

app.get("/status", async (req, res) => {
  const id = req.query.id as string;
  const response = await subscriber.hGet("status", id);
  res.json({ status: response });
});

app.listen(PORT, () => {
  console.log(`The local host is running at ${PORT}`);
});
