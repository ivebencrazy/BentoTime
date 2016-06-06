import { merge } from "lodash";
import * as ActionTypes from "app/renderer-process/data/actions/ActionTypes";
import bookReducer from "app/renderer-process/data/reducers/bookReducer";

const initialState = {
  books: {},
  isFetching: false,
  lastUpdated: null,
  totalBooks: 0
};

export default function libraryReducer(state = initialState, action) {
  switch(action.type) {
    case ActionTypes.FETCH_LIBRARY_REQUEST:
      return merge({}, state, {
        isFetching: true
      });

    case ActionTypes.FETCH_LIBRARY_SUCCESS:
      return merge({}, state, {
        // Should merge if lastChapterDate is different in new request
        // Should run book reducer to update.
        books: merge({}, state.books, action.library.books),
        isFetching: false,
        lastUpdated: action.receivedAt,
        totalBooks: action.library.totalBooks
      });

    case ActionTypes.FETCH_LIBRARY_FAILURE:
      return merge({}, state, {
        isFetching: false
      });

    case ActionTypes.SET_BOOKMARK:
    case ActionTypes.FETCH_BOOK_REQUEST:
    case ActionTypes.FETCH_BOOK_SUCCESS:
    case ActionTypes.FETCH_BOOK_FAILURE:
    case ActionTypes.SET_CHAPTER_VIEWED:
    case ActionTypes.FETCH_CHAPTER_REQUEST:
    case ActionTypes.FETCH_CHAPTER_SUCCESS:
    case ActionTypes.FETCH_CHAPTER_FAILURE:
      return merge({}, state, {
        books: merge({}, state.books, {
          [action.book.id]: bookReducer(state.books[action.book.id], action)
        })
      });

    default:
      return state;
  }
}
