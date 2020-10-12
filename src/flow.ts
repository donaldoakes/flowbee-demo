import * as flowbee from 'flowbee';

export class Flow {

    options: flowbee.DiagramOptions;

    constructor(base: string, readonly specs: flowbee.Specifier[]) {
        // TODO: switch between light/dark
        this.options = flowbee.DefaultOptions.diagram.light;
        this.options.iconBase = `${base}/img/icons`;
    }

    render(text: string, file: string, readonly = false) {
        const canvas = document.getElementById('diagram-canvas') as HTMLCanvasElement;
        console.info(`rendering ${file} to canvas: ${canvas}`);
        const flow = new flowbee.FlowDiagram(canvas, this.options, this.specs, readonly);

        const instance = undefined;
        const step: string | undefined = undefined;
        const animate = false;
        const instanceEdit = false;
        const data = undefined;

        flow.render(text, file, instance, step, animate, instanceEdit, data);
    }
}