import Ember from 'ember';
import faker from 'faker';

var PhilUtil = {
  parseValue: function(str) {
    if (typeof str === 'object') { return [str]; }
    str = "" + str;
    if (str.match(/^\d+\.\.\d+$/)) {
      return PhilUtil.parseRange(str);
    } else if (str.match(/^.+,.+$/)) {
      return PhilUtil.parseArray(str);
    }
    if (isNaN(str)) {
      return [str];
    }
    return [+str];
  },
  parseRange: function(str) {
    var endpoints = str.split('..'),
        arr = [];
    for (var i=+endpoints[0]; i <= +endpoints[1]; i++) {
      arr.push(i);
    }
    return arr;
  },
  parseArray: function(str) {
    return str.split(',').map(function(str) { return str.trim(); });
  },
  createArrayTo: function(num) {
    return PhilUtil.parseRange("1.." + Phil.pick(num));
  },
  wrap: function(tag, content) {
    return "<" + tag + ">" + content + "</" + tag + ">";
  },
  generateTag: function(tag, numWords) {
    var wordCount = numWords || "3..15";
    switch (tag) {
      case 'p':
        return Phil.paragraphs(1);
      case 'ul':
        var listItems = PhilUtil.createArrayTo(Phil.pick("1..5")).map(function() {
          return PhilUtil.wrap('li', Phil.words(wordCount));
        }).join('');
        return PhilUtil.wrap("ul", listItems);
      case 'blockquote':
        var paragraphs = Phil.paragraphs(Phil.pick("1..3"));
        return (PhilUtil.wrap('blockquote', paragraphs));
      default:
        return PhilUtil.wrap(tag, Phil.words(wordCount));
    }
  },
  getFakerMethod: function(name) {
    var methods = name.split('.');
    return faker[methods[0]][methods[1]] || false;
  },
  parseArguments: function(args) {
    var argArray = [].slice.call(args, 1);
    var foo = argArray.map(Phil.pick).filter(function(a) {
      return !!a;
    });
    return foo;
  }
};

var Phil = {
  pick: function(str) {
    var arr = PhilUtil.parseValue(str);
    if (!arr) { return; }
    return arr[Math.floor(Math.random() * arr.length)];
  },
  words: function(num) {
    return faker.lorem.words(Phil.pick(num)).join(' ');
  },
  paragraphs: function(num) {
    return PhilUtil.createArrayTo(num).map(function() {
      return PhilUtil.wrap('p', faker.lorem.paragraph());
    }).join('');
  },
  tag: function(tag, num_words) {
    return PhilUtil.generateTag(tag, num_words);
  },
  markup: function(tags) {
    return tags.split(' ').map(function(tag) {
      return PhilUtil.generateTag(tag);
    }).join('');
  }
};

export default function(property, arg) {
  switch(property) {
    case 'pick':
      return Phil.pick(arg);
    case 'words':
      return Phil.words(arg);
    case 'paragraphs':
      return new Ember.Handlebars.SafeString(Phil.paragraphs(arg));
    case 'tag':
      return new Ember.Handlebars.SafeString(Phil.tag(arguments[1], arguments[2]));
    case 'markup':
      return new Ember.Handlebars.SafeString(Phil.markup(arg));
    default:
      var fakerMethod = PhilUtil.getFakerMethod(property);
      if (fakerMethod) {
        return fakerMethod.apply(this, PhilUtil.parseArguments(arguments));
      }
      return;
  }
}
