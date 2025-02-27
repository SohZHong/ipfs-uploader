import { PinataSDK } from 'pinata-web3';

const PINATA_JWT = String(process.env.PINATA_JWT || '');

// Validate that all required environment variables are set
if (!PINATA_JWT) {
  throw new Error(
    `Missing required environment variables: ${
      !PINATA_JWT ? 'PINATA_JWT, ' : ''
    }`
  );
}

export const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: 'orange-odd-wolf-595.mypinata.cloud',
});
