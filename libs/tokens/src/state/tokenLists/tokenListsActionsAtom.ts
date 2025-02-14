import { atom } from 'jotai'
import { SupportedChainId } from '@cowprotocol/cow-sdk'

import { environmentAtom } from '../environmentAtom'
import {
  listsEnabledStateAtom,
  listsStatesByChainAtom,
  listsStatesMapAtom,
  userAddedListsSourcesAtom,
} from './tokenListsStateAtom'
import { ListState } from '../../types'

export const upsertListsAtom = atom(null, (get, set, chainId: SupportedChainId, listsStates: ListState[]) => {
  const globalState = get(listsStatesByChainAtom)
  const chainState = globalState[chainId]

  const update = listsStates.reduce<{ [listId: string]: ListState }>((acc, list) => {
    acc[list.source] = {
      ...list,
      isEnabled: typeof list.isEnabled === 'boolean' ? list.isEnabled : chainState[list.source]?.isEnabled,
    }

    return acc
  }, {})

  set(listsStatesByChainAtom, {
    ...globalState,
    [chainId]: {
      ...chainState,
      ...update,
    },
  })
})
export const addListAtom = atom(null, (get, set, state: ListState) => {
  const { chainId } = get(environmentAtom)
  const userAddedTokenLists = get(userAddedListsSourcesAtom)

  state.isEnabled = true

  set(userAddedListsSourcesAtom, {
    ...userAddedTokenLists,
    [chainId]: userAddedTokenLists[chainId].concat({ ...state }),
  })

  set(upsertListsAtom, chainId, [state])
})

export const removeListAtom = atom(null, (get, set, source: string) => {
  const { chainId } = get(environmentAtom)
  const userAddedTokenLists = get(userAddedListsSourcesAtom)

  set(userAddedListsSourcesAtom, {
    ...userAddedTokenLists,
    [chainId]: userAddedTokenLists[chainId].filter((item) => item.source !== source),
  })

  const stateCopy = { ...get(listsStatesByChainAtom) }

  delete stateCopy[chainId][source]

  set(listsStatesByChainAtom, stateCopy)
})

export const toggleListAtom = atom(null, (get, set, source: string) => {
  const { chainId } = get(environmentAtom)
  const listsEnabledState = get(listsEnabledStateAtom)
  const states = get(listsStatesMapAtom)

  if (!states[source]) return

  const list = { ...states[source] }

  list.isEnabled = !listsEnabledState[source]

  set(upsertListsAtom, chainId, [list])
})
