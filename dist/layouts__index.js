(window['webpackJsonp'] = window['webpackJsonp'] || []).push([
  [0],
  {
    '+ego': function(e, t, n) {
      'use strict';
      n.r(t);
      var a = n('q1tI'),
        c = n.n(a),
        r = n('wEI+'),
        s = (n('PUTc'), n('+Gva')),
        o = () =>
          c.a.createElement(
            'div',
            { style: { textAlign: 'center' } },
            c.a.createElement('p', null, 'Data Not Found'),
          );
      class l extends a['Component'] {
        constructor(e) {
          super(e), (this.state = {});
        }
        render() {
          return c.a.createElement(
            r['a'],
            { locale: s['a'], renderEmpty: o },
            c.a.createElement(
              'div',
              { className: 'basic-layout' },
              this.props.children,
            ),
          );
        }
      }
      t['default'] = l;
    },
    PUTc: function(e, t, n) {},
  },
]);
