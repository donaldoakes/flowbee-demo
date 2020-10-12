import { Specs } from './specs';
import { Flows } from './flows';
import { Toolbox } from './toolbox';

window.addEventListener('load', async () => {
    const base = '';
    const dark = false;
    // prime the specs
    await Specs.getSpecs(base);
    new Flows(base).render(dark);
    new Toolbox(base).render(dark);
});
