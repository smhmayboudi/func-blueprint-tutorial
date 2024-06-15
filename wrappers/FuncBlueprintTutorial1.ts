import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type FuncBlueprintTutorial1Config = {
    num: number;
};

export function funcBlueprintTutorial1ConfigToCell(config: FuncBlueprintTutorial1Config): Cell {
    return beginCell().storeUint(config.num, 32).endCell();
}

export class FuncBlueprintTutorial1 implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address): FuncBlueprintTutorial1 {
        return new FuncBlueprintTutorial1(address);
    }

    static createFromConfig(config: FuncBlueprintTutorial1Config, code: Cell, workchain = 0): FuncBlueprintTutorial1 {
        const data = funcBlueprintTutorial1ConfigToCell(config);
        const init = { code, data };
        const address = contractAddress(workchain, init);
        return new FuncBlueprintTutorial1(address, init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint): Promise<void> {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendIncNum(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
        opts: {
            num: number;
        },
    ): Promise<void> {
        const body = beginCell().storeUint(opts.num, 32).endCell();
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body,
        });
    }

    async getNum(provider: ContractProvider): Promise<number> {
        const { stack } = await provider.get('get_num', []);
        return stack.readNumber();
    }
}
