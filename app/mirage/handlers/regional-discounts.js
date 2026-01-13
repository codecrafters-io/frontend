import { Response } from 'miragejs';

export default function (server) {
  server.get('/regional-discounts/current', function (schema) {
    const regionalDiscount = schema.regionalDiscounts.find('current-discount-id');

    if (regionalDiscount) {
      return regionalDiscount;
    } else {
      return new Response(200, {}, { data: null });
    }
  });
}
