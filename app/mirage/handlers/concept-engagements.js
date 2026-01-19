export default function (server) {
  server.get('/concept-engagements', function (schema) {
    return schema.conceptEngagements.all().filter((engagement) => engagement.user.id === '63c51e91-e448-4ea9-821b-a80415f266d3');
  });

  server.patch('/concept-engagements/:id');
  server.post('/concept-engagements');
}
