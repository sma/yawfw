var express = require("express"), 
  mongoose = require("mongoose"), 
  marked = require("marked"), 
  moment = require("moment");

var datatypes = {
  string: String,
  text: String,
  markdown: String,
  number: Number,
  integer: Number,
  boolean: Boolean,
  date: Date
};

/**
 * Defines a new mongoose model.
 * @param name {String} model name
 * @param options {Object} property descriptions
 */
exports.model = function(name, options){
  var types = {};
  for (var key in options){
    var type = options[key];
    if(typeof type.type === "string"){
      options[key].type = datatypes[type.type];
      types[key] = type.type;
    }else if (typeof type === "string"){
      options[key] = datatypes[type];
      types[key] = type;
    }else{
      types[key] = "object";
    }
  }
  return mongoose.model(name, new mongoose.Schema(options));
};

/**
 * Creates the express app.
 * @param db {String} URI to mongodb
 * @param locals {Object} optional
 */
exports.app = function(db, locals){
  mongoose.connect(db);
  var app = express().
    use(express.bodyParser()).
    use(express.methodOverride()).
    use(express.favicon()).
    use(express.static("static")).
    set("view engine", "jade").
    set("views", "views");
  app.locals = merge(merge(app.locals, {
    title: "Yawfw App",
    markdown: marked,
    date: function(d, f){ return moment(d).format(f); }
  }), locals);
  return app;
};

/**
 * Defines the usual 7 routes to access the given model in a RESTful way.
 * @param path {String} path prefix
 * @param model {mongoose.Model} model
 */
exports.resource = function(path, model){
  var app = express(), prefix = model.modelName + "/";
  app.locals.model = model;
  app.get(path, _find(model), _render(prefix + "index"));
  app.get(path + "/new", _new(model), _render(prefix + "new"));
  app.post(path, _new(model), _save(), _redirect(path));
  app.get(path + "/:id", _findOne(model), _render(prefix + "show"));
  app.get(path + "/:id/edit", _findOne(model), _render(prefix + "edit"));
  app.put(path + "/:id", _findOne(model), _save(), _redirect(path));
  app.del(path + "/:id", _findOne(model), _delete(), _redirect(path));
  return app;
};

// returns the persistent properties of the given object
function _properties(object){
  var schema = mongoose.modelSchemas[object.constructor.modelName];
  return Object.keys(schema.tree).filter(function(e){ return e[0] !== '_'; });
}

// returns a list of objects for the given model
function _find(model){
  return function(req, res, next){
    model.find({}, function(err, objects){
      if (err){ return res.send(500); }
      req.model = model;
      req.objects = objects;
      next();
    });
  };
}

// returns the object defined by the request path's id
function _findOne(model){
  return function(req, res, next){
    model.findById(req.params.id, function(err, object){
      if (err){ return res.send(500); }
      if (!object){ return res.send(404); }
      req.object = object;
      next();
    });
  };
}

// create a new instance of the given model
function _new(model){
  return function(req, res, next){
    req.object = new model();
    next();
  };
}

// populates the object's attributes and saves it to the database
function _save(){
  return function(req, res, next){
    _properties(req.object).forEach(function(e){
      if (req.body[e + "_date"]){
        req.object[e] = moment(req.body[e + "_date"] + " " + req.body[e + "_time"]);
      }else{
        req.object[e] = req.body[e];
      }
    });
    req.object.save(function(err){
      if (err){ return res.send(500); }
      next();
    });
  };
}

// deletes the object from the database
function _delete(){
  return function(req, res, next){
    req.object.remove(function(err){
      if (err){ return res.send(500); }
      next();
    });
  };
}

// render the given template, providing the object/objects
function _render(name){
  return function(req, res){
    var locals = req.app.parent ? req.app.parent.locals : null;
    res.render(name, merge({ object: req.object, objects: req.objects }, locals));
  };
}

// redirects to the given path, optionally using the given id
function _redirect(path, useid){
  return function(req, res){
    res.redirect(path + (useid ? "/" + req.params.id : ""));
  };
}

exports.find = _find;
exports.findOne = _findOne;
exports.save = _save;
exports.render = _render;
exports.redirect = _redirect;

// utilities
function merge(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
}
