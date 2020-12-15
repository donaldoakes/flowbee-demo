import { step, exec } from '../../src/decorator/step.ts';
import { StepContext } from '../../src/runtime/context.ts';

@step('Start')
export class Start {

    // @icon
    // icon: string = 'start.png';

    @exec
    startFlow(context: StepContext) {
        console.info(`Starting flow: ${context.step.name}`);
    }

}