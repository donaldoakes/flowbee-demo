import { Flow } from './flow';
import { Descriptors } from './descriptors';

export class Flows {

    private tabIndex = 100;

    constructor(private readonly base: string) {}

    renderItem(item: any, ul: HTMLUListElement, dark: boolean) {
        // TODO honor dark
        if (!item.name.startsWith('.')) {
            if (item.type === 'file') {
                const li = document.createElement('li') as HTMLLIElement;
                li.setAttribute('id', item.path);
                li.className = 'tree-flow-item';
                li.tabIndex = this.tabIndex++;
                const img = document.createElement('img') as HTMLImageElement;
                img.src = '/img/flow.svg';
                img.alt = 'flow';
                img.className = 'tree-flow-icon';
                li.appendChild(img);
                li.addEventListener('click', async () => {
                    const flow = new Flow(this.base);
                    const text = await (await fetch(item.path)).text();
                    flow.render(text, item.path, dark);
                });
                li.appendChild(document.createTextNode(item.name));
                ul.appendChild(li);

            } else if (item.type === 'directory') {
                const li = document.createElement('li') as HTMLLIElement;
                const span = document.createElement('span') as HTMLSpanElement;
                span.className = 'tree-caret';
                span.addEventListener('click', () => {
                    li.querySelector('.tree-nested').classList.toggle('tree-hidden');
                    span.classList.toggle('tree-caret-closed');
                });
                li.appendChild(span);
                const dirUl = document.createElement('ul') as HTMLUListElement;
                dirUl.className = 'tree-nested';
                span.appendChild(document.createTextNode(item.name));
                for (const child of item.children) {
                    this.renderItem(child, dirUl, dark);
                }
                li.appendChild(dirUl);
                ul.appendChild(li);
            }
        }
    }

    async render(dark: boolean) {
        const dirItem = await (await fetch(`${this.base}/flows`)).json();
        const div = document.getElementById('flow-tree') as HTMLDivElement;
        const ul = document.createElement('ul') as HTMLUListElement;
        ul.style.paddingLeft = '0px';
        this.renderItem(dirItem, ul, dark);
        div.appendChild(ul);
    }
}