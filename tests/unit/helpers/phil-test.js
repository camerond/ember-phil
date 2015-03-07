import phil from '../../../helpers/phil';
import qunit from 'qunit';

var test = qunit.test,
    module = qunit.module,
    assert = qunit.assert;

module('PhilHelper');

assert.isInArray = function(val, array) {
  this.push((array.indexOf(val) !== -1), val, array, val + ' is in ' + array.join(','));
};

assert.isWithin = function(val, min, max) {
  var within = (val >= min) && (val <= max);
  var message =  message || val + ' is within ' + min + '..' + max;
  this.push(within, val, min + '..' + max, message);
};

test('pick', function(assert) {
  var testArray = ['foo', 'bar', 'baz'];
  var result = phil('pick', testArray.join(','));
  assert.isInArray(result, testArray);

  var testRange = phil('pick', '1..100');
  assert.isWithin(testRange, 1, 100);
});

test('words', function(assert) {
  var words = phil('words', '20');
  assert.ok(words.split(' ').length, 20);

  var wordsWithRange = phil('words', '50..100');
  assert.isWithin(wordsWithRange.split(' ').length, 50, 100);
});

test('paragraphs', function(assert) {
  var paragraphs = phil('paragraphs', '3').string;
  assert.ok(paragraphs.split('</p><p>').length, 3);

  var paragraphsWithRange = phil('paragraphs', '5..10').string;
  console.log(paragraphsWithRange);
  assert.isWithin(paragraphsWithRange.split('</p><p>').length, 5, 10);
});

test('tag', function(assert) {
  var h5 = phil('tag', 'h5').string;
  assert.ok(h5.match(/^<h5>.+<\/h5>/), 'h5 tag generated');
  assert.isWithin(h5.split(' ').length, 3, 15);

  var customh5 = phil('tag', 'h5', 5).string;
  assert.ok(h5.split(' ').length, 5);

  var ul = phil('tag', 'ul', '5..15').string;
  var li = ul.match(/^<ul>.+<\/ul>/)[0];

  assert.ok(li.match(/(<li>)+/g), 'list items contained in ul');
});

test('markup', function(assert) {
  var markup = phil('markup', 'h1 blockquote ul p p').string.replace(/\n/g, '');

  assert.ok(markup.match(/^<h1>.+<\/h1>/), 'starts with filled h1 tag');
  assert.ok(markup.match(/<\/h1><blockquote>.+<\/blockquote>/), 'followed by blockquote');
  assert.ok(markup.match(/<ul>(<li>.+<\/li>){1,5}/), 'followed by 1..5 list items');
  assert.ok(markup.match(/<\/ul>(<p>.+<\/p>){2}$/), 'followed by 2 paragraphs');
});

test('passing through method to Faker with integer arguments', function(assert) {
  var amount = phil('finance.amount', '2', '3');

  assert.isWithin(amount, 2, 3);
});

test('passing through method to Faker with range arguments', function(assert) {
  var amount = phil('finance.amount', '5..10', '30..35');

  assert.isWithin(amount, 5, 35);
});

test('passing through method to Faker with string arguments', function(assert) {
  var phone = phil('phone.phoneNumber', '###-####');

  assert.ok(phone.match(/\d{3}-\d{4}/), 'Phone number matches format');
});

test('passing through method to Faker with object arguments', function(assert) {
  var from = new Date('Jan 1, 1800');
  var to = new Date('Jan 1, 1850');
  var date = phil('date.future', '1', from);

  assert.isWithin(date, from, to);
});
