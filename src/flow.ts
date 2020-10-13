import * as flowbee from 'flowbee';
import { Descriptors } from './descriptors';

export class Flow {

    constructor(private readonly base: string) {
    }

    async render(text: string, file: string, dark: boolean, readonly = false) {
        // TODO: switch between light/dark
        const options = dark ? flowbee.DefaultOptions.diagram.dark : flowbee.DefaultOptions.diagram.light;
        options.iconBase = `${this.base}/icons`;
        const canvas = document.getElementById('diagram-canvas') as HTMLCanvasElement;
        console.debug(`rendering ${file} to canvas: ${canvas}`);
        const descriptors = await Descriptors.getDescriptors(this.base);
        const flow = new flowbee.FlowDiagram(canvas, options, descriptors, readonly);

        const instance = undefined;
        const step: string | undefined = undefined;
        const animate = false;
        const instanceEdit = false;
        const data = undefined;

        flow.render(text, file, instance, step, animate, instanceEdit, data);
    }
}