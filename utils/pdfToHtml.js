import puppeteer from "puppeteer";

export async function converter(html, path) {
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage();
        await page.setContent(html, {waitUntil: 'load'})
        await page.emulateMediaType('screen');
        await page.pdf({
            path: path,
            //margin: {top: '100px', right: '50px', bottom: '100px', left: '50px'},
            printBackground: true,
            format: 'A4',
            displayHeaderFooter: true,
            headerTemplate: "<div></div>",
            footerTemplate: "<div style='width: 100%; display: flex;flex-direction: row; justify-content: space-between'" +
                "><div " +
                "style=\"font-size:11px;margin-left: 1cm\">" +
                "Contrat n° XXXXXXX</div>" +
                "<div " +
                "style=\"text-align: right;font-size: 11px;\"" +
                "><span style=\"margin-right: 1cm\">" +
                "<span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span></span></div></div>",
            //footerTemplate: '<div style="font-size:10px !important; color:#808080;margin-right: 1cm; text-align: right"><span style="margin-right: 1cm"><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
            margin: {
                top: '1.27cm',
                bottom: '135px',
                right: '1.27cm',
                left: '1.27cm',
            },
        })
        await browser.close()
        return true
    } catch (e) {
        throw new Error(e)
    }
}
