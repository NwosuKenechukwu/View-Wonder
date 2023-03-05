export default class View {
  _data;

  setData(data) {
    this._data = data;
  }

  render() {
    const html = this._generateMarkup();
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
