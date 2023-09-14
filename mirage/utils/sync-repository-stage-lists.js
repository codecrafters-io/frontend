function syncRepositoryStageList(server, repository) {
  if (!repository.stageList) {
    repository.update({ stageList: server.create('repository-stage-list') });
  }

  let highestCompletedStage = null;

  repository.course.stages.models.sortBy('position').forEach((stage) => {
    const courseStageCompletion = repository.courseStageCompletions.models.find((completion) => completion.courseStage.id === stage.id);

    if (courseStageCompletion) {
      highestCompletedStage = stage;
    }
  });

  const currentStage = highestCompletedStage
    ? repository.course.stages.models.findBy('position', highestCompletedStage.position + 1)
    : repository.course.stages.models.findBy('position', 1);

  repository.course.stages.models.sortBy('position').forEach((stage, index) => {
    let stageListItem = repository.stageList.items.models.findBy('stage.id', stage.id);

    if (!stageListItem) {
      stageListItem = server.create('repository-stage-list-item', { list: repository.stageList, stage: stage });
    }

    const courseStageCompletion = repository.courseStageCompletions.models.findBy('courseStage.id', stage.id);
    const isDisabled = false; // for now

    stageListItem.update({
      position: index + 1,
      completedAt: courseStageCompletion ? courseStageCompletion.completedAt : null,
      isDisabled: isDisabled,
      isCurrent: currentStage && currentStage.id === stage.id,
    });
  });
}

export default function syncRepositoryStageLists(server) {
  server.schema.repositories.all().models.forEach((repository) => {
    syncRepositoryStageList(server, repository);
  });
}
