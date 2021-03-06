import Debug from 'debug';
import { flow, getEnv, types } from 'mobx-state-tree';
import { ApiClientType } from '../../../stores';
import { DTOs } from '../../../utils/eShop.dtos';
import { BuyerIndexModel, BuyerIndexType } from '../models/buyer';

const debug = new Debug('buyers');

export interface BuyerStoreType {
  loading: boolean;

  buyers: Map<string, BuyerIndexType>;

  get: () => Promise<{}>;
}

export const BuyerStoreModel = types
  .model({
    loading: types.optional(types.boolean, false),

    buyers: types.optional(types.map(BuyerIndexModel), {}),
  })
  .actions(self => {
    const get = flow(function*() {
      const request = new DTOs.Buyers();

      self.loading = true;
      try {
        const client = getEnv(self).api as ApiClientType;

        const results: DTOs.PagedResponse<DTOs.OrderingBuyerIndex> = yield client.paged(request);

        self.buyers.replace(results.records.map(x => [x.id, x]));
      } catch (error) {
        debug('received http error: ', error);
        throw error;
      }
      self.loading = false;
    });

    return { get };
  });
