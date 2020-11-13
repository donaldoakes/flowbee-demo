import * as flowbee from 'flowbee';
import MicroModal from 'micromodal';
import { Descriptors } from './descriptors';
import { DrawingActions, ThemeChangeEvent, OptionToggleEvent, FlowActions, FlowActionEvent } from './actions';
import { Splitters } from './splitters';
import { Options } from './options';
import { Storage } from './storage';
import { MenuProvider } from './menu';
import { Step } from 'flowbee';

// TODO: stub flowbiz api to run in browser (on public site)
window.addEventListener('load', async () => {
    const base = '';
    const flowbizBase = 'http://localhost:8080';
    const webSocketUrl = 'ws://localhost:8080/websocket';
    const options = new Options(base, webSocketUrl);
    const configurator = new flowbee.Configurator();
    // TODO: flowbee will embed this icon
    for (const toolIcon of (document.querySelectorAll('input[type=image]') as any)) {
        if (!toolIcon.getAttribute('src') && toolIcon.hasAttribute('data-icon')) {
            const icon = toolIcon.getAttribute('data-icon') as string;
            toolIcon.setAttribute('src', `img/${icon}`);
        }
    }

    const readonly = false;
    let flowPath: string;
    let flowDiagram: flowbee.FlowDiagram;
    const storage = new Storage(options.storagePath);

    const instance = undefined;
    const step: string | undefined = undefined;
    const editInstanceId: string | undefined = undefined;

    const descriptors = await Descriptors.getDescriptors(base);

    const drawingActions = new DrawingActions(document.getElementById('drawing-actions'));
    const flowActions = new FlowActions(document.getElementById('flow-actions'));

    const flowTreeElement = document.getElementById('flow-tree') as HTMLDivElement;
    const buildFileTree = async () => {
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
        return root;
    };

    const flowTree = new flowbee.FlowTree(await buildFileTree(), flowTreeElement);
    flowTree.render(options.flowTreeOptions);
    flowTree.onFlowSelect(async (selectEvent: flowbee.FlowTreeSelectEvent) => {
        configurator.close();
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
        flowDiagram.contextMenuProvider = new MenuProvider(flowDiagram, options, configurator);
        flowDiagram.onFlowElementSelect(async flowElementSelect => {
            if (flowElementSelect.element && configurator.isOpen) {
                const flowElement = flowElementSelect.element;
                // TODO templates cache (convert existing?)
                let template = '{}';
                if (flowElement?.type === 'step' && (flowElement as Step).path === 'request.ts') {
                    template = await (await fetch('/templates/request.yaml')).text();
                }
                configurator.render(flowElement, template, options.configuratorOptions);
            }
        });
        flowDiagram.onFlowElementUpdate(async flowElementUpdate => {
            const flowElement = flowElementUpdate.element;
            if (configurator.isOpen && configurator.flowElement.id === flowElement.id) {
                // TODO templates cache (convert existing?)
                let template = '{}';
                if (flowElement?.type === 'step' && (flowElement as Step).path === 'request.ts') {
                    template = await (await fetch('/templates/request.yaml')).text();
                }
                configurator.render(flowElement, template, options.configuratorOptions);
            }
        });
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
        if (configurator.isOpen) {
            configurator.render(configurator.flowElement, configurator.template, options.configuratorOptions);
        }
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

    flowActions.onFlowAction(async (e: FlowActionEvent) => {
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
                    flowTree.fileTree = await buildFileTree();
                    flowTree.render(options.flowTreeOptions);
                }
            } else if (flowAction === 'run') {
                document.getElementById('popup-title').innerHTML = `Run ${name}`;
                const popupText = document.getElementById('popup-text') as HTMLTextAreaElement;
                popupText.setAttribute('placeholder', 'Values JSON');
                popupText.removeAttribute('readonly');
                popupText.value = storage.loadValues(flowPath);
                const popupOk = document.getElementById('popup-ok');
                popupOk.style.display = 'inline-block';
                popupOk.innerHTML = 'Run';
                popupOk.onclick = async (e: MouseEvent) => {
                    let body = '{\n}';
                    if (popupText.value) {
                        body = `{\n "values": ${popupText.value}\n  }`;
                        storage.saveValues(flowPath, popupText.value);
                    }
                    let resp = await fetch(`${flowbizBase}/runs${flowPath}`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json', 'X-Flow-Synchronous': 'true' },
                        body
                    });
                    if (resp.ok) {
                        flowDiagram.instance = await resp.json();
                        console.info(`Run success: runId = ${flowDiagram.instance.runId}`);
                        MicroModal.close('popup');
                        resp = await fetch(`${flowbizBase}/instances?runId=${flowDiagram.instance.runId}`);
                        if (resp.ok) {
                            flowDiagram.instance = await resp.json();
                            flowDiagram.render(options.diagramOptions, true);
                        }
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
