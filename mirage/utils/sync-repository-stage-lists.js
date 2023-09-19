function syncRepositoryStageList(server, repository) {
  if (!repository.stageList) {
    repository.update({ stageList: server.create('repository-stage-list') });
  }

  let currentStageListItemPosition = 1;
  let firstIncompleteStage = null;

  console.groupCollapsed('syncRepositoryStageList');

  repository.course.stages.models.sortBy('position').forEach((stage) => {
    console.group(`${stage.slug} (${stage.position})`);
    let stageListItem = repository.stageList.items.models.findBy('stage.id', stage.id);

    // If the stage has a primary extension, but the user doesn't have an activation for it, then destroy the stageListItem
    if (stage.primaryExtensionSlug) {
      const extensionActivation = repository.courseExtensionActivations.models.findBy('extension.slug', stage.primaryExtensionSlug);

      if (!extensionActivation) {
        console.log(`No extension activation found for stage. stageExtensionSlug=${stage.primaryExtensionSlug}`);

        if (stageListItem) {
          console.log('destroying stageListItem');
          stageListItem.destroy();
        }

        console.groupEnd();

        return;
      }
    }

    if (!stageListItem) {
      console.log('creating stageListItem');
      stageListItem = server.create('repository-stage-list-item', { list: repository.stageList, stage: stage });
    } else {
      console.log('found existing stageListItem');
    }

    const courseStageCompletion = repository.courseStageCompletions.models.findBy('courseStage.id', stage.id);
    const isDisabled = false; // for now

    if (!courseStageCompletion && !firstIncompleteStage) {
      firstIncompleteStage = stage;
    }

    stageListItem.update({
      position: currentStageListItemPosition++,
      completedAt: courseStageCompletion ? courseStageCompletion.completedAt : null,
      isDisabled: isDisabled,
      isCurrent: firstIncompleteStage && firstIncompleteStage.id === stage.id,
    });

    console.groupEnd();
  });

  console.groupEnd();

  if (!repository.stageList.items.models.find((item) => item.isCurrent)) {
    repository.stageList.items.models[repository.stageList.items.models.length - 1].update({ isCurrent: true });
  }

  if (!repository.stageList.items.models.find((item) => item.isCurrent)) {
    throw new Error('Expected at least one currentStage to be present');
  }
}

export default function syncRepositoryStageLists(server) {
  server.schema.repositories.all().models.forEach((repository) => {
    syncRepositoryStageList(server, repository);
  });
}
