import { crc32 } from './crc32';

export const errorCodes = {
    unknown_op: 0xffff,
    unknown_owner_address: crc32('error::unknown_owner_address'),
};
