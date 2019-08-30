import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/helpers';
import FindContactInteractor from '../interactors/findContact';

const CONTACTS_COUNT = 15;

describe('Find contact plugin', function () {
  const findContact = new FindContactInteractor();

  setupApplication();

  beforeEach(async function () {
    this.server.createList('contact', CONTACTS_COUNT);
    this.server.createList('category', 2);

    this.visit('/dummy');
  });

  describe('Find contact button', () => {
    it('should be rendered', function () {
      expect(findContact.button.isPresent).to.be.true;
    });

    describe('click action', function () {
      beforeEach(async function () {
        await findContact.button.click();
      });

      it('should open a modal', function () {
        expect(findContact.modal.isPresent).to.be.true;
      });
    });
  });

  describe('modal list', function () {
    beforeEach(async function () {
      await findContact.button.click();
    });

    it('should return a set of results', function () {
      expect(findContact.modal.instances().length).to.be.equal(CONTACTS_COUNT);
    });

    it('should display disabled save button', function () {
      expect(findContact.modal.save.isDisabled).to.be.true;
    });

    describe('select a contact', function () {
      beforeEach(async function () {
        await findContact.modal.instances(1).click();
      });

      it('should enable Save button', function () {
        expect(findContact.modal.save.isDisabled).to.be.false;
      });
    });

    describe('select all', function () {
      beforeEach(async function () {
        await findContact.modal.selectAll.click();
      });

      it('should enable Save button', function () {
        expect(findContact.modal.save.isDisabled).to.be.false;
      });
    });

    describe('save selected contacts', function () {
      beforeEach(async function () {
        await findContact.modal.selectAll.click();
        await findContact.modal.save.click();
      });

      it('should close modal', function () {
        expect(findContact.modal.isPresent).to.be.false;
      });
    });
  });
});
