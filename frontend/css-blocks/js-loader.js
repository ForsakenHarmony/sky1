const MODULE_TYPE = "css/blocks";

module.exports = function(content, map, meta) {
  // const callback = this.async();

  return content;
};

module.exports.pitch = function(remainingRequests, precedingRequests, data) {
  console.log(remainingRequests, precedingRequests, data);
};
