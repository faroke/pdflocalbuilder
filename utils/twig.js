import Twig from 'twig';

export async function build(html, config) {
    try {
        Twig.cache(false)
        const template = Twig.twig({
            id: "list",
            data: html,
        });
        return await template.render(config);
    } catch (e) {
        throw new Error(e)
    }
}
