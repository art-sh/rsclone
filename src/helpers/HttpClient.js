const HttpClient = {
  send(url, params = {}) {
    const fetchParams = params.fetch || {};
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
