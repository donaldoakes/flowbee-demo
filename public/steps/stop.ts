import { step, exec } from '../../src/decorator/step.ts';
import { StepContext } from '../../src/runtime/context.ts';

@step('Stop')
export class Stop {

    // @icon
    // icon: string = 'stop.png';

    @exec
    stopFlow(context: StepContext) {
        console.info(`Stopping flow: { name: ${context.step.name} }`);
    }

}