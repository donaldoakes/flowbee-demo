export class Splitters {

    constructor(
        readonly flowTreeElement: HTMLDivElement,
        readonly toolboxElement: HTMLDivElement
    ) {
        // avoid resize when collapse
        this.flowTreeElement.style.width = this.flowTreeElement.style.minWidth = this.flowTreeElement.style.maxWidth = (this.flowTreeElement.offsetWidth - 2) + 'px';

        const containerElement = document.getElementById('flow-container') as HTMLDivElement;

        let isLeftSplitterDrag = false;
        let isRightSplitterDrag = false;

        const isLeftSplitterHover = (e: MouseEvent): boolean => {
            const flowTreeWidth = this.flowTreeElement.offsetWidth - 2;
            const x = e.clientX - containerElement.getBoundingClientRect().left;
            return (Math.abs(x - flowTreeWidth) <= 3);
        };
        const isRightSplitterHover = (e: MouseEvent): boolean => {
            const toolboxWidth = this.toolboxElement.offsetWidth - 2;
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
        containerElement.onmouseleave = (e: MouseEvent) => {
            if (!isLeftSplitterDrag && !isRightSplitterDrag) {
                document.body.style.cursor = 'default';
            }
        };
        containerElement.onmousemove = (e: MouseEvent) => {
            if (isLeftSplitterDrag) {
                e.preventDefault();
                document.body.style.cursor = 'ew-resize';
                const x = e.clientX - containerElement.getBoundingClientRect().left;
                this.flowTreeElement.style.width = this.flowTreeElement.style.minWidth = this.flowTreeElement.style.maxWidth = x + 'px';
            } else if (isRightSplitterDrag) {
                e.preventDefault();
                document.body.style.cursor = 'ew-resize';
                const x = e.clientX - containerElement.getBoundingClientRect().left;
                this.toolboxElement.style.width = this.toolboxElement.style.minWidth = this.toolboxElement.style.maxWidth = (containerElement.offsetWidth - x) + 'px';
            } else {
                if (e.buttons === 0 && (isLeftSplitterHover(e) || isRightSplitterHover(e))) {
                    document.body.style.cursor = 'ew-resize';
                }
            }
        };
    }
}
