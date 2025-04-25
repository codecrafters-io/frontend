import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  user: belongsTo(),
  amount: 0,
  amountRefunded: 0,
  currency: 'usd',
  createdAt() {
    return new Date(); // Done this way due to linting error and shared objects
  },
  invoiceId: null,
  status: 'succeeded',
});
