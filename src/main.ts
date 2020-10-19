import * as flowbee from 'flowbee';
import { Descriptors } from './descriptors';
import { DrawingActions, ThemeChangeEvent, OptionToggleEvent, FlowActions, FlowActionEvent } from './actions';
import { Splitters } from './splitters';
import { Options } from './options';

window.addEventListener('load', async () => {
    const base = '';
    const options = new Options(base);
    const readonly = false;
    let flowPath: string;
    let flowDiagram: flowbee.FlowDiagram;

    const instance = undefined;
    const step: string | undefined = undefined;
    const animate = false;
    const editInstanceId: string | undefined = undefined;

    const descriptors = await Descriptors.getDescriptors(base);

    const flowTreeElement = document.getElementById('flow-tree') as HTMLDivElement;
    const root = await (await fetch(`${base}/flows`)).json();
    const flowTree = new flowbee.FlowTree(root, flowTreeElement);
    flowTree.render(options.flowTreeOptions);
    flowTree.onFlowSelect(async (selectEvent: flowbee.FlowTreeSelectEvent) => {
        const canvasElement = document.getElementById('diagram-canvas') as HTMLCanvasElement;
        const text = await (await fetch(selectEvent.path)).text();
        flowPath = selectEvent.path;
        console.debug(`rendering ${flowPath} to canvas`);
        flowDiagram = new flowbee.FlowDiagram(text, canvasElement, flowPath, descriptors);
        flowDiagram.readonly = readonly;
        flowDiagram.instance = instance;
        flowDiagram.step = step;
        flowDiagram.editInstanceId = editInstanceId;
        flowDiagram.render(options.diagramOptions);
    });

    const flowDiagramElement = document.getElementById('flow-diagram') as HTMLDivElement;
    flowDiagramElement.style.backgroundColor = options.theme === 'dark' ? '#1e1e1e' : '#ffffff';
    const toolboxElement = document.getElementById('flow-toolbox') as HTMLDivElement;
    const toolbox = new flowbee.Toolbox(descriptors, toolboxElement);
    toolbox.render(options.toolboxOptions);

    new Splitters(flowTreeElement, toolboxElement);

    const drawingActions = new DrawingActions(document.getElementById('drawing-actions'));
    drawingActions.onThemeChange((e: ThemeChangeEvent) => {
        options.theme = e.theme;
        flowTree.render(options.flowTreeOptions);
        toolbox.render(options.toolboxOptions);
        flowDiagramElement.style.backgroundColor = options.theme === 'dark' ? '#1e1e1e' : '#ffffff';
        if (flowDiagram) {
            flowDiagram.render(options.diagramOptions);
        }
    });
    drawingActions.onOptionToggle((e: OptionToggleEvent) => {
        const drawingOption = e.option;
        document.getElementById(`${drawingOption}`).classList.toggle('unselected');
        options[drawingOption] = !options[drawingOption];
        if (flowDiagram) {
            flowDiagram.render(options.diagramOptions);
        }
    });

    const flowActions = new FlowActions(document.getElementById('flow-actions'));
    flowActions.onFlowAction((e: FlowActionEvent) => {
        const flowAction = e.action;
        if (flowDiagram) {
            if (flowAction === 'save') {
                let name = flowDiagram.flow.name;
                if (!flowPath.startsWith('/flows/_localStorage/')) {
                    name = prompt('Save in _localStorage as:');
                }
                const path = `/flows/_localStorage/${name}`;
                console.debug(`save: ${path}`);
                const contents = options.yaml ? flowDiagram.toYaml(options.indent) : flowDiagram.toJson(options.indent);
                localStorage.setItem(path, contents);
            }
        }
    });
});
