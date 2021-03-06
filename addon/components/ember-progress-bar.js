import Ember from 'ember';

const {
  Component,
  assign,
  get,
  set,
  typeOf
} = Ember;

function deepObjectAssign(object) {
  Object.keys(object).forEach((key) => {
    if (typeOf(object[key]) === 'object') {
      object[key] = deepObjectAssign(object[key]);
    }
  });

  return assign({}, object);
}

export default Component.extend({
  classNames: ['ember-progress-bar'],
  hook: 'ember_progress_bar',
  onAnimationComplete: null,

  shape: 'Line',
  options: { },

  defaultStep(state, bar) {
    bar.setText((bar.value() * 100).toFixed(0));
  },

  didInsertElement(...args) {
    this._super(...args);

    const shape = get(this, 'shape');
    const options = deepObjectAssign(get(this, 'options'));

    if (get(this, 'useDefaultStep')) {
      set(options, 'step', get(this, 'defaultStep'));
    }

    const progressBar = new ProgressBar[shape](this.element, options);

    set(this, 'progressBar', progressBar);
  },

  didRender(...args) {
    this._super(...args);

    const progress = get(this, 'progress');

    get(this, 'progressBar').animate(progress, () => this.sendAction('onAnimationComplete'));
  },

  willDestroyElement(...args) {
    get(this, 'progressBar').destroy();

    this._super(...args);
  }
});
