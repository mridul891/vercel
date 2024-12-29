// fileName=> output/cbe60a/src/app.jsx
// filePath = /Users/mridulpandey/Developer/Projects/vercel/dist/output/cbe60a/src/app.jsx

import { PutObjectCommand } from "@aws-sdk/client-s3"
import fs from 'fs'
import 'dotenv/config'
import { s3client } from "./s3client"


export const uploadFile = async (fileName : string , folderPath : string)=>{
    
    const fileContent = fs.readFileSync(folderPath)
    const params= {
        Body:fileContent,
        Bucket:"vercelcrytek",
        Key:fileName
    }
    try {
        const data = await s3client.send(new PutObjectCommand(params))
        console.log("file succesfully uploaded" ,data)
    } catch (error) {
        console.log(error)
    }
}