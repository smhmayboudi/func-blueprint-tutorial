import { crc32 } from './crc32';

export const opCodes = {
    deposit: crc32('op::deposit'),
    transferMSGToOwner: crc32('op::message_to_owner'),
    changeOwner: crc32('op::change_owner'),
    withdrawFunds: crc32('op::withdraw_funds'),
    updateCode: crc32('op::update_code'),
};
