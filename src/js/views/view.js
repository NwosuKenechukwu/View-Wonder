export default class View {
  _data;

  render(data, pageTitle = "") {
    this._data = data;

    const headerHTMl = this._generateTitle(pageTitle);
    this._parentEl.insertAdjacentHTML("beforebegin", headerHTMl);

    const html = this._generateCardHTML(data);
    this._parentEl.insertAdjacentHTML("afterbegin", html);
  }
}
