import * as flowbee from 'flowbee';

export class Storage {

    constructor(readonly path: string) {}

    loadFlows(): flowbee.FileTree[] {
        const flows: flowbee.FileTree[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`${this.path}/`)) {
                const name = key.substring(this.path.length + 1);
                flows.push({
                    path: `${this.path}/${name}`,
                    name,
                    type: 'file'
                });

            }
        }
        return flows;
    }

    isLocal(flowPath: string): boolean {
        return flowPath.startsWith(`${this.path}/`);
    }

    loadFlow(flowPath: string): string {
        return localStorage.getItem(flowPath);
    }
    saveFlow(name: string, contents: string): string {
        if (!name.endsWith('.flow')) {
            name += '.flow';
        }
        console.debug(`save: ${this.path}/${name}`);
        localStorage.setItem(`${this.path}/${name}`, contents);
        return `${this.path}/${name}`; // new path
    }

    loadValues(flowPath: string) {
        return localStorage.getItem(`-values-${flowPath}`);
    }
    saveValues(flowPath: string, values: string) {
        localStorage.setItem(`-values-${flowPath}`, values);
    }
}