class SearchView {
  _parentElement = document.querySelector('.search');
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this.clearinput();
    return query;
  }
  clearinput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
  addhandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
