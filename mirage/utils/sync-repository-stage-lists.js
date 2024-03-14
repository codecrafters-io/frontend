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

  const stageListItems = [];

  repository.course.stages.models.sortBy('position').forEach((stage) => {
    debugConsole().time(`stage ${stage.slug} (${stage.position})`);
    debugConsole().group(`${stage.slug} (${stage.position})`);

    let stageListItem = stageIdToStageListItem[stage.id];

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
      // Passing listId here and then updating list.items later is faster (50ms vs 200ms) than creating the stageListItem with the list.items association
      stageListItem = server.create('repository-stage-list-item', { listId: repository.stageList.id, stage: stage });
    } else {
      debugConsole().log('found existing stageListItem');
    }

    stageListItems.push(stageListItem);

    debugConsole().time('find courseStageCompletion');
    const courseStageCompletion = repository.courseStageCompletions.models.findBy('courseStage.id', stage.id);
    const isDisabled = false; // for now
    debugConsole().timeEnd('find courseStageCompletion');

    if (!courseStageCompletion && !firstIncompleteStage) {
      firstIncompleteStage = stage;
    }

    const stageListItemAttributes = {
      position: currentStageListItemPosition++,
      completedAt: courseStageCompletion ? courseStageCompletion.completedAt : null,
      isDisabled: isDisabled,
      isCurrent: false,
    };

    // Update can be expensive and this is run for every GET /repositories call.
    if (Object.keys(stageListItemAttributes).some((key) => stageListItemAttributes[key] !== stageListItem[key])) {
      debugConsole().time('update stageListItem');
      stageListItem.update(stageListItemAttributes);
      debugConsole().timeEnd('update stageListItem');
    }

    debugConsole().groupEnd();
    debugConsole().timeEnd(`stage ${stage.slug} (${stage.position})`);
  });

  const currentIds = repository.stageList.items.models
    .toArray()
    .map((item) => item.id)
    .sort()
    .join(',');

  const newIds = stageListItems
    .map((item) => item.id)
    .sort()
    .join(',');

  if (currentIds !== newIds) {
    debugConsole().time('update repository.stageList');
    repository.stageList.update({ items: stageListItems });
    debugConsole().timeEnd('update repository.stageList');
  }

  debugConsole().groupEnd();

  if (!repository.stageList.items.models.find((item) => item.isCurrent)) {
    repository.stageList.items.models[repository.stageList.items.models.length - 1].update({ isCurrent: true });
  }
}

export default function syncRepositoryStageLists(server) {
  server.schema.repositories.all().models.forEach((repository) => {
    debugConsole().time(`syncRepositoryStageList ${repository.id}`);
    syncRepositoryStageList(server, repository);
    debugConsole().timeEnd(`syncRepositoryStageList ${repository.id}`);
  });
}
