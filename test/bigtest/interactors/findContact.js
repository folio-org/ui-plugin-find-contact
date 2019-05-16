import {
  clickable,
  collection,
  interactor,
  is,
  property,
  scoped,
} from '@bigtest/interactor';

@interactor class PluginModalInteractor {
  static defaultScope = '[data-test-find-contact-modal]';

  instances = collection('[role=row] a', {
    click: clickable(),
  });

  save = scoped('[data-test-find-contact-modal-save]', {
    click: clickable(),
    isDisabled: property('disabled'),
  });

  selectAll = scoped('[data-test-find-contact-modal-select-all]', {
    click: clickable(),
  });
}

@interactor class FindContactInteractor {
  button = scoped('[data-test-plugin-find-contact-button]', {
    click: clickable(),
    isFocused: is(':focus'),
  });

  modal = new PluginModalInteractor();
}

export default FindContactInteractor;
