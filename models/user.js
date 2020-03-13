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

exports.findOrCreate = function({id: id, profile: profile}, cb) {
  process.nextTick(function() {
    if (users.has(id)){
      return cb(null, users.get(id));      
    } else {
      users.set(id, {lastName: profile.lastName, firstName: profile.firstName, emails: profile.emails});
      return cb(null, users.get(id));   
    }
  });
}
