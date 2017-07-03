//const should = require('should');
import should from 'should';
import {User} from '../models/User';
import db from '../models/db';

describe('test environment', async () => {

  it('test', async () => {
    (0).should.not.be.ok;
  });

  it('create class User', async () => {
    const user = new User();
    user.test.should.be.ok;
    user.test();
  });

  /*it('get database', async () => {
    const begin = (new Date).getTime();
    const test = await db.query("select * from `test` where message lucene 'Харько~0.2' limit 3");
    console.log((new Date).getTime() - begin);
    console.log(test);
    const test1 = await db.query(
      "select rid from index:test.message1 where key lucene :lu  limit 3",
    {
      params: {
        lu: 'Харько~0.3'
      }
    });
    console.log(test1);
    return Promise.resolve();
  });*/

  it('drop database', async () => {
    await db.drop();
    await db.sync();
  });

  it('test data', async () => {
    const city = await db.query(`insert into City set name='Харьков'`);
    const address = await db.query(`insert into Address set city={name: 'Луга'}`);
    await db.query(`insert into User set name='Joe', address=${address.rid}`);
  });

});
