import { step, exec } from '../../src/decorator/step.ts';
import { StepContext } from '../../src/runtime/context.ts';

@step('Request', 'request.svg')
export class Request {

    @exec
    async doFetch(context: StepContext) {
        console.log(`Running step: { name: ${context.step.name} }`);

        let url = context.attributes?.url;
        if (!url) throw new Error('Missing attribute: "url"');
        url = context.replace(url);

        let method = context.attributes?.method;
        if (!method) throw new Error('Missing attribute: "method"');
        method = context.replace(method);

        let body = context.attributes?.body;
        if (body) body = context.replace(body);

        const headers: {[key: string]: string} = {};
        if (context.attributes?.headers) {
            const rows = JSON.parse(context.attributes.headers);
            for (const row of rows) {
                headers[row[0]] = context.replace(row[1]);
            }
        }

        console.debug(`Submitting ${method} request to: ${url}`);

        const fetchOptions: RequestInit = {
            method,
            mode: 'same-origin',
            headers,
            ...(method !== 'GET' && method !== 'DELETE' && body) && { body }
        };

        const json = await (await fetch(`${url}`, fetchOptions)).json();

        console.log(`Response: + ${JSON.stringify(json, null, 2)}`);

    }

}