import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type FuncBlueprintTutorial1Config = {};

export function funcBlueprintTutorial1ConfigToCell(config: FuncBlueprintTutorial1Config): Cell {
    return beginCell().endCell();
}

export class FuncBlueprintTutorial1 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new FuncBlueprintTutorial1(address);
    }

    static createFromConfig(config: FuncBlueprintTutorial1Config, code: Cell, workchain = 0) {
        const data = funcBlueprintTutorial1ConfigToCell(config);
        const init = { code, data };
        return new FuncBlueprintTutorial1(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
