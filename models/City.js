import {Model} from '../orm';

export class City extends Model{

  static schema = {
    className: 'City',
    properties: {
      name: {
        type: 'string',
        required: true
      }
    }
  }

}
