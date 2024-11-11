import express from 'express'
import cors from 'cors'
import { Generateid } from './utils';
import simpleGit from 'simple-git';
import { GetAllFiles } from './files';
import path from 'path'
import { uploadFile } from './aws';
import { createClient } from 'redis';


const PORT = 3000
const publisher = createClient();
publisher.connect()
const app = express();

app.use(cors())
app.use(express.json())
// uploadFile("output/cbe60a/app/page.tsx","/Users/mridulpandey/Developer/Projects/vercel/dist/output/cbe60a/app/page.tsx")

app.post('/deploy' ,async(req ,res)=>{
    const repoUrl = req.body.repoUrl;
    const id = Generateid();
    await simpleGit().clone(repoUrl ,path.join(__dirname ,`output/${id}`))
    
    // Get path of all the file in the Github repo
    const files = GetAllFiles(path.join(__dirname ,`output/${id}`))

    // Store all the files in the S3 bucket
    files.forEach(async elem=>{
        await uploadFile(elem.slice(__dirname.length +1) , elem)
    })


    // upload this to the queue
    publisher.lPush("build-queue" ,id);

    res.json({id : id})
})

app.listen(PORT , ( )=>{
    console.log(`The local host is running at ${PORT}`)
})