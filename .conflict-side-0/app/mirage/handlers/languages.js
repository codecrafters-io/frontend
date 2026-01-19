export default function (server) {
  server.get('/languages', function (schema) {
    return schema.languages.all();
  });
}
