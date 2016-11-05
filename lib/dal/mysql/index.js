'use strict';

var mysql = require('mysql');
var Promish = require('promish');
var uuid = require('uuid');


class MySqlDAL {
  constructor(config) {
    this.config = config;
    
    this.pool = mysql.createPool({
      connectionLimit: 100,
      host: config.host,
      user: config.username,
      password: config.password,
      database: config.schema,
      timezone: 'utc',
      debug: false
    });
  }

  connect() {
    return new Promish((resolve, reject) => {
      this.pool.getConnection((error, connection) => {
        if (error) {
          console.error('Error getting connection', error.stack)
          reject(error);
        } else {
          resolve(connection);
        }
      });
    });
  }
  
  execute(sql, params) {
    params = params || [];
    return this.connect()
      .then(connection => new Promish((resolve, reject) => {
        console.log(sql);
        console.log(params);
        connection.query(sql, params, (error, rows) => {
          if (error) {
            console.error('Error executing command', error.stack)
            reject(error);
          } else {
            resolve(rows);
          }
        });
      }));
  }
  selectOne(sql, params) {
    return this.execute(sql, params)
      .then(rows => rows.length && rows[0] || null);
  }
  selectScalar(sql, params, name) {
    return this.selectOne(sql, params)
      .then(row => row && row[name]);
  }
  selectCount(sql, params) {
    let sqlCount = `select count(*) as count from ( ${sql} ) as counter`;
    return this.selectScalar(sqlCount, params, 'count');
  }

  // ==============================================================================
  // Users
  createUser(username, password) {
    let sql = 'INSERT INTO quaero_user SET ?;';
    return this.execute(sql, {username, password})
      .then(data => ({userId: data.insertId, username, password}));
  }
  
  getUser(userId) {
    let sql = 'SELECT id as userId, username, password FROM quaero_user WHERE id = ?';
    return this.selectOne(sql, [userId]);
  }
  
  getUserByUsername(username) {
    let sql = 'SELECT id as userId, username, password FROM quaero_user WHERE username = ?';
    return this.selectOne(sql, [username]);
  }

  // ==============================================================================
  // Sessions
  createSession(sid, user_id, expires) {
    let sql = 'INSERT into quaero_session SET ?;';
    return this.execute(sql, {sid, user_id, expires})
      .then(data => ({id: data.insertId, userId: user_id, sid, expires}));
  }
  
  getSession(sid) {
    let sql = 'SELECT id, sid, expires, userId FROM quaero_session WHERE sid = ?';
    return this.selectOne(sql, [sid]);
  }
  getSessionEx(sid) {
    let sql = `
      SELECT
        s.id as id, s.sid as sid, s.expires as expires, s.user_id as userId,
        u.username as username, u.password as password
      FROM quaero_session s, quaero_user u
      WHERE s.sid = ? AND s.user_id = u.id
    `;
    return this.selectOne(sql, [sid])
      .then(row => ({
        id: row.id,
        sid: row.sid,
        user: {
          userId: row.userId,
          username: row.username,
          password: row.password
        }
      }));
  }

  updateSessionExpiry(sid, expires) {
    let sql = `
      UPDATE quaero_session
      SET expires = ?
      WHERE sid = ?`;
    return this.execute(sql, [sid, expires]);
  }

  deleteExpiredSessions(userId, dt) {
    let sql = 'DELETE FROM quaero_session where user_id = ? AND expires < ?';
    return this.execute(sql, [userId, dt]);
  }

  deleteSession(sid) {
    let sql = 'DELETE FROM quaero_session where sid = ?';
    return this.execute(sql, [sid]);
  }
}

module.exports = MySqlDAL;