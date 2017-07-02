import {Model} from '../orm';

export class User extends Model{

  static schema = {
    className: 'User',
    properties: {
      name: {
        type: 'string',
        required: true
      },
      birthday: {
        type: 'date',
        required: true
      },
      address: {
        type: 'set',
        className: 'Address'
      }
    }
  }

}
