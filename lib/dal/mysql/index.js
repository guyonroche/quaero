'use strict';

var mysql = require('mysql');
var Promish = require('promish');
var uuid = require('uuid');


class MySqlDAL {
  constructor(config) {
    this.config = config;

    this.pool = mysql.createPool({
      connectionLimit: 100,
      host: config.dbHost,
      user: config.dbUsername,
      password: config.dbPassword,
      database: config.dbSchema,
      timezone: 'utc',
      debug: false
    });
  }

  connect() {
    return new Promish((resolve, reject) => {
      this.pool.getConnection((error, connection) => {
        if (error) {
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
        connection.query(sql, params, (error, rows) => {
          if (error) {
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
    return this.execute(sql, [userId]);
  }
  
  getUserByUsername(username) {
    let sql = 'SELECT id as userId, username, password FROM quaero_user WHERE username = ?';
    return this.execute(sql, [username]);
  }

  // ==============================================================================
  // Sessions
  createSession(sid, userId) {
    let sql = 'INSERT into quaero_session SET ?;';
    return this.execute(sql, {sid, userId})
      .then(data => ({userId: data.insertId, username, password}));
  }
  
  getSession(sid) {
    let sql = 'SELECT id, sid, expires, userId FROM quaero_session WHERE sid = ?';
    return this.execute(sql, [sid]);
  }
  getSessionEx(sid) {
    let sql = `
      SELECT
        s.id as id, s.sid as sid, s.expires as expires, s.user_id as userId,
        u.username as username, u.password as password
      FROM quaero_session s, quaero_user u
      WHERE s.sid = ? AND s.user_id = u.id
    `;
    return this.execute(sql, [sid])
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

}