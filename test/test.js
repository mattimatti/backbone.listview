(function() {
  'use strict';
  var TestView;
  var ListView = Backbone.ListView.extend({
    el: '<div></div>',
    className: 'list',
    itemEvents: {
      'click': 'onClick'
    },

    onClick: function(model, e) {
      this.trigger('item:click', model, e);
    }
  });

  var testCollection = new Backbone.Collection([{id: 1, name: 'Charizard'}, {id: 2, name: 'Alakazam'}]);

  module('Backbone.View', {

    setup: function() {
      TestView = Backbone.View.extend({
        el: '<div></div>',
        template: '<div class="list"><div>',
        render: function() {
          this.$el.html(this.template);
          return this;
        }
      });
    }
  });

  test('Simple render test', function() {
    var view = new TestView();
    view.render();
    equal(view.$('.list').length, 1, 'Should have applied template with the class list.' );
  });

  test('Render collection', function() {
    var view = new ListView({
      collection: testCollection
    });
    view.render();
    equal(view.$('div').length, 2, 'Should be 2 list items.');
  });


  test('Test event clicks on items', function() {
    var clickCount = 0;

    var view = new ListView({
      collection: testCollection
    });

    view.render();
    view.on('item:click', function() {
      clickCount++;
    });

    $(view.$el.find('div')[1]).trigger('click').trigger('click');

    equal(clickCount, 2, 'Should be 2 clicks.');
  });

  test('Add list item', function() {
    var view = new ListView({
      collection: testCollection
    });

    view.render();

    testCollection.add({id: 5, name: 'Pikachu'});

    equal(view.$('div').length, 3, 'Should be 3 list items.');
  });


  test('Remove item from collection', function() {
    var clickCount = 0;
    var testCollection = new Backbone.Collection([{id: 1, name: 'Charizard'}, {id: 2, name: 'Alakazam'}]);

    var view = new ListView({
      collection: testCollection
    });

    view.render();
    var model = testCollection.at(0);
    var selectedView = view.getViewByModel(model);
    view.on('item:click', function() {
      clickCount++;
    });
    selectedView.trigger('click');
    equal(clickCount, 1, 'Should be 1 click');
    testCollection.remove(model);
    equal(view.$('div').length, 1, 'Should be 1 list items.');
    equal(_.size(view.items), 1, 'There should be 1 item in view items.');

    clickCount = 0;
    selectedView.trigger('click');
    equal(clickCount, 0, 'Should be 0 click events after removal.');
  });

  test('Parameter passing from list to item', function() {
    var additionalTestParam = '';
    var expectedTestParam = 'some additional data';

    var ListView = Backbone.ListView.extend({
      el: '<div></div>',
      className: 'list',
      itemEvents: {
        'click': 'onClick'
      },

      onClick: function(model, e) {
        this.trigger('item:click', model, e, expectedTestParam);
      }
    });

    var view = new ListView({
      collection: testCollection
    });

    view.render();

    view.on('item:click', function(model, e, aditionalParam) {
      additionalTestParam = aditionalParam;
    });
    view.getViewByModel(testCollection.at(0)).trigger('click');
    equal(additionalTestParam, expectedTestParam, 'Should pass parametar from item to list.');
  });

  test('Test removal of items and rerender of collection', function() {
    var testCollection = new Backbone.Collection([{id: 1, name: 'Charizard'}, {id: 2, name: 'Alakazam'}]);
    var clickCount = 0;

    var view = new ListView({
      collection: testCollection
    });

    view.render();

    view.removeAllItems();
    equal(view.$('div').length, 0, 'Should be 0 list items in DOM.');
    equal(view.collection.length, 2, 'Collection length should be unchanged');
    view.render();
    equal(view.$('div').length, 2, 'After rerender: Should be 2 list items in DOM.');
    equal(view.collection.length, 2, 'After rerender: Collection length should be unchanged.');

    testCollection.add({id: 3, name: 'Pikachu'});
    equal(view.$('div').length, 3, 'After rerender: Should be 3 list items in DOM.');

    clickCount = 0;
    view.on('item:click', function() {
      clickCount++;
    });
    var model = testCollection.at(0);
    var selectedView = view.getViewByModel(model);
    selectedView.trigger('click');
    equal(clickCount, 1, 'Check listeners after rerender');

    clickCount = 0;
    testCollection.trigger('reset');

    selectedView.trigger('click');
    equal(clickCount, 0, 'Check listeners after collection fetch');

    selectedView = view.getViewByModel(model);
    selectedView.trigger('click');

    equal(clickCount, 1, 'Check listeners after collection fetch');
    equal(view.$('div').length, 3, 'After rerender: Should be 3 list items in DOM.');

    view.remove();
    equal(view.$('div').length, 0, 'After list remove: Should be 0 list items in DOM.');
    equal(_.size(view.items), 0, 'After list remove: Should be 0  items in list.');

  });

})();
