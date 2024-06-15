import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { FuncBlueprintTutorial3 } from '../wrappers/FuncBlueprintTutorial3';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { mnemonicToPrivateKey } from '@ton/crypto';
import { errorCodes } from '../wrappers/ErrorCodes';

describe('FuncBlueprintTutorial3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('FuncBlueprintTutorial3');
    });

    let publicKey: Buffer;
    let blockchain: Blockchain;
    let owner: SandboxContract<TreasuryContract>;
    let funcBlueprintTutorial3: SandboxContract<FuncBlueprintTutorial3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        owner = await blockchain.treasury('owner');
        const deployer = await blockchain.treasury('deployer');
        const seqno = 0;
        publicKey = (await mnemonicToPrivateKey([''])).publicKey;
        funcBlueprintTutorial3 = blockchain.openContract(
            FuncBlueprintTutorial3.createFromConfig({ seqno, publicKey, ownerAddress: owner.address }, code),
        );
        const deployResult = await funcBlueprintTutorial3.sendDeploy(deployer.getSender(), toNano(0.05));
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
        const sender = await blockchain.treasury('sender');
        const result = await funcBlueprintTutorial3.sendDeposit(sender.getSender(), { value: toNano(0.05) });
        expect(result.transactions).toHaveTransaction({
            from: sender.address,
            to: funcBlueprintTutorial3.address,
            success: true,
        });
    });

    it('message_to_owner', async () => {
        const result = await funcBlueprintTutorial3.sendMessageToOwner(owner.getSender(), {
            value: toNano(0.5),
        });
        expect(result.transactions).toHaveTransaction({
            from: owner.address,
            to: funcBlueprintTutorial3.address,
            success: true,
        });
    });

    it('change_owner_address', async () => {
        const sender = await blockchain.treasury('sender');
        const changeOwnerResult = await funcBlueprintTutorial3.sendChangeOwnerAddress(owner.getSender(), {
            value: toNano(0.5),
            newOwnerAddress: sender.address,
        });
        expect(changeOwnerResult.transactions).toHaveTransaction({
            from: owner.address,
            to: funcBlueprintTutorial3.address,
            success: true,
        });
        const currentOwnerAddress = await funcBlueprintTutorial3.getOwnerAddress();
        expect(currentOwnerAddress).toEqualAddress(sender.address);
    });

    it('change_owner_address NOT', async () => {
        const sender = await blockchain.treasury('sender');
        const changeOwnerResult = await funcBlueprintTutorial3.sendChangeOwnerAddress(sender.getSender(), {
            value: toNano(0.5),
            newOwnerAddress: sender.address,
        });
        expect(changeOwnerResult.transactions).toHaveTransaction({
            from: sender.address,
            to: funcBlueprintTutorial3.address,
            exitCode: errorCodes.unknown_owner_address,
            success: false,
        });
    });

    it('withdraw_funds', async () => {
        const sender = await blockchain.treasury('sender');
        const result = await funcBlueprintTutorial3.sendDeposit(sender.getSender(), { value: toNano(2) });
        expect(result.transactions).toHaveTransaction({
            from: sender.address,
            to: funcBlueprintTutorial3.address,
            success: true,
        });
        const changeOwnerResult = await funcBlueprintTutorial3.sendWithdrawFunds(owner.getSender(), {
            value: toNano(0.5),
            amount: toNano(0.5),
        });
        expect(changeOwnerResult.transactions).toHaveTransaction({
            from: owner.address,
            to: funcBlueprintTutorial3.address,
            success: true,
        });
    });

    it('withdraw_funds MORE', async () => {
        const changeOwnerResult = await funcBlueprintTutorial3.sendWithdrawFunds(owner.getSender(), {
            value: toNano(0.5),
            amount: toNano(100),
        });
        expect(changeOwnerResult.transactions).toHaveTransaction({
            from: owner.address,
            to: funcBlueprintTutorial3.address,
            success: false,
        });
    });

    it('withdraw_funds NOT', async () => {
        const sender = await blockchain.treasury('sender');
        const changeOwnerResult = await funcBlueprintTutorial3.sendWithdrawFunds(sender.getSender(), {
            value: toNano(0.5),
            amount: toNano(1),
        });
        expect(changeOwnerResult.transactions).toHaveTransaction({
            from: sender.address,
            to: funcBlueprintTutorial3.address,
            exitCode: errorCodes.unknown_owner_address,
            success: false,
        });
    });

    it('get_seqno', async () => {
        const sqeno = await funcBlueprintTutorial3.getSeqno();
        expect(sqeno).toEqual(0);
    });

    // it('get_public_key', async () => {
    //     const publicKeyT = await funcBlueprintTutorial3.getPublicKey();
    //     expect(publicKeyT.equals(publicKey)).toBe(true);
    // });

    it('get_owner', async () => {
        const ownerAddress = await funcBlueprintTutorial3.getOwnerAddress();
        expect(ownerAddress.toString()).toEqual(owner.address.toString());
    });

    it('get_smc_balance', async () => {
        const sender = await blockchain.treasury('sender');
        const result = await funcBlueprintTutorial3.sendDeposit(sender.getSender(), { value: toNano(1) });
        expect(result.transactions).toHaveTransaction({
            from: sender.address,
            to: funcBlueprintTutorial3.address,
            success: true,
        });
        const smcBalance = await funcBlueprintTutorial3.getSMCBalance();
        expect(smcBalance).toBeGreaterThan(toNano(0.99));
    });
});
