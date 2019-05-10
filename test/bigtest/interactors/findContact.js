import {
  interactor,
  scoped,
  collection,
  clickable,
  is,
  isPresent,
} from '@bigtest/interactor';

@interactor class PluginModalInteractor {
  static defaultScope = '[data-test-find-contact-modal]';

  instances = collection('[role=row] a', {
    click: clickable(),
  });

  noResultsDisplayed = isPresent('[data-test-find-user-no-results-message]');
}

@interactor class FindContactInteractor {
  button = scoped('[data-test-plugin-find-contact-button]', {
    click: clickable(),
    isFocused: is(':focus'),
  });

  modal = new PluginModalInteractor();
}

export default FindContactInteractor;
