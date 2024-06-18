import { toNano } from '@ton/core';
import { FuncBlueprintTutorial3 } from '../wrappers/FuncBlueprintTutorial3';
import { compile, NetworkProvider, sleep } from '@ton/blueprint';
import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';

export async function run(provider: NetworkProvider, args: string[]) {
    const mnemonics = await mnemonicNew();
    const keyPair = await mnemonicToPrivateKey(mnemonics);
    const funcBlueprintTutorial3 = provider.open(
        FuncBlueprintTutorial3.createFromConfig(
            {
                seqno: 0,
                publicKey: keyPair.publicKey,
                ownerAddress: provider.sender().address!,
            },
            await compile('FuncBlueprintTutorial3'),
        ),
    );
    const ui = provider.ui();
    // const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Smc address'));
    // const funcBlueprintTutorial3 = provider.open(FuncBlueprintTutorial3.createFromAddress(address));
    await funcBlueprintTutorial3.sendDeploy(provider.sender(), { value: toNano(0.05) });
    await provider.waitForDeploy(funcBlueprintTutorial3.address);
    // run methods on `funcBlueprintTutorial3`

    const balanceBefore = await funcBlueprintTutorial3.getSMCBalance();
    await funcBlueprintTutorial3.sendDeposit(provider.sender(), { value: toNano(1) });
    let balanceAfter = await funcBlueprintTutorial3.getSMCBalance();
    let attempt = 1;
    while (balanceAfter === balanceBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        balanceAfter = await funcBlueprintTutorial3.getSMCBalance();
        attempt++;
    }
    ui.clearActionPrompt();
    ui.write('Balance increased successfully!');
}
