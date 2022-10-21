import { webcrypto } from 'crypto';
import fs from 'fs';
import csv from 'fast-csv';
import ObjectsToCsv from 'objects-to-csv';

import { WALLETS_FILE_PATH } from '../../constants.js';

export function generateRandomHex(bits) {
  const byteLen = bits / 8;

  const randomBytes = Array.from(
    webcrypto.getRandomValues(new Uint8Array(byteLen)),
  );

  const hexBytes = randomBytes.map((byte) => byte.toString(16).padStart(2, '0'));

  return `0x${hexBytes.join('')}`;
}

export async function readWalletsFromCsv() {
  const data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(WALLETS_FILE_PATH)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => reject(error))
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data));
  });
}

export async function writeWalletsToCsv(wallets) {
  const newCsv = new ObjectsToCsv(wallets);
  await newCsv.toDisk(WALLETS_FILE_PATH);
}
