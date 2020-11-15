import * as flowbee from 'flowbee';
import { Step } from 'flowbee';
import { Options } from './options';

export class MenuProvider extends flowbee.DefaultMenuProvider {

    constructor(
        readonly flowDiagram: flowbee.FlowDiagram,
        readonly options: Options,
        readonly configurator: flowbee.Configurator
    ) {
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
                let template = '{}';
                if (flowElement.type === 'step' && (flowElement as Step).path === 'request.ts') {
                    template = await (await fetch('/templates/request.yaml')).text();
                }
                this.configurator.render(flowElement, template, this.options.configuratorOptions);
                return true;
            }
        }
    }
}