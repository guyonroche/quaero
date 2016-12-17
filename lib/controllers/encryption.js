'use strict';

const crypto = require('crypto');
const Promish = require('promish');

const HASH_ALGORITHM = 'sha512';
const SALT_LENGTH = 64;
const KEY_LENGTH = 64;
const HASH_ROUNDS = 500000;

const ENCRYPT_ALGORITHM = 'aes-256-ctr';

function hash(password, salt, rounds, keyLength, algorithm) {
  return new Promish((resolve, reject) => {
    crypto.pbkdf2(password, salt, rounds, keyLength, algorithm, (pError, hash) => {
      if (pError) {
        return reject(pError);
      }
      hash = hash.toString('hex');
      resolve(hash);
    });
  });
}

class Encryption {
  static encrypt(text, key) {
    return new Promish((resolve, reject) => {
      const encrypted = [];
      const cipher = crypto.createCipher(ENCRYPT_ALGORITHM, key);
      cipher.on('readable', () => {
        const data = cipher.read();
        if (data) {
          encrypted.push(data.toString('hex'));
        }
      });
      cipher.on('error', reject);
      cipher.on('end', () => resolve(encrypted.join('')));
      cipher.write(text);
      cipher.end();
    });
  }

  static decrypt(text, key) {
    return new Promish((resolve, reject) => {
      const decrypted = [];
      const decipher = crypto.createDecipher(ENCRYPT_ALGORITHM, key);
      decipher.on('readable', () => {
        const data = decipher.read();
        if (data) {
          decrypted.push(data.toString('utf8'));
        }
      });
      decipher.on('error', reject);
      decipher.on('end', () => resolve(decrypted.join('')));
      decipher.write(text, 'hex');
      decipher.end();
    });
  }

  static generateRandomString(length) {
    return new Promish((resolve, reject) => {
      crypto.randomBytes(length, (rError, bytes) => {
        if (rError) {
          return reject(rError);
        }
        resolve(bytes.toString('hex'));
      });
    });
  }

  static hashPassword(password) {
    return this.generateRandomString(SALT_LENGTH)
      .then(salt => {
        return hash(password, salt, HASH_ROUNDS, KEY_LENGTH, HASH_ALGORITHM)
          .then(hashed => `${HASH_ALGORITHM}-${HASH_ROUNDS}-${KEY_LENGTH}-${salt}-${hashed}`);
      });
  }

  static checkPassword(password, passwordHash) {
    const parts = passwordHash.split('-');
    const algorithm = parts[0];
    const rounds = parseInt(parts[1]);
    const keyLength = parseInt(parts[2]);
    const salt = parts[3];
    const hashed = parts[4];

    return hash(password, salt, rounds, keyLength, algorithm)
      .then(hashed2 => hashed === hashed2);
  }
}

module.exports = Encryption;