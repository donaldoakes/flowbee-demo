import { Descriptors } from './descriptors';

export class Toolbox {

    constructor(
        readonly base: string
    ) { }

    async render(dark: boolean) {
        const div = document.getElementById('flow-toolbox') as HTMLElement;
        const ul = document.createElement('ul') as HTMLUListElement;
        const descriptors = await Descriptors.getDescriptors(this.base);
        let tabIndex = 1000;
        for (const descriptor of descriptors) {
            const li = document.createElement('li') as HTMLLIElement;
            li.setAttribute('id', descriptor.name);
            li.tabIndex = tabIndex++;
            const iconDiv = document.createElement('div') as HTMLDivElement;
            iconDiv.className = 'toolbox-icon';
            const iconImg = document.createElement('img') as HTMLImageElement;
            iconImg.src = `${this.base}/icons/${descriptor.icon}`;
            iconDiv.appendChild(iconImg);
            li.appendChild(iconDiv);
            const labelDiv = document.createElement('div') as HTMLDivElement;
            labelDiv.className = 'toolbox-label';
            labelDiv.style.color = dark ? '#cccccc' : '#303030';
            labelDiv.appendChild(document.createTextNode(descriptor.label));
            li.appendChild(labelDiv);
            ul.appendChild(li);
        }
        div.appendChild(ul);

        // events
    }
}