import * as flowbee from 'flowbee';

export class Options {

    theme: string;
    grid = true;
    snap = true;
    title = true;
    zoom = 100;
    mode: 'select' | 'connect' = 'select';
    yaml = true;
    indent = 2;
    descriptorsViaFlowbiz = false;

    get iconBase() { return `${this.base}/icons`; }
    storagePath = '/flows/localStorage';

    constructor(readonly base: string, readonly websocketUrl) {
        this.theme = localStorage.getItem('flowbee-theme') || 'light';
    }

    get diagramOptions(): flowbee.DiagramOptions & flowbee.DrawingOptions {
        return {
            theme: this.theme,
            iconBase: `${this.iconBase}`,
            webSocketUrl: this.websocketUrl,
            resizeWithContainer: true,
            showGrid: this.grid,
            snapToGrid: this.snap,
            showTitle: this.title
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

    get configuratorOptions(): flowbee.ConfiguratorOptions {
        return {
            theme: this.theme,
            sourceTab: this.yaml ? 'yaml' : 'json',
            movable: true
        };
    }
}