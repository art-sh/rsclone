const mergeOptions = require('merge-options');

const HttpClient = {
  send(url, params = {}) {
    const storage = params.storage || {};
    const defaultFetchParams = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    if (storage.userToken) {
      defaultFetchParams.headers['App-Token'] = storage.userToken;
    }

    const fetchParams = mergeOptions(defaultFetchParams, params.fetch || {});
    const callbackSuccess = params.success || null;
    const callbackError = params.error || null;
    const responseType = params.responseType || 'json';
    fetch(url, fetchParams)
      .then((response) => ({
        result: response[responseType](),
        response,
      }))
      .then((result) => callbackSuccess && callbackSuccess(result))
      .catch((error) => callbackError && callbackError(error));
  },
};

export default HttpClient;
