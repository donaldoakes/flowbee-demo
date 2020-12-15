import { step, exec } from '../../src/decorator/step.ts';
import { StepContext } from '../../src/runtime/context.ts';

@step('Dummy Step' /*, 'dummy.png'*/)
export class Dummy {

    // @icon
    // icon: string = 'dummy.png';

    @exec
    logInfo(context: StepContext) {
        console.log(`Running step: { name: ${context.step.name} }`);
    }

}