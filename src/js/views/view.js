export default class View {
  _data;

  render(data, section = "") {
    this._data = data;

    const html = this._generateMarkup(section);
    this.scrollToTop();
    this._parentEl.insertAdjacentHTML("afterbegin", html);
  }

  clear() {
    this._parentEl.innerHTML = "";
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
