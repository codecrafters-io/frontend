export default function (server) {
  server.get('/promotional-discounts', function (schema) {
    return schema.promotionalDiscounts.all();
  });
}
