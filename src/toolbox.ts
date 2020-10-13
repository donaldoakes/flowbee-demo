import { Specs } from './specs';

export class Toolbox {

    constructor(
        readonly base: string
    ) { }

    async render(dark: boolean) {
        const div = document.getElementById('flow-toolbox') as HTMLElement;
        const ul = document.createElement('ul') as HTMLUListElement;
        const specs = await Specs.getSpecs(this.base);
        let tabIndex = 1000;
        for (const spec of specs) {
            const li = document.createElement("li") as HTMLLIElement;
            li.setAttribute('id', spec.id);
            li.tabIndex = tabIndex;
            const iconDiv = document.createElement("div") as HTMLDivElement;
            iconDiv.className = 'toolbox-icon';
            const iconImg = document.createElement("img") as HTMLImageElement;
            iconImg.src = `${this.base}/icons/${spec.icon}`;
            iconDiv.appendChild(iconImg);
            li.appendChild(iconDiv);
            const labelDiv = document.createElement("div") as HTMLDivElement;
            labelDiv.className = 'toolbox-label';
            labelDiv.style.color = dark ? '#cccccc' : '#303030';
            labelDiv.appendChild(document.createTextNode(spec.label));
            li.appendChild(labelDiv);
            ul.appendChild(li);
            tabIndex++;
        }
        div.appendChild(ul);

        // events
    }
}