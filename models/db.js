
import {Database} from '../orm';
import {User} from './User';

export default new Database({
  host: 'localhost',
  port: 2424,
  username: 'admin',
  password: 'admin',
  dbname: 'test',
  models: [
    User
  ]
});
