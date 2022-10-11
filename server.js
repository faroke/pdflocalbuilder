import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import getById from "./utils/finder.js";
import * as twig from "./utils/twig.js";
import * as pdfToHtml from "./utils/pdfToHtml.js";


export const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());
app.locals.pretty = true;

app.use(express.static(path.join(__dirname, "public")));

app.post("/:template_id", async (req, res) => {
    const {template_id} = req.params
    const path = `/tmp/${template_id}.pdf`;
    try {
        const item = await getById(template_id)
        console.log(req.body)
        const twigRender = await twig.build(item.source, req.body)
        await pdfToHtml.converter(twigRender, path);
        if (req.query.hasOwnProperty('encode') && req.query.encode === 'base64') {
            const content = fs.readFileSync(path, {encoding: "base64"})
            res.status(201).send({
                status: "success",
                content: {
                    type: "base64",
                    content: content
                }
            })
        } else {
            const pdf = fs.readFileSync(path);
            res.setHeader('Content-Type', 'application/pdf')
            return res.status(201).send(pdf)
        }
    } catch (e) {
        return res.status(500).send(e);
    }
});

app.listen(8080, () => {
    console.log(`App listening at http://localhost:8080`);
});
