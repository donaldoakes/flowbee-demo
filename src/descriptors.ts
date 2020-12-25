import * as flowbee from 'flowbee';

export class Descriptors {

    private static _descriptors: flowbee.Descriptor[] | undefined;

    static async getDescriptors(base?: string): Promise<flowbee.Descriptor[]> {
        if (!Descriptors._descriptors) {
            Descriptors._descriptors = await Descriptors.load(base);
        }
        return Descriptors._descriptors;
    }

    private static async load(base?: string): Promise<flowbee.Descriptor[]> {
        if (base) {
            Descriptors._descriptors = await (await fetch(`${base}/descriptors`)).json();
        } else {
            const dirItem = await (await fetch(`/descriptors`)).json();
            Descriptors._descriptors = await Descriptors.collect(dirItem, []);
        }
        return Descriptors._descriptors;
    }

    private static async collect(item: any, descriptors: flowbee.Descriptor[]): Promise<flowbee.Descriptor[]> {
        if (!item.name.startsWith('.')) {
            if (item.type === 'file') {
                descriptors.push(await (await fetch(item.path)).json());
            } else if (item.type === 'directory') {
                for (const child of item.children) {
                    await this.collect(child, descriptors);
                }
            }
        }
        return descriptors;
    }
}