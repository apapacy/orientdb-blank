import OrientDB from 'orientjs';

const modelsMap = Symbol('modelsMap');
const registerModel = Symbol('registerModel');
const build = Symbol('build');
const server = Symbol('server');
const db = Symbol('db');

export class Database {

  constructor(options) {
    const models = options.models;
    options.useToken = true;
    this[server] = new OrientDB(options);
    this[db] = this[server].use({
      name: options.dbname,
      username: options.dbusername || options.username,
      password: options.dbpassword || options.password
    });
    this[modelsMap] = {};
    for (let i = 0; i < models.length; i++) {
      this[registerModel](models[i]);
    }
    this[build]();
  }

  async query(...args) {
    return await this[db].query(...args);
  }

  [registerModel](model) {
    if (!model || !model.schema || !model.schema.className) {
      throw new Error('"model.schema.className" not provided.');
    }
    this[modelsMap][model.schema.className];
  }

  [build]() {
  }

}
