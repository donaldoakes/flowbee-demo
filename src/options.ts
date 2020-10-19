import * as flowbee from 'flowbee';

export class Options {

    theme = 'light';
    grid = true;
    snap = true;
    zoom = 100;
    yaml = true;
    indent = 2;

    get iconBase() { return `${this.base}/icons`; }
    storagePath = '/flows/localStorage';

    constructor(readonly base: string) {}

    get diagramOptions(): flowbee.DiagramOptions & flowbee.DrawingOptions {
        return {
            theme: this.theme,
            iconBase: `${this.iconBase}`,
            grid: { visibility: this.grid ? 'visible' : 'hidden' }
        };
    }

    get flowTreeOptions(): flowbee.FlowTreeOptions {
        return {
            theme: this.theme,
            fileIcon: { light: 'img/flow-light.svg', dark: 'img/flow-dark.svg' }
        };
    }

    get toolboxOptions(): flowbee.ToolboxOptions {
        return {
            theme: this.theme,
            iconBase: `${this.iconBase}`
        };
    }
}