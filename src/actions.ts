import * as flowbee from 'flowbee';

export interface ThemeChangeEvent {
    theme: string;
}
export interface OptionToggleEvent {
    option: string;
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

    constructor(container: HTMLElement) {
        const themeSelect = container.querySelector('#theme-select') as HTMLSelectElement;
        themeSelect.onchange = e => {
            this._onThemeChange.emit({ theme: (e.target as HTMLSelectElement).value });
        };
        const gridToggle = container.querySelector('#grid') as HTMLInputElement;
        gridToggle.onclick = e => {
            this._onOptionToggle.emit({ option: (e.target as HTMLElement).id });
        };
    }
}

export class FlowActions {

    private _onFlowAction = new flowbee.TypedEvent<FlowActionEvent>();
    onFlowAction(listener: flowbee.Listener<FlowActionEvent>) {
        this._onFlowAction.on(listener);
    }

    constructor(container: HTMLElement) {
        const saveAction = container.querySelector('#save') as HTMLInputElement;
        saveAction.onclick = e => {
            this._onFlowAction.emit({ action: (e.target as HTMLElement).id });
        };
    }
}