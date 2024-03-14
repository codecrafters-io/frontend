const DEBUG = false;

function debugConsole() {
  if (DEBUG) {
    return window.console;
  } else {
    return {
      log: function () {},
      info: function () {},
      warn: function () {},
      error: function () {},
      debug: function () {},
      group: function () {},
      groupCollapsed: function () {},
      groupEnd: function () {},
      time: function () {},
      timeEnd: function () {},
    };
  }
}

function syncRepositoryStageList(server, repository) {
  if (!repository.stageList) {
    repository.update({ stageList: server.create('repository-stage-list') });
  }

  let currentStageListItemPosition = 1;
  let firstIncompleteStage = null;

  const activatedExtensionSlugs = repository.courseExtensionActivations.models.map((activation) => activation.extension.slug);

  const stageIdToStageListItem = {};

  repository.stageList.items.models.forEach((item) => {
    stageIdToStageListItem[item.stage.id] = item;
  });

  debugConsole().groupCollapsed('syncRepositoryStageList');

  repository.course.stages.models.sortBy('position').forEach((stage) => {
    debugConsole().time(`stage ${stage.slug} (${stage.position})`);
    debugConsole().group(`${stage.slug} (${stage.position})`);

    debugConsole().time('find stageListItem');
    let stageListItem = stageIdToStageListItem[stage.id];
    debugConsole().timeEnd('find stageListItem');

    // If the stage has a primary extension, but the user doesn't have an activation for it, then destroy the stageListItem
    if (stage.primaryExtensionSlug && !activatedExtensionSlugs.includes(stage.primaryExtensionSlug)) {
      debugConsole().log(`No extension activation found for stage. stageExtensionSlug=${stage.primaryExtensionSlug}`);

      if (stageListItem) {
        debugConsole().log('destroying stageListItem');
        stageListItem.destroy();
      }

      debugConsole().groupEnd();
      debugConsole().timeEnd(`stage ${stage.slug} (${stage.position})`);

      return;
    }

    if (!stageListItem) {
      debugConsole().log('creating stageListItem');
      stageListItem = server.create('repository-stage-list-item', { list: repository.stageList, stage: stage });
    } else {
      debugConsole().log('found existing stageListItem');
    }

    debugConsole().time('find courseStageCompletion');
    const courseStageCompletion = repository.courseStageCompletions.models.findBy('courseStage.id', stage.id);
    const isDisabled = false; // for now
    debugConsole().timeEnd('find courseStageCompletion');

    if (!courseStageCompletion && !firstIncompleteStage) {
      firstIncompleteStage = stage;
    }

    debugConsole().time('update stageListItem');
    stageListItem.update({
      position: currentStageListItemPosition++,
      completedAt: courseStageCompletion ? courseStageCompletion.completedAt : null,
      isDisabled: isDisabled,
      isCurrent: firstIncompleteStage && firstIncompleteStage.id === stage.id,
    });
    debugConsole().timeEnd('update stageListItem');

    debugConsole().groupEnd();
    debugConsole().timeEnd(`stage ${stage.slug} (${stage.position})`);
  });

  debugConsole().groupEnd();

  if (!repository.stageList.items.models.find((item) => item.isCurrent)) {
    repository.stageList.items.models[repository.stageList.items.models.length - 1].update({ isCurrent: true });
  }

  if (!repository.stageList.items.models.find((item) => item.isCurrent)) {
    throw new Error('Expected at least one currentStage to be present');
  }
}

export default function syncRepositoryStageLists(server) {
  server.schema.repositories.all().models.forEach((repository) => {
    debugConsole().time(`syncRepositoryStageList ${repository.id}`);
    syncRepositoryStageList(server, repository);
    debugConsole().timeEnd(`syncRepositoryStageList ${repository.id}`);
  });
}
