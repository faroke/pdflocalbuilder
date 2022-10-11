import fs from "fs";
import {__dirname} from "../server.js";
export default function getById(template_id){
    try {
        const source = fs.readFileSync(`${__dirname}/templates/${template_id}.html`, {encoding: 'utf-8'})
        return {source}
    } catch (e) {
        throw new Error(e)
    }
}
