export default class View {
  _data;

  render(data, section = "") {
    this._data = data;

    const html = this._generateMarkup(section);
    this._parentEl.insertAdjacentHTML("afterbegin", html);
    this.scrollToTop();
  }

  clear() {
    this._parentEl.innerHTML = "";
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}
