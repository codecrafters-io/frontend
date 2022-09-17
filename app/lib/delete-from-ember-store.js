export default function deleteFromEmberStore(store, record) {
  let relationships = {};
  let hasRelationships = false;

  record.eachRelationship((name, { kind }) => {
    hasRelationships = true;
    relationships[name] = {
      data: kind === 'hasMany' ? [] : null,
    };
  });

  if (hasRelationships) {
    store.push({
      data: {
        type: record.constructor.modelName,
        id: record.id,
        relationships: relationships,
      },
    });
  }

  record.unloadRecord();
}
