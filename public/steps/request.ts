import { step, exec } from '../../src/decorator/step.ts';
import { StepContext } from '../../src/runtime/context.ts';

@step('Request')
export class Request {

    // @icon
    // icon: string = 'dummy.png';

    @exec
    async doFetch(context: StepContext) {
        console.log(`Running step: { name: ${context.step.name} }`);

        const movies = await (await fetch('https://ply-ct.com/movies')).json();

        console.log("MOVIE COUNT: " + movies.movies.length);

    }

}