import * as flowbee from 'flowbee';
import { Descriptors } from './descriptors';
import { Actions, ThemeChangeEvent } from './actions';
import { Splitters } from './splitters';

window.addEventListener('load', async () => {
    const base = '';
    const readonly = false;
    let theme = 'light';
    let flowDiagram: flowbee.FlowDiagram;

    const instance = undefined;
    const step: string | undefined = undefined;
    const animate = false;
    const editInstanceId: string | undefined = undefined;

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
        flowDiagram.render(theme, text, selectEvent.name, instance, step, animate, editInstanceId);
    });

    const flowDiagramElement = document.getElementById('flow-diagram') as HTMLDivElement;
    flowDiagramElement.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';
    const toolboxElement = document.getElementById('flow-toolbox') as HTMLDivElement;
    const toolboxOptions = { iconBase: `${base}/icons` };
    const toolbox = await new flowbee.Toolbox(toolboxElement, toolboxOptions);
    toolbox.render(theme, descriptors);

    new Splitters(flowTreeElement, toolboxElement);

    const actions = new Actions(document.getElementById('actions'));
    actions.onThemeChange((e: ThemeChangeEvent) => {
        theme = e.theme;
        flowTree.render(theme, root);
        toolbox.render(theme, descriptors);
        flowDiagramElement.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : '#ffffff';
        if (flowDiagram) {
            flowDiagram.render(theme, flowDiagram.flow, flowDiagram.name, instance, step, animate, editInstanceId);
        }
    });

});
