'use strict';

var mysql = require('mysql');
var Promish = require('promish');
var uuid = require('uuid');

const xform = {
  question: ({id, quid, created, userId, title, text, tags}) => ({
    id, quid, created, userId, title, text,
    tags: tags ? tags.split(',') : []
  })
};

class MySqlDAL {
  constructor(config) {
    this.config = config;

    console.log('MySql', JSON.stringify(config));

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
      .then(data => data.insertId);
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
      .then(data => data.insertId);
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
        expires: row.expires,
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
    let sql = 'DELETE FROM quaero_session WHERE user_id = ? AND expires < ?';
    return this.execute(sql, [userId, dt]);
  }

  deleteSession(sid) {
    let sql = 'DELETE FROM quaero_session WHERE sid = ?';
    return this.execute(sql, [sid]);
  }

  // ==============================================================================
  // Questions (and Tags)
  createQuestion(quid, created, user_id, title, text, tags) {
    let qSql = 'INSERT into question SET ?;';
    return this.execute(qSql, {quid, created, user_id, title, text})
      .then(data => {
        const questionId = data.insertId;
        if (tags && tags.length) {
          let tSql = 'INSERT INTO question_tags(question_id, tag) VALUES ' + tags.map(tag => `(${questionId}, ?)`);
          return this.execute(tSql, tags)
            .then(() => questionId)
            .catch(error => {
              console.error('Error adding tags to question', error.stack);
              return this.deleteQuestion(questionId)
                .then(() => { throw error; });
            })
        } else {
          return questionId;
        }
      });
  }

  deleteQuestion(id) {
    let tSql = `DELETE FROM question_tags WHERE question_id = ${id}`;
    let qSql = `DELETE FROM question WHERE question_id = ${id}`;
    return this.execute(tSql)
      .then(() => this.execute(qSql));
  }

  getQuestionByQuid(quid) {
    // TODO: add comments and answers
    let sql = `
      SELECT
        q.id AS id, q.quid AS quid, q.created AS created, q.user_id AS userId, 
        q.title AS title, q.text AS text, 
        IFNULL(GROUP_CONCAT(DISTINCT t.tag SEPARATOR ','), '') AS tags
      FROM question q
      LEFT OUTER JOIN question_tags t ON q.id = t.question_id
      WHERE q.quid = '1234'
      GROUP BY q.id`;
    return this.selectOne(sql, [quid])
      .then(xform.question);
  }

  findQuestions(text, tags) {
    let tagJoins = tags.map((tag, index) => `LEFT OUTER JOIN question_tags tt${index} ON q.id = tt${index}.question_id`);
    let whereClauses = [
      ...tags.map((tag, index) => `tt${index}.tag  = ?`),
      `(q.title LIKE ? OR q.text LIKE ?)`
    ];
    let likeText = `%${text}%`;

    let sql = `
      SELECT
        q.id AS id, q.quid AS quid, q.created AS created, q.user_id AS userId, 
        q.title AS title, q.text AS text, 
        IFNULL(GROUP_CONCAT(DISTINCT t.tag SEPARATOR ','), '') AS tags
      FROM question q
      LEFT OUTER JOIN question_tags t ON q.id = t.question_id
      ${tagJoins.join(' ')}
      WHERE ${whereClauses.join(' AND ')}
      GROUP BY q.id`;
    return this.execute(sql, [...tags, likeText, likeText]);
  }

  listRecentQuestions() {
    // Note: only interested in title, tags and text here
    let sql = `
      SELECT
        q.id AS id, q.quid AS quid, q.created AS created, q.user_id AS userId, 
        q.title AS title, q.text AS text, 
        IFNULL(GROUP_CONCAT(DISTINCT t.tag SEPARATOR ','), '') AS tags
      FROM question q
      LEFT OUTER JOIN question_tags t ON q.id = t.question_id
      GROUP BY q.id
      ORDER BY q.created DESC`;
    return this.execute(sql);
  }

}

module.exports = MySqlDAL;