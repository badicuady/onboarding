class Utilities {
  static uriParametersToPlainObject() {
    const qp = window.location.search.substring(1);
    const arr = qp.split("&");
    arr.forEach((v, i, _arr) => { _arr[i] = _arr[i] ? ('"' + v.replace("=", '":"') + '"') : ""; });
	return arr.length && arr.every(e => e) ? 
		JSON.parse("{" + arr.join() + "}", (key, value) => (key === "" ? value : decodeURIComponent(value))) 
		: undefined;
  }

  static plainObjectToUriParameters(params) {
    return JSON.stringify(Object.keys(params).reduce((obj, key) => ({ ...obj, [key]: encodeURIComponent(params[key]) }), {}))
      .replace(/[\{\}\"]/gim, "")
      .replace(/\:/gim, "=")
      .replace(/\,/gim, "&");
  }

  static nameof(v) { return Object.keys(v)[0] };

  static debugVariable(variable) {
	console.debug("===============");
	console.debug(`${Utilities.nameof(variable)}:`);
	console.debug(variable);
	console.debug("===============");
  }
}

export default Utilities;
