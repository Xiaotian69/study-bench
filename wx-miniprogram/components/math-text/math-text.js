const { parseText } = require('../../utils/parser');

Component({
  options: {
    addGlobalClass: true,  // lets parent pages override styles
    styleIsolation: 'apply-shared',
  },
  properties: {
    text: { type: String, value: '' },
    size: { type: String, value: 'normal' }, // normal | small | large
    color: { type: String, value: '' },      // override text color
  },
  data: {
    nodes: [],
    inlineStyle: '',
  },
  observers: {
    text(val) {
      this.setData({ nodes: parseText(val || '') });
    },
    color(val) {
      this.setData({ inlineStyle: val ? 'color:' + val + ';' : '' });
    },
  },
  lifetimes: {
    attached() {
      if (this.data.text) {
        this.setData({ nodes: parseText(this.data.text) });
      }
      if (this.data.color) {
        this.setData({ inlineStyle: 'color:' + this.data.color + ';' });
      }
    },
  },
});
