
import {Database} from '../orm';
import {User} from './User';
import {Address} from './Address';
import {City} from './City';


export default new Database({
  host: 'localhost',
  port: 2424,
  username: 'admin',
  password: 'admin',
  dbname: 'test',
  models: [
    User,
    Address,
    City
  ]
});
