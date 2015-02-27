import Ember from 'ember';
import faker from 'faker';

var Phil = {
  private: {
    parseValue: function(str) {
      str = "" + str;
      if (str.match(/^\d+\.\.\d+$/)) {
        return Phil.private.parseRange(str);
      } else if (str.match(/^.+,.+$/)) {
        return Phil.private.parseArray(str);
      }
      var arr = [];
      arr.push(str);
      return arr;
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
      return str.split(',');
    },
    loopAmount: function(num) {
      return Phil.private.parseRange("1.." + Phil.pick(num));
    },
    wrap: function(tag, content) {
      return "<" + tag + ">" + content + "</" + tag + ">";
    },
    generateTag: function(tag) {
      switch (tag) {
        case 'p':
          return Phil.paragraphs(1);
        case 'blockquote':
          var paragraphs = Phil.paragraphs(Phil.pick("1..3"));
          return (Phil.private.wrap('blockquote', paragraphs));
        default:
          return (Phil.private.wrap(tag, Phil.words("3..15")));
      }
    },
    getFakerMethod: function(name) {
      var methods = name.split('.');
      return faker[methods[0]][methods[1]] || false;
    },
    parseArguments: function(args) {
      var output = [];
      for (var i=1; i < args.length-1; i++) {
        output.push(Phil.pick(args[i]));
      }
      return output;
    }
  },
  pick: function(str) {
    var arr = Phil.private.parseValue(str);
    return arr[Math.floor(Math.random() * arr.length)];
  },
  words: function(num) {
    return faker.lorem.words(Phil.pick(num)).join(' ');
  },
  paragraphs: function(num) {
    var output = [];
    Phil.private.loopAmount(num).forEach(function() {
      output.push(Phil.private.wrap('p', faker.lorem.paragraph()));
    });
    return output.join('');
  },
  tag: function(tag, words) {
    return Phil.private.wrap(tag, Phil.words(words || "5..15"));
  },
  markup: function(tags) {
    return tags.split(' ').map(function(tag) {
      return Phil.private.generateTag(tag);
    }).join(' ');
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
      return new Ember.Handlebars.SafeString(Phil.markup(arg))
    default:
      var fakerMethod = Phil.private.getFakerMethod(property);
      if (fakerMethod) {
        return fakerMethod.apply(this, Phil.private.parseArguments(arguments));
      }
      return;
  }
}
