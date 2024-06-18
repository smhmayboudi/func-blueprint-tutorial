import { Address, toNano } from '@ton/core';
import { FuncBlueprintTutorial3 } from '../wrappers/FuncBlueprintTutorial3';
import { NetworkProvider } from '@ton/blueprint';
import { mnemonicNew, mnemonicToPrivateKey, sign } from '@ton/crypto';
import { opCodes } from '../wrappers/OPCodes';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Smart Contract Address'));
    const funcBlueprintTutorial3 = provider.open(FuncBlueprintTutorial3.createFromAddress(address));
    // run methods on `funcBlueprintTutorial3`

    const seqno = await funcBlueprintTutorial3.getSeqno();
    const mnemonics = await mnemonicNew();
    const keyPair = await mnemonicToPrivateKey(mnemonics);

    const newOwnerAddress = Address.parse(args.length > 0 ? args[0] : await ui.input('New Owner Address'));
    await funcBlueprintTutorial3.sendExternalMessage({
        opCode: opCodes.selfDestruct,
        seqno,
        signFunc: (buf) => sign(buf, keyPair.secretKey),
    });
    ui.write('ChangeOwnerAddress successfully!');
}
