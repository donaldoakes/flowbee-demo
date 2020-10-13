import { Descriptors } from './descriptors';
import { Flows } from './flows';
import { Toolbox } from './toolbox';
import { isPropertyAccessOrQualifiedName } from 'typescript';

window.addEventListener('load', async () => {
    const base = '';
    const dark = false;
    // prime the descriptors
    await Descriptors.getDescriptors(base);
    await new Flows(base).render(dark);
    await new Toolbox(base).render(dark);

    const container = document.getElementById('flow-container') as HTMLDivElement;
    const flowTree = document.getElementById('flow-tree') as HTMLDivElement;
    const toolbox = document.getElementById('flow-toolbox') as HTMLDivElement;

    // avoid resize when collapse
    flowTree.style.width = flowTree.style.minWidth = flowTree.style.maxWidth = (flowTree.offsetWidth - 2) + 'px';

    let isLeftSplitterDrag = false;
    let isRightSplitterDrag = false;

    const isLeftSplitterHover = (e: MouseEvent): boolean => {
        const flowTreeWidth = flowTree.offsetWidth - 2;
        const x = e.clientX - container.getBoundingClientRect().left;
        return (Math.abs(x - flowTreeWidth) <= 2);
    };
    const isRightSplitterHover = (e: MouseEvent): boolean => {
        const toolboxWidth = toolbox.offsetWidth - 2;
        const x = e.clientX - container.getBoundingClientRect().left;
        return (Math.abs(x - (container.offsetWidth - toolboxWidth)) <= 3);
    };

    container.onmousedown = (e: MouseEvent) => {
        isLeftSplitterDrag = isLeftSplitterHover(e);
        isRightSplitterDrag = isRightSplitterHover(e);
    };
    container.onmouseup = (e: MouseEvent) => {
        isLeftSplitterDrag = isRightSplitterDrag = false;
        document.body.style.cursor = 'default';
    };
    container.onmouseout = (e: MouseEvent) => {
        if (!isLeftSplitterDrag && !isRightSplitterDrag) {
            document.body.style.cursor = 'default';
        }
    };
    container.onmousemove = (e: MouseEvent) => {
        if (isLeftSplitterDrag) {
            e.preventDefault();
            document.body.style.cursor = 'ew-resize';
            const x = e.clientX - container.getBoundingClientRect().left - 8;
            flowTree.style.width = flowTree.style.minWidth = flowTree.style.maxWidth = x + 'px';
        } else if (isRightSplitterDrag) {
            e.preventDefault();
            document.body.style.cursor = 'ew-resize';
            const x = e.clientX - container.getBoundingClientRect().left + 8;
            toolbox.style.width = toolbox.style.minWidth = toolbox.style.maxWidth = (container.offsetWidth - x) + 'px';
        } else {
            if (isLeftSplitterHover(e) || isRightSplitterHover(e)) {
                document.body.style.cursor = 'ew-resize';
            } else {
                document.body.style.cursor = 'default';
            }
        }
    };
});
