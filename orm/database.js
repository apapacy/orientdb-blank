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
    console.log(args)
    return await this[db].query(...args);
  }

  async execute(...args) {
    console.log(args)
    return await this[db].exec(...args);
  }

  async class(...args) {
    console.log(args)
    return await this[db].class(...args);
  }


  [registerModel](model) {
    if (!model || !model.schema || !model.schema.className) {
      throw new Error('"model.schema.className" not provided.');
    }
    this[modelsMap][model.schema.className] = new model();
  }

  [build]() {
  }

  async drop() {
    await this.query(`alter database datetimeformat "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"`);
    await this.query(`alter database dateformat "yyyy-MM-dd"`);
    await this.query(`alter database timezone 'Ukraine/Kiev'`);
    for (let modelName in this[modelsMap]) {
      await this[modelsMap][modelName].dropClass(this);
    }
    for (let modelName in this[modelsMap]) {
      await this[modelsMap][modelName].dropProperties(this);
    }
  }

  async sync() {
    await this.query(`alter database datetimeformat "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"`);
    await this.query(`alter database dateformat "yyyy-MM-dd"`);
    await this.query(`alter database timezone 'Ukraine/Kiev'`);
    for (let modelName in this[modelsMap]) {
      await this[modelsMap][modelName].syncClass(this);
    }
    for (let modelName in this[modelsMap]) {
      await this[modelsMap][modelName].syncProperties(this);
    }
  }
}
