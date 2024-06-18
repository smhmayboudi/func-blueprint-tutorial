import { Address, toNano } from '@ton/core';
import { FuncBlueprintTutorial3 } from '../wrappers/FuncBlueprintTutorial3';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Smart Contract Address'));
    const funcBlueprintTutorial3 = provider.open(FuncBlueprintTutorial3.createFromAddress(address));
    // run methods on `funcBlueprintTutorial3`

    await funcBlueprintTutorial3.sendMessageToOwner(provider.sender(), { value: toNano(0.05) });
    ui.write('MessageToOwner successfully!');
}
