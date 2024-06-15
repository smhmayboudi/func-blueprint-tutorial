import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, Cell, toNano } from '@ton/core';
import { FuncBlueprintTutorial3 } from '../wrappers/FuncBlueprintTutorial3';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('FuncBlueprintTutorial3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('FuncBlueprintTutorial3');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let funcBlueprintTutorial3: SandboxContract<FuncBlueprintTutorial3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        funcBlueprintTutorial3 = blockchain.openContract(
            FuncBlueprintTutorial3.createFromConfig(
                {
                    seqno: 0,
                    publicKey: Buffer.alloc(256),
                    ownerAddress: deployer.address,
                },
                code,
            ),
        );
        const deployResult = await funcBlueprintTutorial3.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: funcBlueprintTutorial3.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and funcBlueprintTutorial3 are ready to use
    });

    it('deposite', async () => {
        const senderWallet = await blockchain.treasury('sender');
        const result = await funcBlueprintTutorial3.sendDeposit(senderWallet.getSender(), toNano(0.05));
        expect(result.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: funcBlueprintTutorial3.address,
            success: true,
        });
    });

    it('get_seqno', async () => {
        const sqeno = await funcBlueprintTutorial3.getSeqno();
        expect(sqeno).toEqual(1);
    });

    it('get_public_key', async () => {
        const publicKey = await funcBlueprintTutorial3.getPublicKey();
        expect(publicKey).toEqual(Buffer.alloc(256));
    });

    it('get_owner', async () => {
        const ownerAddress = await funcBlueprintTutorial3.getOwnerAddress();
        expect(ownerAddress).toEqual(deployer.address);
    });
});
