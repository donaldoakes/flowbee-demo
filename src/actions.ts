import * as flowbee from 'flowbee';
import { Options } from './options';

export interface ThemeChangeEvent {
    theme: string;
}
export interface OptionToggleEvent {
    option: string;
}
export interface ZoomChangeEvent {
    zoom: number;
}
export interface FlowActionEvent {
    action: string;
}

export class DrawingActions {

    private _onThemeChange = new flowbee.TypedEvent<ThemeChangeEvent>();
    onThemeChange(listener: flowbee.Listener<ThemeChangeEvent>) {
        this._onThemeChange.on(listener);
    }

    private _onOptionToggle = new flowbee.TypedEvent<OptionToggleEvent>();
    onOptionToggle(listener: flowbee.Listener<OptionToggleEvent>) {
        this._onOptionToggle.on(listener);
    }

    private _onZoomChange = new flowbee.TypedEvent<ZoomChangeEvent>();
    onZoomChange(listener: flowbee.Listener<ZoomChangeEvent>) {
        this._onZoomChange.on(listener);
    }

    constructor(container: HTMLElement, readonly options: Options) {
        const themeSelect = container.querySelector('#theme-select') as HTMLSelectElement;
        themeSelect.value = options.theme;
        themeSelect.onchange = e => {
            this._onThemeChange.emit({ theme: (e.target as HTMLSelectElement).value });
        };
        const gridToggle = container.querySelector('#grid') as HTMLInputElement;
        gridToggle.onclick = e => {
            this._onOptionToggle.emit({ option: (e.target as HTMLElement).id });
        };
        const snapToggle = container.querySelector('#snap') as HTMLInputElement;
        snapToggle.onclick = e => {
            this._onOptionToggle.emit({ option: (e.target as HTMLElement).id });
        };
        const zoomSlider = container.querySelector('#zoom-range') as HTMLInputElement;
        zoomSlider.oninput = e => {
            this._onZoomChange.emit({ zoom: parseInt((e.target as HTMLInputElement).value) });
        };
        const zoomOut = container.querySelector('#zoom-out') as HTMLInputElement;
        zoomOut.onclick = e => {
            const zoom = Math.max(parseInt(zoomSlider.value) - 20, 20);
            zoomSlider.value = '' + zoom;
            this._onZoomChange.emit({ zoom });
        };
        const zoomIn = container.querySelector('#zoom-in') as HTMLInputElement;
        zoomIn.onclick = e => {
            const zoom = Math.min(parseInt(zoomSlider.value) + 20, 200);
            zoomSlider.value = '' + zoom;
            this._onZoomChange.emit({ zoom });
        };
        // pinch gesture
        window.addEventListener('wheel', e => {
            if (e.ctrlKey && document.activeElement === document.getElementById('diagram-canvas')) {
                e.preventDefault();
                let zoom = parseInt(zoomSlider.value) - e.deltaY;
                if (zoom < 20) {
                    zoom = 20;
                }
                else if (zoom > 200) {
                    zoom = 200;
                }
                zoomSlider.value = '' + zoom;
                this._onZoomChange.emit({ zoom });
            }
        }, { passive: false });
    }
}

export class FlowActions {

    private _onFlowAction = new flowbee.TypedEvent<FlowActionEvent>();
    onFlowAction(listener: flowbee.Listener<FlowActionEvent>) {
        this._onFlowAction.on(listener);
    }

    private save: HTMLInputElement;
    private download: HTMLInputElement;
    private new: HTMLInputElement;
    private run: HTMLInputElement;

    constructor(container: HTMLElement) {
        const actionClick = (e: MouseEvent) => {
            this._onFlowAction.emit({ action: (e.target as HTMLElement).id });
        };

        this.save = container.querySelector('#save');
        this.save.onclick = actionClick;
        this.download = container.querySelector('#download');
        this.download.onclick = actionClick;
        this.new = container.querySelector('#new');
        this.new.onclick = actionClick;
        this.run = container.querySelector('#run');
        this.run.onclick = actionClick;
    }

    enable(isEnabled: boolean) {
        this.save.disabled = !isEnabled;
        this.download.disabled = !isEnabled;
        this.new.disabled = !isEnabled;
        this.run.disabled = !isEnabled;
    }

}