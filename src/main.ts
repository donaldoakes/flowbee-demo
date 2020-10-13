import * as flowbee from 'flowbee';
import { Descriptors } from './descriptors';
import { Flows } from './flows';

window.addEventListener('load', async () => {
    const base = '';
    const dark = false;

    const descriptors = await Descriptors.getDescriptors(base);

    const flowTreeElement = document.getElementById('flow-tree') as HTMLDivElement;

    await new Flows(base).render(dark);

    const toolboxElement = document.getElementById('flow-toolbox') as HTMLDivElement;
    const toolboxOptions = dark ? flowbee.DefaultOptions.toolbox.dark : flowbee.DefaultOptions.toolbox.light;
    toolboxOptions.iconBase = `${base}/icons`;
    await new flowbee.Toolbox(
        toolboxElement,
        toolboxOptions,
        descriptors
    ).render();

    // avoid resize when collapse
    flowTreeElement.style.width = flowTreeElement.style.minWidth = flowTreeElement.style.maxWidth = (flowTreeElement.offsetWidth - 2) + 'px';

    const containerElement = document.getElementById('flow-container') as HTMLDivElement;

    let isLeftSplitterDrag = false;
    let isRightSplitterDrag = false;

    const isLeftSplitterHover = (e: MouseEvent): boolean => {
        const flowTreeWidth = flowTreeElement.offsetWidth - 2;
        const x = e.clientX - containerElement.getBoundingClientRect().left;
        return (Math.abs(x - flowTreeWidth) <= 2);
    };
    const isRightSplitterHover = (e: MouseEvent): boolean => {
        const toolboxWidth = toolboxElement.offsetWidth - 2;
        const x = e.clientX - containerElement.getBoundingClientRect().left;
        return (Math.abs(x - (containerElement.offsetWidth - toolboxWidth)) <= 3);
    };

    containerElement.onmousedown = (e: MouseEvent) => {
        isLeftSplitterDrag = isLeftSplitterHover(e);
        isRightSplitterDrag = isRightSplitterHover(e);
    };
    containerElement.onmouseup = (e: MouseEvent) => {
        isLeftSplitterDrag = isRightSplitterDrag = false;
        document.body.style.cursor = 'default';
    };
    containerElement.onmouseout = (e: MouseEvent) => {
        if (!isLeftSplitterDrag && !isRightSplitterDrag) {
            document.body.style.cursor = 'default';
        }
    };
    containerElement.onmousemove = (e: MouseEvent) => {
        if (isLeftSplitterDrag) {
            e.preventDefault();
            document.body.style.cursor = 'ew-resize';
            const x = e.clientX - containerElement.getBoundingClientRect().left - 8;
            flowTreeElement.style.width = flowTreeElement.style.minWidth = flowTreeElement.style.maxWidth = x + 'px';
        } else if (isRightSplitterDrag) {
            e.preventDefault();
            document.body.style.cursor = 'ew-resize';
            const x = e.clientX - containerElement.getBoundingClientRect().left + 8;
            toolboxElement.style.width = toolboxElement.style.minWidth = toolboxElement.style.maxWidth = (containerElement.offsetWidth - x) + 'px';
        } else {
            if (isLeftSplitterHover(e) || isRightSplitterHover(e)) {
                document.body.style.cursor = 'ew-resize';
            } else {
                document.body.style.cursor = 'default';
            }
        }
    };
});
