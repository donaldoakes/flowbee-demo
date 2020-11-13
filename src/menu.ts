import * as flowbee from 'flowbee';
import { Step } from 'flowbee';
import { Options } from './options';

export class MenuProvider extends flowbee.DefaultMenuProvider {

    constructor(flowDiagram: flowbee.FlowDiagram, readonly options: Options) {
        super(flowDiagram);
    }

    getItems(flowElementEvent: flowbee.FlowElementEvent): flowbee.MenuItem[] | undefined {
        const items = super.getItems(flowElementEvent) || [];
        items.unshift({ id: 'configure', label: 'Configure' });
        return items;
    }

    async onSelectItem(selectEvent: flowbee.ContextMenuSelectEvent): Promise<boolean> {
        if (!super.onSelectItem(selectEvent)) {
            if (selectEvent.item.id === 'configure') {
                const flowElement = selectEvent.element || this.flowDiagram.flow;
                let template = '';
                if (flowElement.type === 'step' && (flowElement as Step).path === 'request.ts') {
                    template = await (await fetch('/templates/request.yaml')).text();
                }
                this.show(flowElement, template);
                return true;
            }
        }
    }

    private static configurator: flowbee.Configurator | undefined = undefined;
    show(flowElement: flowbee.FlowElement, template: string) {
        if (!MenuProvider.configurator) {
            MenuProvider.configurator = new flowbee.Configurator();
            // TODO: flowbee will embed this icon
            for (const toolIcon of (document.querySelectorAll('input[type=image]') as any)) {
                if (!toolIcon.getAttribute('src') && toolIcon.hasAttribute('data-icon')) {
                    const icon = toolIcon.getAttribute('data-icon') as string;
                    toolIcon.setAttribute('src', `img/${icon}`);
                }
            }

        }
        MenuProvider.configurator.render(flowElement, template, this.options.configuratorOptions);
    }
}