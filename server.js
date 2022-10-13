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

app.post("/build/:template_id", async (req, res) => {
    const {template_id} = req.params
    const path = `/tmp/${template_id}.pdf`;
    try {
        const item = await getById(template_id)
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
app.get("/html/:template_id", async (req, res) => {
    app.set('view engine', 'html');
    const {template_id} = req.params
    try {
        const item = await getById(template_id)
        const twigRender = await twig.build(item.source,{
            "start_date": "31/01/2022 à 21h30",
            "end_date": "31/10/2022 à 21h30",
            "displayName": "toto",
            "displayRenterName": "Nom du loueur",
            "siren" : "000000000",
            "address": "2 rue des champs",
            "phone_number": "0606060606",
            "email" : "monmail@gmail.com",
            "company_name": "Nom d'entreprise",
            "usage": "Privé - trajet travail / Professionnel / Transports",
            "sharing" : "Partagé",
            "created_date" : "31/02/2021",
            "build_date": "30/02/2021",
            "total_amount" : "200 €",
            "tax" : "20 €",
            "catnat": "200 € dont 20 € de taxes",
            "products" : [
                {
                    "brand": "Marque vélo 1",
                    "model": "Marque vélo 1",
                    "marked" : "Numéro de gravage du vélo 1",
                    "price": "Valeur d'achat à neuf vélo 1"
                },
                {
                    "brand": "Marque vélo 2",
                    "model": "Marque vélo 2",
                    "marked" : "Numéro de gravage du vélo 2",
                    "price": "Valeur d'achat à neuf vélo 2"
                },
                {
                    "brand": "Marque vélo 3",
                    "model": "Marque vélo 3",
                    "marked" : "Numéro de gravage du vélo 3",
                    "price": "Valeur d'achat à neuf vélo 3"
                }
            ],
            "receipts": [
                {
                    "due_date": "31/02/2021",
                    "start_date" : "31/02/2021",
                    "end_date": "31/02/2021",
                    "amount" : "400 €"
                },
                {
                    "due_date": "31/02/2021",
                    "start_date" : "31/02/2021",
                    "end_date": "31/02/2021",
                    "amount" : "400 €"
                },
                {
                    "due_date": "31/02/2021",
                    "start_date" : "31/02/2021",
                    "end_date": "31/02/2021",
                    "amount" : "400 €"
                }
            ],
            "theft": false,
            "break": true,
            "natural_disaster": true,
            "technological_disaster": true,
            "ia": false,
            "rc": true,
            "ia_itt": "5 000€",
            "ia_death": "400 000€"
        })
        res.send(twigRender)
    } catch (e) {
        return res.status(500).send(e);
    }
})
app.listen(8080, () => {
    console.log(`App listening at http://localhost:8080`);
});
