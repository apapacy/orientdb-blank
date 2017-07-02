
export class Model {
  test() {
    console.log('test from model');
  }

  async drop(db) {
    try {
      await db.query(`drop class ${this.constructor.schema.collection} if exists;`);
      await db.query(`create class ${this.constructor.schema.collection};`);
      for (let propertyName in this.constructor.schema.props) {
        await db.query(`create property ${this.constructor.schema.collection}.${propertyName} ${this.constructor.schema.props[propertyName].type}`);
      }
      await db.query(`create property ${this.constructor.schema.collection}.createdAt datetime`);
      await db.query(`create property ${this.constructor.schema.collection}.updatedAt datetime`);
      await db.query(`alter class ${this.constructor.schema.collection} strictmode true`);
    } catch (ex) {
      console.log(ex);
    }
  }

  async sync(db) {
    try {
      await db.query(`create class ${this.constructor.schema.collection} if not exists;`);
      for (let propertyName in this.constructor.schema.props) {
        await db.query(`create property ${this.constructor.schema.collection}.${propertyName} if not exists ${this.constructor.schema.props[propertyName].type}`);
      }
      await db.query(`create property ${this.constructor.schema.collection}.createdAt if not exists datetime`);
      await db.query(`create property ${this.constructor.schema.collection}.updatedAt if not exists datetime`);
      await db.query(`alter class ${this.constructor.schema.collection} strictmode true`);
    } catch (ex) {
      console.log(ex);
    }
  }
}
