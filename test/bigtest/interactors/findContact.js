import {
  clickable,
  collection,
  interactor,
  is,
  property,
  scoped,
} from '@bigtest/interactor';

@interactor class PluginModalInteractor {
  static defaultScope = '[data-test-find-records-modal]';

  instances = collection('[data-row-inner]', {
    click: clickable('input[type="checkbox"]'),
  });

  save = scoped('[data-test-find-records-modal-save]', {
    click: clickable(),
    isDisabled: property('disabled'),
  });

  selectAll = scoped('[data-test-find-records-modal-select-all]', {
    click: clickable(),
  });
}

@interactor class FindContactInteractor {
  button = scoped('[data-test-plugin-find-record-button]', {
    click: clickable(),
    isFocused: is(':focus'),
  });

  modal = new PluginModalInteractor();
}

export default FindContactInteractor;
