import * as flowbee from 'flowbee';

export interface ThemeChangeEvent {
    theme: string;
}


export class Actions {

    private _onThemeChange = new flowbee.TypedEvent<ThemeChangeEvent>();
    onThemeChange(listener: flowbee.Listener<ThemeChangeEvent>) {
        this._onThemeChange.on(listener);
    }

    constructor(container: HTMLElement) {
        const themeSelect = container.querySelector("#theme-select") as HTMLSelectElement;
        themeSelect.onchange = e => {
            this._onThemeChange.emit({ theme: (e.target as HTMLSelectElement).value });
        };
    }
}