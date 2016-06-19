import "isomorphic-fetch";

import Library from "renderer/data/models/Library";
import Book from "renderer/data/models/Book";
import Chapter from "renderer/data/models/Chapter";

export const baseHost = "http://www.mangaeden.com/";
export const imgHost = "http://cdn.mangaeden.com/mangasimg/";

function getData(url) {
  return fetch(url)
    .then(function(response) {
      if(response.status >= 400) {
        throw new Error(response);
      }
      return response.json();
    });
}


export function getLibrary$(pageId) {
  if(pageId !== undefined) {
    return getData(`${baseHost}api/list/0/?p=${pageId}`)
      .then(response => {
        return Promise.resolve(Library.createFromMangaEdenListApi(response));
      });
  }
  return getData(`${baseHost}api/list/0/`)
    .then(response => {
      return Promise.resolve(Library.createFromMangaEdenListApi(response));
    });
}

export function getBook$(bookId) {
  return getData(`${baseHost}api/manga/${bookId}/`)
    .then(response => {
      return Promise.resolve(Book.createFromMangaEdenMangaApi(response, bookId));
    });
}

export function getChapter$(chapterId) {
  return getData(`${baseHost}api/chapter/${chapterId}/`)
    .then(response => {
      return Promise.resolve(Chapter.createFromMangaEdenChapterApi(response, chapterId));
    });
}