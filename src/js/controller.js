import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import serachView from './views/serachView.js';
import resultView from './views/resultView';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { async } from 'regenerator-runtime/runtime';
import { MODEL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //0) Update results view to mark selected search result
    resultView.update(model.getSearchResultPage());
    //Update bookmarked
    bookmarksView.update(model.state.bookmarks);
    //1- Loading Recipe
    await model.loadRecipe(id);

    //2- Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // resultView.renderSpinner();
    resultView.renderSpinner();
    // 1) Get search query
    const query = serachView.getQuery();
    //Throw Error if nothing is searched
    if (!query)
      throw new Error('No Input Found! Please Enter the recipe Name!');

    // 2) Load search result
    await model.loadSearchResults(query);
    // 3) Render result
    resultView.render(model.getSearchResultPage());

    // 4) Render Initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    resultView.renderError(error);
  }
};

const controlPagination = function (goToPage) {
  // 3) Render New result
  resultView.render(model.getSearchResultPage(goToPage));

  // 4) Render New pagination buttons
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  //Update the recipe serving (in state)
  model.updateServings(newServings);

  //Upade the recipe view

  // Rendering updated recipe
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add or Delete Bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update Recipe
  recipeView.update(model.state.recipe);

  //3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //show Loading spinner
    // addRecipeView.renderSpinner();

    //Upload Recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    //addRecipeView.renderMessage();

    //Render Bookmarks view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error);
  }
};
const newFeature = function () {
  console.log('new Feature');
};

const init = function () {
  addRecipeView.addhandlerUpload(controlAddRecipe);
  bookmarksView.addhanderRender(controlBookmarks);
  recipeView.addhandlerRender(controlRecipe);
  recipeView.addhandlerUpdateServings(controlServing);
  recipeView.addhandlerAddBookmark(controlAddBookmark);
  serachView.addhandlerSearch(controlSearchResult);
  paginationView.addhandlerClick(controlPagination);
  newFeature();
};
init();

//Clear all BookMarks
const clearBookmarks = function () {
  localStorage.clear('Bookmarks');
};
// clearBookmarks();
