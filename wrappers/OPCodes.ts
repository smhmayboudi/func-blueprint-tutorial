import { crc32 } from './crc32';

export const opCodes = {
    changeOwnerAddress: crc32('op::change_owner_address'),
    deposit: crc32('op::deposit'),
    selfDestruct: crc32('op::self_destruct'),
    transferMSGToOwner: crc32('op::message_to_owner'),
    updateCode: crc32('op::update_code'),
    withdrawFunds: crc32('op::withdraw_funds'),
};
