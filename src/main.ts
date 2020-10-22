import * as flowbee from 'flowbee';
import MicroModal from 'micromodal';
import { Descriptors } from './descriptors';
import { DrawingActions, ThemeChangeEvent, OptionToggleEvent, FlowActions, FlowActionEvent } from './actions';
import { Splitters } from './splitters';
import { Options } from './options';
import { Storage } from './storage';

window.addEventListener('load', async () => {
    const base = '';
    const options = new Options(base);
    const readonly = false;
    const flowbizBase = 'http://localhost:8080';
    let flowPath: string;
    let flowDiagram: flowbee.FlowDiagram;
    const storage = new Storage(options.storagePath);

    const instance = undefined;
    const step: string | undefined = undefined;
    const animate = false;
    const editInstanceId: string | undefined = undefined;

    const descriptors = await Descriptors.getDescriptors(base);

    const drawingActions = new DrawingActions(document.getElementById('drawing-actions'));
    const flowActions = new FlowActions(document.getElementById('flow-actions'));

    const flowTreeElement = document.getElementById('flow-tree') as HTMLDivElement;
    const root = await (await fetch(`${base}/flows`)).json() as flowbee.FileTree;
    const localFlows = storage.loadFlows();
    if (localFlows.length > 0) {
        root.children.unshift({
            path: 'localStorage',
            name: 'localStorage',
            children: localFlows,
            type: 'directory'
        });
    }

    const flowTree = new flowbee.FlowTree(root, flowTreeElement);
    flowTree.render(options.flowTreeOptions);
    flowTree.onFlowSelect(async (selectEvent: flowbee.FlowTreeSelectEvent) => {
        const canvasElement = document.getElementById('diagram-canvas') as HTMLCanvasElement;
        let text: string;
        if (storage.isLocal(selectEvent.path)) {
            text = storage.loadFlow(selectEvent.path);

        } else {
            text = await (await fetch(selectEvent.path)).text();
        }
        flowPath = selectEvent.path;
        console.debug(`rendering ${flowPath} to canvas`);
        flowDiagram = new flowbee.FlowDiagram(text, canvasElement, flowPath, descriptors);
        flowDiagram.readonly = readonly;
        flowDiagram.instance = instance;
        flowDiagram.step = step;
        flowDiagram.editInstanceId = editInstanceId;
        flowDiagram.render(options.diagramOptions);
        flowActions.enable(true);
    });

    const flowDiagramElement = document.getElementById('flow-diagram') as HTMLDivElement;
    flowDiagramElement.style.backgroundColor = options.theme === 'dark' ? '#1e1e1e' : '#ffffff';
    const toolboxElement = document.getElementById('flow-toolbox') as HTMLDivElement;
    const toolbox = new flowbee.Toolbox(descriptors, toolboxElement);
    toolbox.render(options.toolboxOptions);

    new Splitters(flowTreeElement, toolboxElement);

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

    flowActions.onFlowAction((e: FlowActionEvent) => {
        const flowAction = e.action;
        if (flowDiagram) {
            let name = flowDiagram.flowName;
            if (flowAction === 'save') {
                if (!storage.isLocal(flowPath)) {
                    name = prompt('Save in localStorage as:');
                }
                if (name) {
                    const contents = options.yaml ? flowDiagram.toYaml(options.indent) : flowDiagram.toJson(options.indent);
                    storage.saveFlow(name, contents);
                }
            } else if (flowAction === 'run') {
                document.getElementById('popup-title').innerHTML = `Run ${name}`;
                const popupText = document.getElementById('popup-text') as HTMLTextAreaElement;
                popupText.setAttribute('placeholder', 'Values JSON');
                const popupOk = document.getElementById('popup-ok');
                popupOk.innerHTML = 'Run';
                popupOk.onclick = async (e: MouseEvent) => {
                    const url = `${flowbizBase}/runs${flowPath}`;
                    const body = popupText.value ? `{ "values": ${popupText.value} }` : '{}';
                    const resp = await fetch(url, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body
                    });
                    if (resp.ok) {
                        console.info(`Run success: flowInstance ID = ${(await resp.json()).id}`);
                        MicroModal.close('popup');
                    } else {
                        // TODO error handling
                    }
                };
                MicroModal.show('popup');
            }
        }
    });

    MicroModal.init();
});
