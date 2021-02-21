import View from './view.js';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addhandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(this._data.result.length / RES_PER_PAGE);

    const markUpPrevBTN = `  
    <button data-goto="${
      currPage - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currPage - 1}</span>
    </button>`;

    const markUpNextBTN = `  
    <button data-goto="${
      currPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
    `;

    //page1 and there are  other pages
    if (currPage === 1 && numPages > 1) {
      return markUpNextBTN;
    }

    // Last Page
    if (currPage === numPages && numPages > 1) {
      return markUpPrevBTN;
    }

    //other pages
    if (currPage < numPages) {
      return markUpPrevBTN + markUpNextBTN;
    }
    //page1 and there are no other pages
    return 'Page 1';
  }
}
export default new PaginationView();
