import { types } from 'mobx-state-tree';

export interface AddressType {
  id: string;

  alias: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}
export const AddressModel = types
  .model('Ordering_Buyer_Address', {
    id: types.identifier(types.string),

    alias: types.string,
    street: types.string,
    city: types.string,
    state: types.string,
    country: types.string,
    zipCode: types.string
  });
