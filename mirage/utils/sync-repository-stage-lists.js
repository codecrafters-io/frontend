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

  const nextStage = highestCompletedStage
    ? repository.course.stages.models.findBy('position', highestCompletedStage.position + 1)
    : repository.course.stages.models.sortBy('position')[0];

  const currentStage = nextStage ? nextStage : highestCompletedStage;

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

  if (!repository.stageList.items.models.find((item) => item.isCurrent)) {
    throw new Error('Expected at least one currentStage to be present');
  }
}

export default function syncRepositoryStageLists(server) {
  server.schema.repositories.all().models.forEach((repository) => {
    syncRepositoryStageList(server, repository);
  });
}
