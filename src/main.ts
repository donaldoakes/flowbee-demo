import * as flowbee from 'flowbee';
import { Descriptors } from './descriptors';

window.addEventListener('load', async () => {
    const base = '';
    const dark = false;
    const readonly = false;

    const descriptors = await Descriptors.getDescriptors(base);

    const flowTreeElement = document.getElementById('flow-tree') as HTMLDivElement;
    const root = await (await fetch(`${base}/flows`)).json();
    const flowTreeOptions = dark ? flowbee.DefaultOptions.flowTree.dark : flowbee.DefaultOptions.flowTree.light;
    const flowTree = new flowbee.FlowTree(flowTreeElement, flowTreeOptions);
    flowTree.render(root);
    flowTree.onFlowSelect(async selectEvent => {
        const canvasElement = document.getElementById('diagram-canvas') as HTMLCanvasElement;
        const text = await (await fetch(selectEvent.path)).text();
        const diagramOptions = dark ? flowbee.DefaultOptions.diagram.dark : flowbee.DefaultOptions.diagram.light;
        diagramOptions.iconBase = `${base}/icons`;
        console.debug(`rendering ${selectEvent.path} to canvas`);
        const flow = new flowbee.FlowDiagram(canvasElement, diagramOptions, descriptors, readonly);
        const instance = undefined;
        const step: string | undefined = undefined;
        const animate = false;
        const instanceEdit = false;
        const data = undefined;
        flow.render(text, selectEvent.name, instance, step, animate, instanceEdit, data);
    });

    const toolboxElement = document.getElementById('flow-toolbox') as HTMLDivElement;
    const toolboxOptions = dark ? flowbee.DefaultOptions.toolbox.dark : flowbee.DefaultOptions.toolbox.light;
    toolboxOptions.iconBase = `${base}/icons`;
    await new flowbee.Toolbox(toolboxElement, toolboxOptions).render(descriptors);

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
