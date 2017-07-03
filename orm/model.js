// select name, out('family') as family from parent  where family.name = 'Max1' fetchplan *:1
export class Model {
  test() {
    console.log('test from model');
  }

  async dropClass(db) {
    try {
      await db.query(`delete vertex ${this.constructor.schema.className};`);
      await db.query(`drop class ${this.constructor.schema.className} if exists;`);
      await db.query(`create class ${this.constructor.schema.className} extends V;`);
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
          try {
            await db.query(commands[i]);
          } catch(ex) {
            console.log(ex);
          }
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
      await db.query(`create class ${this.constructor.schema.className} if not exists  extends V ;`);
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
          try {
            await db.query(commands[i]);
          } catch(ex) {
            console.log(ex);
          }
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
  } else if (property.type === 'text') {
    return [`create property ${schema.className}.${propertyName} ${notexists} string;`,
      `create index ${schema.className}.${propertyName}
        on ${schema.className}(${propertyName}) fulltext engine lucene metadata {
          "analyzer": "org.apache.lucene.analysis.ru.RussianAnalyzer"
        };`];
  } else if (property.type === 'autoincrement') {
    return [`drop sequence ${schema.className}_${propertyName}`,
      `create sequence ${schema.className}_${propertyName} type ordered;`,
      `create property ${schema.className}.${propertyName} ${notexists} long;`,
      `alter property ${schema.className}.${propertyName}
         default "sequence('${schema.className}_${propertyName}').next()";`,
      `alter property ${schema.className}.${propertyName} readonly true;`];
  } else if (property.type === 'edge') {
    return [`create class ${propertyName} ${notexists} extends E;`,
      `create property ${propertyName}.out ${notexists} link ${schema.className};`,
      `create property ${propertyName}.in ${notexists} link ${property.to};`,
      `create index ${propertyName}.unique on ${propertyName}(out, in) unique;`
    ];
  } else {
    type = property.type;
  }
  return [`create property ${schema.className}.${propertyName} ${notexists} ${type}`];
}
