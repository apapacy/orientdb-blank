// select name, out('family') as family from parent  where family.name = 'Max1' fetchplan *:1
export class Model {
  test() {
    console.log('test from model');
  }

  async dropClass(db) {
    try {
      await db.query(`drop class ${this.constructor.schema.className} if exists;`);
      await db.query(`create class ${this.constructor.schema.className};`);
      await db.query(`alter class ${this.constructor.schema.className} strictmode true;`);
      await db.query(`drop sequence ${this.constructor.schema.className};`);
    } catch (ex) {
      console.log(ex);
    }
  }

  async dropProperties(db) {
    try {
      for (let propertyName in this.constructor.schema.properties) {
        let commands = generateProperty(this.constructor.schema, propertyName, false);
        for (let i = 0; i < commands.length; i++ ) {
          await db.query(commands[i]);
        }
      }
      await db.query(`create property ${this.constructor.schema.className}.createdAt datetime`);
      await db.query(`create property ${this.constructor.schema.className}.updatedAt datetime`);
    } catch (ex) {
      console.log(ex);
    }
  }

  async syncClass(db) {
    try {
      await db.query(`create class ${this.constructor.schema.className} if not exists;`);
      await db.query(`alter class ${this.constructor.schema.className} strictmode true`);
    } catch (ex) {
      console.log(ex);
    }
  }

  async syncProperties(db) {
    try {
      for (let propertyName in this.constructor.schema.properties) {
        let commands = generateProperty(this.constructor.schema, propertyName, true);
        for (let i = 0; i < commands.length; i++) {
          await db.query(commands[i]);
        }
      }
      await db.query(`create property ${this.constructor.schema.className}.createdAt if not exists datetime`);
      await db.query(`create property ${this.constructor.schema.className}.updatedAt if not exists datetime`);
    } catch (ex) {
      console.log(ex);
    }
  }

}

function generateProperty(schema, propertyName, soft) {
  const property = schema.properties[propertyName];
  const notexists = soft ? 'if not exists' : '';
  let type;
  if (['link', 'list', 'map', 'set'].indexOf(property.type) !== -1) {
    let postfix = property.type === 'link' ? '' : property.type;
    if (property.embedded) {
      type = `embedded${postfix} ${property.className}`;
    } else {
      type = `link${postfix} ${property.className}`;
    }
  } else if (property.type === 'autoincrement') {
    return [`drop sequence ${schema.className}_${propertyName}`,
      `create sequence ${schema.className}_${propertyName} type ordered`,
      `create property ${schema.className}.${propertyName} ${notexists} long`,
      `alter property ${schema.className}.${propertyName}
         default "sequence('${schema.className}_${propertyName}').next()"`,
      `alter property ${schema.className}.${propertyName} readonly true`];
  } else {
    type = property.type;
  }
  return [`create property ${schema.className}.${propertyName} ${notexists} ${type}`];
}
