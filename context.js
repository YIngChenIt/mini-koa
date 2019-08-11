let context = {};
function defineGetter(property, key) {
  context.__defineGetter__(key, function() { // getter
    return this[property][key];
  });
}
function defineSetter(property,key){
  context.__defineSetter__(key,function(value){ // setter
    this[property][key] =value;
  })
}

defineGetter("request", "path");
defineGetter("request", "url");
defineGetter("response", "body");
defineSetter('response',"body");
module.exports = context;