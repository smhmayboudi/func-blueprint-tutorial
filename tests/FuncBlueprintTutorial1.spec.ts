import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { FuncBlueprintTutorial1 } from '../wrappers/FuncBlueprintTutorial1';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('FuncBlueprintTutorial1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('FuncBlueprintTutorial1');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let funcBlueprintTutorial1: SandboxContract<FuncBlueprintTutorial1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        funcBlueprintTutorial1 = blockchain.openContract(FuncBlueprintTutorial1.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await funcBlueprintTutorial1.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: funcBlueprintTutorial1.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and funcBlueprintTutorial1 are ready to use
    });
});
