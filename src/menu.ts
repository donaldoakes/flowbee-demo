import * as flowbee from 'flowbee';
import MicroModal from 'micromodal';
import { Options } from './options';

export class MenuProvider extends flowbee.DefaultMenuProvider {

    constructor(flowDiagram: flowbee.FlowDiagram, readonly options: Options) {
        super(flowDiagram);
    }

    getItems(flowElementEvent: flowbee.FlowElementEvent): flowbee.MenuItem[] | undefined {
        const items = super.getItems(flowElementEvent) || [];
        items.unshift({ id: 'viewObject', label: 'View Object' });
        return items;
    }

    onSelectItem(selectEvent: flowbee.ContextMenuSelectEvent): boolean {
        if (!super.onSelectItem(selectEvent)) {
            if (selectEvent.item.id === 'viewObject') {
                const flowElement = selectEvent.element || this.flowDiagram.flow;
                const name = (flowElement as any).name || flowElement.id || this.flowDiagram.flowName;
                document.getElementById('popup-title').innerHTML = `"${name}" properties`;
                const popupText = document.getElementById('popup-text') as HTMLTextAreaElement;
                popupText.setAttribute('readonly', 'true');
                const popupOk = document.getElementById('popup-ok');
                popupOk.style.display = 'none';
                const obj = selectEvent.instances ? selectEvent.instances[0] : flowElement;
                popupText.value = obj ? JSON.stringify(obj, null, this.options.indent): '';
                MicroModal.show('popup');
                return true;
            }
        }
    }
}