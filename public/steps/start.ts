import { step, exec } from '../../src/decorator/step.ts';
import { StepContext } from '../../src/runtime/context.ts';

@step('Start', 'shape:start')
export class Start {

    @exec
    startFlow(context: StepContext) {
        console.info(`Starting flow: ${context.step.name}`);
    }

}