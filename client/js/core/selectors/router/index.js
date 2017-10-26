import queryString from 'query-string'
import { createSelector } from 'reselect'


export const getPath = (state) => state.router.location.pathname


export const getSearch = (state) => state.router.location.search


export const getHash = (state) => state.router.location.hash


export const getQueryParams = createSelector(
  getSearch,
  (search) => queryString.parse(search)
)
