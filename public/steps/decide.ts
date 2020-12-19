import { step, exec } from '../../src/decorator/step.ts';
import { StepContext } from '../../src/runtime/context.ts';

@step('Decision', 'shape:decision')
export class Decision {

    @exec
    decide(context: StepContext) {
        console.log(`Running step: { name: ${context.step.name} }`);
        console.log("EVALUATING: " + JSON.stringify(context.flowContext.values));
        return context.flowContext.values?.testCase;
    }

}