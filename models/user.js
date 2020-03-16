var users = new Map();

exports.findById = function(id, cb) {
  process.nextTick(function() {
    if (users.get(id)) {
      cb(null, users.get(id));
    } else {
      cb(new Error("User " + id + " does not exist"));
    }
  });
};

exports.findOrCreate = function(username, profile, cb) {
  process.nextTick(function() {
    if (users.has(username)){
      return cb(null, users.get(username));      
    } else {
      users.set(username, profile);
      return cb(null, users.get(username));   
    }
  });
}
