import * as flowbee from 'flowbee';
import { Specs } from './specs';

export class Flow {

    constructor(private readonly base: string) {
    }

    async render(text: string, file: string, dark = false, readonly = false) {
        // TODO: switch between light/dark
        const options = dark ? flowbee.DefaultOptions.diagram.dark : flowbee.DefaultOptions.diagram.light;
        options.iconBase = `${this.base}/icons`;
        const canvas = document.getElementById('diagram-canvas') as HTMLCanvasElement;
        console.debug(`rendering ${file} to canvas: ${canvas}`);
        const specs = await Specs.getSpecs(this.base);
        const flow = new flowbee.FlowDiagram(canvas, options, specs, readonly);

        const instance = undefined;
        const step: string | undefined = undefined;
        const animate = false;
        const instanceEdit = false;
        const data = undefined;

        flow.render(text, file, instance, step, animate, instanceEdit, data);
    }
}