import React from 'react';

import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import SendAssets from '@features/SendAssets/SendAssets';
import { fAssets, fSettings } from '@fixtures';
import { RatesContext } from '@services';
import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { WalletId } from '@types';

// SendFlow makes RPC calls to get nonce and gas.
jest.mock('@vendor', () => {
  return {
    ...jest.requireActual('@vendor'),
    // Since there are no nodes in our StoreContext,
    // ethers will default to FallbackProvider
    FallbackProvider: jest.fn().mockImplementation(() => ({
      getTransactionCount: () => 10
    }))
  };
});
/* Test components */
describe('SendAssetsFlow', () => {
  const component = (path?: string) => (
    <MemoryRouter initialEntries={path ? [path] : undefined}>
      <DataContext.Provider
        value={
          ({
            addressBook: [],
            settings: fSettings,
            assets: fAssets
          } as unknown) as IDataContext
        }
      >
        <StoreContext.Provider
          value={
            ({
              userAssets: [],
              accounts: [],
              getDefaultAccount: () => ({ assets: [], wallet: WalletId.WEB3 }),
              getAccount: jest.fn(),
              networks: [{ nodes: [] }]
            } as unknown) as any
          }
        >
          <RatesContext.Provider value={{ rates: {}, trackAsset: jest.fn() } as any}>
            <SendAssets />
          </RatesContext.Provider>
        </StoreContext.Provider>
      </DataContext.Provider>
    </MemoryRouter>
  );

  const renderComponent = (pathToLoad?: string) => {
    return simpleRender(component(pathToLoad));
  };

  test('Can render the first step (Send Assets Form) in the flow.', () => {
    const { getByText } = renderComponent();
    const selector = 'Send Assets';
    expect(getByText(selector)).toBeInTheDocument();
  });
});
