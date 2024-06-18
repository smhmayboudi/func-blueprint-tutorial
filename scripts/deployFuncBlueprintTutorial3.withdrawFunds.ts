import { Address, toNano } from '@ton/core';
import { FuncBlueprintTutorial3 } from '../wrappers/FuncBlueprintTutorial3';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Smart Contract Address'));
    const funcBlueprintTutorial3 = provider.open(FuncBlueprintTutorial3.createFromAddress(address));
    // run methods on `funcBlueprintTutorial3`

    const balanceBefore = await funcBlueprintTutorial3.getSMCBalance();
    await funcBlueprintTutorial3.sendWithdrawFunds(provider.sender(), {
        amount: toNano(1),
        value: toNano(0.05)
    });
    let balanceAfter = await funcBlueprintTutorial3.getSMCBalance();
    let attempt = 1;
    while (balanceAfter === balanceBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        balanceAfter = await funcBlueprintTutorial3.getSMCBalance();
        attempt++;
    }
    ui.clearActionPrompt();
    ui.write('WithdrawFunds successfully!');
}
