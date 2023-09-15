function syncRepositoryStageList(server, repository) {
  if (!repository.stageList) {
    repository.update({ stageList: server.create('repository-stage-list') });
  }

  let firstIncompleteStage = null;

  repository.course.stages.models.sortBy('position').forEach((stage, index) => {
    let stageListItem = repository.stageList.items.models.findBy('stage.id', stage.id);

    // If the stage has a primary extension, but the user doesn't have an activation for it, then destroy the stageListItem
    if (stage.primaryExtensionSlug) {
      const extensionActivation = repository.courseExtensionActivations.models.findBy('extension.slug', stage.primaryExtensionSlug);

      if (!extensionActivation) {
        if (stageListItem) {
          stageListItem.destroy();
        }

        return;
      }
    }

    if (!stageListItem) {
      stageListItem = server.create('repository-stage-list-item', { list: repository.stageList, stage: stage });
    }

    const courseStageCompletion = repository.courseStageCompletions.models.findBy('courseStage.id', stage.id);
    const isDisabled = false; // for now

    if (!courseStageCompletion && !firstIncompleteStage) {
      firstIncompleteStage = stage;
    }

    stageListItem.update({
      position: index + 1,
      completedAt: courseStageCompletion ? courseStageCompletion.completedAt : null,
      isDisabled: isDisabled,
      isCurrent: firstIncompleteStage && firstIncompleteStage.id === stage.id,
    });
  });

  if (!repository.stageList.items.models.find((item) => item.isCurrent)) {
    throw new Error('Expected at least one currentStage to be present');
  }
}

export default function syncRepositoryStageLists(server) {
  server.schema.repositories.all().models.forEach((repository) => {
    syncRepositoryStageList(server, repository);
  });
}
