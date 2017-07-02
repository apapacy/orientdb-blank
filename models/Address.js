import {Model} from '../orm';

export class Address extends Model{

  static schema = {
    className: 'Address',
    properties: {
      city: {
        type: 'link',
        embedded: false,
        className: 'City',
        required: true
      },
      street: {
        type: 'string',
        required: true
      },
      house: {
        type: 'string',
        required: true
      }
    }
  }

}
