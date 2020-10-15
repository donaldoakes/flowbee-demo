import * as flowbee from 'flowbee';
import { Descriptors } from './descriptors';
import { Actions, ThemeChangeEvent } from './actions';

window.addEventListener('load', async () => {
    const base = '';
    const readonly = false;
    let theme = 'light';
    let flowDiagram: flowbee.FlowDiagram;

    const instance = undefined;
    const step: string | undefined = undefined;
    const animate = false;
    const instanceEdit = false;

    const descriptors = await Descriptors.getDescriptors(base);

    const flowTreeElement = document.getElementById('flow-tree') as HTMLDivElement;
    const root = await (await fetch(`${base}/flows`)).json();
    const flowTreeOptions = {
        fileIcon: { light: 'img/flow-light.svg', dark: 'img/flow-dark.svg' }
    };
    const flowTree = new flowbee.FlowTree(flowTreeElement, flowTreeOptions);
    flowTree.render(theme, root);
    flowTree.onFlowSelect(async (selectEvent: flowbee.FlowTreeSelectEvent) => {
        const canvasElement = document.getElementById('diagram-canvas') as HTMLCanvasElement;
        canvasElement.parentElement.className = `flowbee-diagram-${theme} diagram`;
        const text = await (await fetch(selectEvent.path)).text();
        const diagramOptions = { iconBase: `${base}/icons` };
        console.debug(`rendering ${selectEvent.path} to canvas`);
        flowDiagram = new flowbee.FlowDiagram(canvasElement, diagramOptions, descriptors);
        flowDiagram.readonly = readonly;
        flowDiagram.render(theme, text, selectEvent.name, instance, step, animate, instanceEdit);
    });

    const flowDiagramElement = document.getElementById('flow-diagram');
    flowDiagramElement.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';
    const toolboxElement = document.getElementById('flow-toolbox') as HTMLDivElement;
    const toolboxOptions = { iconBase: `${base}/icons` };
    const toolbox = await new flowbee.Toolbox(toolboxElement, toolboxOptions);
    toolbox.render(theme, descriptors);

    const actions = new Actions(document.getElementById('actions'));
    actions.onThemeChange((e: ThemeChangeEvent) => {
        theme = e.theme;
        flowTree.render(theme, root);
        toolbox.render(theme, descriptors);
        flowDiagramElement.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';
        if (flowDiagram) {
            flowDiagram.render(theme, flowDiagram.flow, flowDiagram.name, instance, step, animate, instanceEdit);
        }
    });

    // avoid resize when collapse
    flowTreeElement.style.width = flowTreeElement.style.minWidth = flowTreeElement.style.maxWidth = (flowTreeElement.offsetWidth - 2) + 'px';

    const containerElement = document.getElementById('flow-container') as HTMLDivElement;

    let isLeftSplitterDrag = false;
    let isRightSplitterDrag = false;

    const isLeftSplitterHover = (e: MouseEvent): boolean => {
        const flowTreeWidth = flowTreeElement.offsetWidth - 2;
        const x = e.clientX - containerElement.getBoundingClientRect().left;
        return (Math.abs(x - flowTreeWidth) <= 3);
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
            const x = e.clientX - containerElement.getBoundingClientRect().left;
            flowTreeElement.style.width = flowTreeElement.style.minWidth = flowTreeElement.style.maxWidth = x + 'px';
        } else if (isRightSplitterDrag) {
            e.preventDefault();
            document.body.style.cursor = 'ew-resize';
            const x = e.clientX - containerElement.getBoundingClientRect().left;
            toolboxElement.style.width = toolboxElement.style.minWidth = toolboxElement.style.maxWidth = (containerElement.offsetWidth - x) + 'px';
        } else {
            if (e.buttons === 0 && (isLeftSplitterHover(e) || isRightSplitterHover(e))) {
                document.body.style.cursor = 'ew-resize';
            }
        }
    };
});
