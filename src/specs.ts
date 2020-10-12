import * as flowbee from 'flowbee';

export class Specs {

    private static _specs: flowbee.Specifier[] | undefined;

    static async getSpecs(base: string): Promise<flowbee.Specifier[]> {
        if (!Specs._specs) {
            Specs._specs = await Specs.loadSpecs(base);
        }
        return Specs._specs;
    }

    private static async loadSpecs(base: string): Promise<flowbee.Specifier[]> {
        const dirItem = await (await fetch(`${base}/specs`)).json();
        Specs._specs = await Specs.collect(dirItem, []);
        return Specs._specs;
    }

    private static async collect(item: any, specs: flowbee.Specifier[]): Promise<flowbee.Specifier[]> {
        if (!item.name.startsWith('.')) {
            if (item.type === 'file') {
                specs.push(await (await fetch(item.path)).json());
            } else if (item.type === 'directory') {
                for (const child of item.children) {
                    this.collect(child, specs);
                }
            }
        }
        return specs;
    }
}