import puppeteer from "puppeteer";

export async function converter(html, path) {
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage();
        await page.setContent(html, {waitUntil: 'load'})
        await page.emulateMediaType('screen');
        await page.pdf({
            path: path,
            margin: {top: '100px', right: '50px', bottom: '100px', left: '50px'},
            printBackground: true,
            format: 'A4',
            displayHeaderFooter: true,
            headerTemplate: "<div><div class='pageNumber'></div> <div>/</div><div class='totalPages'></div></div>",
            footerTemplate: "<div style=\"text-align: right;width: 297mm;font-size: 8px;\"><span style=\"margin-right: 1cm\"><span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></span></div>"
        })
        await browser.close()
        return true
    } catch (e) {
        throw new Error(e)
    }
}
