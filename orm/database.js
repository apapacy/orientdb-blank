import orientjs from 'orientjs';

const modelsMap = Symbol('modelsMap');
const registerModel = Symbol('registerModel');
const build = Symbol('build');
const db = Symbol('db');

export class Database {

  constructor(modelsList, database) {
    if (database) {
      this[db] = database;
    }
    this[modelsMap] = {};
    for (let i = 0; i < modelsList.length; i++) {
      this[registerModel](modelsList[i]);
    }
    this[build]();
  }

  [registerModel](model) {
    if (!model || !model.schema || model.schema.className) {
      throw new Error('"model.schema.className" not provided.');
    }
    this[modelsMap][model.schema.className];
  }

  [build]() {
  }

}
