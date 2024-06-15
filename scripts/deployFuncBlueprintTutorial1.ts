import { toNano } from '@ton/core';
import { FuncBlueprintTutorial1 } from '../wrappers/FuncBlueprintTutorial1';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const funcBlueprintTutorial1 = provider.open(FuncBlueprintTutorial1.createFromConfig({}, await compile('FuncBlueprintTutorial1')));

    await funcBlueprintTutorial1.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(funcBlueprintTutorial1.address);

    // run methods on `funcBlueprintTutorial1`
}
