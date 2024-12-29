import fs from "fs";
import path from "path";

export const GetAllFiles = (folderPath: string): string[] => {
  let response: string[] = [];
  const AllFiles = fs.readdirSync(folderPath);
  AllFiles.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(GetAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
};
