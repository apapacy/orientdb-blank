import {Model} from '../orm';

export class User extends Model{

  static schema = {
    className: 'User',
    collection: 'Users',
    props: {
      name: {
        type: 'string',
        required: true
      },
      birthday: {
        type: 'date',
        required: true
      }
    }
  }

}
