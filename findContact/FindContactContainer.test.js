import React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import FindContactContainer from './FindContactContainer';

const mockFetchMore = jest.fn();

jest.mock('@folio/stripes-smart-components/lib/SearchAndSort/ConnectedSource/StripesConnectedSource', () => {
  return jest.fn().mockImplementation(() => {
    return { fetchMore: mockFetchMore, update: jest.fn() };
  });
});

// eslint-disable-next-line react/prop-types
const children = jest.fn(({ onNeedMoreData, querySetter }) => (
  <>
    <button
      type="button"
      onClick={onNeedMoreData}
    >
      OnNeedMoreData
    </button>
    <button
      type="button"
      onClick={() => querySetter({ state: {} })}
    >
      UpdateQuery
    </button>
  </>
));

const contact = { id: 'userId', inactive: false, firstName: 'John', lastName: 'Smith', categories: ['01'] };

const mockResources = {
  records: {
    records: [contact],
  },
  categories: {
    records: [{ id: '01', value: 'category-01' }],
  },
};

const findContactContainer = (mutator, resources = mockResources) => (
  <FindContactContainer
    mutator={mutator}
    resources={resources}
  >
    {children}
  </FindContactContainer>
);

describe('FindContactContainer component', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      records: {
        GET: jest.fn(),
      },
      categories: {
        GET: jest.fn(),
      },
      query: {
        update: jest.fn(),
        replace: jest.fn(),
      },
      initializedFilterConfig: {
        replace: jest.fn(),
      },
    };
  });

  it('should not fetch contacts when plugin is open by default', async () => {
    await act(async () => {
      render(findContactContainer(mutator));
    });

    expect(mutator.query.replace).toHaveBeenCalled();
    expect(mutator.records.GET).not.toHaveBeenCalled();
  });

  it('should fetch more data', async () => {
    render(findContactContainer(mutator));

    await waitFor(() => {
      user.click(screen.getByText('OnNeedMoreData'));
    });

    expect(mockFetchMore).toHaveBeenCalledTimes(1);
  });

  it('should update data', async () => {
    render(findContactContainer(mutator));

    await waitFor(() => {
      user.click(screen.getByText('UpdateQuery'));
    });

    expect(mutator.query.update).toHaveBeenCalled();
  });

  it('should pass records with categories labels instead of ids', async () => {
    render(findContactContainer(mutator));

    await waitFor(() => {
      return expect(children.mock.calls[0][0].data).toEqual({
        records: [
          {
            ...mockResources.records.records[0],
            categories: mockResources.categories.records[0].value,
          },
        ],
      });
    });
  });

  it('should return queryGetter', async () => {
    render(findContactContainer(mutator));

    await waitFor(() => {
      return expect(children.mock.calls[0][0].queryGetter()).toEqual({});
    });
  });

  it('should format contact name', async () => {
    render(findContactContainer(mutator));

    await waitFor(() => {
      return expect(children.mock.calls[0][0].resultsFormatter.name(contact))
        .toEqual(`${contact.lastName}, ${contact.firstName}`);
    });
  });

  it('should replace initializedFilterConfig', async () => {
    const { rerender } = render(findContactContainer(mutator));

    rerender(findContactContainer(mutator));

    expect(mutator.initializedFilterConfig.replace).toHaveBeenCalledTimes(1);
  });
});
