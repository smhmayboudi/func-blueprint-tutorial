import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';
import { opCodes } from './OPCodes';

export type FuncBlueprintTutorial3Config = {
    seqno: number;
    publicKey: Buffer;
    ownerAddress: Address;
};

export function funcBlueprintTutorial3ConfigToCell(config: FuncBlueprintTutorial3Config): Cell {
    return beginCell()
        .storeUint(config.seqno, 32)
        .storeBuffer(config.publicKey, 256)
        .storeAddress(config.ownerAddress)
        .endCell();
}

export class FuncBlueprintTutorial3 implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new FuncBlueprintTutorial3(address);
    }

    static createFromConfig(config: FuncBlueprintTutorial3Config, code: Cell, workchain = 0): FuncBlueprintTutorial3 {
        const data = funcBlueprintTutorial3ConfigToCell(config);
        const init = { code, data };
        const address = contractAddress(workchain, init);
        return new FuncBlueprintTutorial3(address, init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint): Promise<void> {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendDeposit(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(opCodes.deposit, 32)
            .endCell(),
        });
    }

    async getSeqno(provider: ContractProvider): Promise<number> {
        const { stack } = await provider.get('get_seqno', []);
        return stack.readNumber();
    }

    async getPublicKey(provider: ContractProvider): Promise<Buffer> {
        const { stack } = await provider.get('get_public_key', []);
        return stack.readBuffer();
    }

    async getOwnerAddress(provider: ContractProvider): Promise<Address> {
        const { stack } = await provider.get('get_owner_address', []);
        return stack.readAddress();
    }
}
