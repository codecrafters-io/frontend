export default function (server) {
  server.get('/institutions', function (schema) {
    return schema.institutions.all();
  });
}
