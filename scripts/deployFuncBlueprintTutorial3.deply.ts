import { toNano } from '@ton/core';
import { FuncBlueprintTutorial3 } from '../wrappers/FuncBlueprintTutorial3';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const funcBlueprintTutorial3 = provider.open(
        FuncBlueprintTutorial3.createFromConfig(
            {
                seqno: 0,
                publicKey: Buffer.alloc(256),
                ownerAddress: provider.sender().address!,
            },
            await compile('FuncBlueprintTutorial3'),
        ),
    );
    await funcBlueprintTutorial3.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(funcBlueprintTutorial3.address);
    // run methods on `funcBlueprintTutorial3`
}
