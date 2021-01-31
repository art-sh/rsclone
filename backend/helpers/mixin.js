const Mixin = {
  jsonOk(data, res = null) {
    if (!res) {
      return {
        success: true,
        response: data,
      };
    }

    return res.json({
      success: true,
      response: data,
    });
  },
  jsonBad(data, code, res = null) {
    if (!res) {
      return {
        success: false,
        response: data,
      };
    }

    return res
      .status(code)
      .json({
        success: false,
        response: data,
      });
  },
};

module.exports = Mixin;
