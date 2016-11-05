'use strict';

var crypto = require('crypto');
var Promish = require('promish');

const HASH_ALGORITHM = 'sha512';
const SALT_LENGTH = 64;
const KEY_LENGTH = 64;
const HASH_ROUNDS = 500000;

const ENCRYPT_ALGORITHM = 'aes-256-ctr';

module.exports = {

  encrypt: function(text, key) {
    return new Promish((resolve, reject) => {
      var encrypted = [];
      var cipher = crypto.createCipher(ENCRYPT_ALGORITHM, key);
      cipher.on('readable', () => {
        var data = cipher.read();
        if (data) {
          encrypted.push(data.toString('hex'));
        }
      });
      cipher.on('error', reject);
      cipher.on('end', () => resolve(encrypted.join('')));
      cipher.write(text);
      cipher.end();
    });
  },
  decrypt: function(text, key) {
    return new Promish((resolve, reject) => {
      var decrypted = [];
      var decipher = crypto.createDecipher(ENCRYPT_ALGORITHM, key);
      decipher.on('readable', () => {
        var data = decipher.read();
        if (data) {
          decrypted.push(data.toString('utf8'));
        }
      });
      decipher.on('error', reject);
      decipher.on('end', () => resolve(decrypted.join('')));
      decipher.write(text, 'hex');
      decipher.end();
    });
  },

  generateRandomString: function(length) {
    return new Promish((resolve, reject) => {
      crypto.randomBytes(length, (rError, bytes) => {
        if (rError) {
          return reject(rError);
        }
        resolve(bytes.toString('hex'));
      });
    });
  },

  _hash: function(password, salt, rounds, keyLength, algorithm) {
    return new Promish((resolve, reject) => {
      crypto.pbkdf2(password, salt, rounds, keyLength, algorithm, (pError, hash) => {
        if (pError) {
          return reject(pError);
        }
        hash = hash.toString('hex');
        resolve(hash);
      });
    });
  },

  hashPassword: function(password) {
    return this.generateRandomString(SALT_LENGTH)
      .then(salt => {
        return this._hash(password, salt, HASH_ROUNDS, KEY_LENGTH, HASH_ALGORITHM)
          .then(hash => `${HASH_ALGORITHM}-${HASH_ROUNDS}-${KEY_LENGTH}-${salt}-${hash}`);
      });
  },
  checkPassword: function(password, passwordHash) {
    var parts = passwordHash.split('-');
    var algorithm = parts[0];
    var rounds = parseInt(parts[1]);
    var keyLength = parseInt(parts[2]);
    var salt = parts[3];
    var hash = parts[4];

    return this._hash(password, salt, rounds, keyLength, algorithm)
      .then(hash2 => hash === hash2);
  }
};