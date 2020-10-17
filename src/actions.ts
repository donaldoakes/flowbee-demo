import * as flowbee from 'flowbee';

export interface ThemeChangeEvent {
    theme: string;
}
export interface OptionToggleEvent {
    option: string;
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