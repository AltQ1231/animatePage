(window['webpackJsonp'] = window['webpackJsonp'] || []).push([
  [2],
  {
    DZLn: function(e, t, n) {},
    Wngw: function(e, t, n) {
      e.exports = n.p + 'static/bg.363dd8a2.png';
    },
    jLwg: function(e, t, n) {
      'use strict';
      n.r(t);
      var a = n('q1tI'),
        r = n.n(a);
      n('DZLn');
      class c extends a['Component'] {
        constructor(e) {
          super(e), (this.state = { dotArrs: [], looptime: 18 });
        }
        componentDidMount() {
          for (var e = [], t = 1; t < 71; t++) e.push(t);
          this.setState({ dotArrs: e });
        }
        handleTime(e) {
          var t = this.state,
            n = t.dotArrs,
            a = t.looptime,
            r = (2 * a) / n.length,
            c = -a / 2;
          return (c = e > 1 ? -a / 2 - (e - 1) * r : -a / 2), c;
        }
        handleSecondTime(e) {
          var t = this.state,
            n = t.dotArrs,
            a = t.looptime,
            r = (2 * a) / n.length,
            c = 0;
          return (c = e > 1 ? 0 - (e - 1) * r : 0), c;
        }
        generateRandom(e) {
          var t = Math.floor(10 * Math.random()),
            n = 0;
          return (n = t >= 5 ? t : -t), n;
        }
        generateSizeRandom() {
          var e = Math.floor(12 * Math.random()),
            t = 5;
          return (t = e <= 4 ? 6 : 4 < e <= 8 ? 5 : 4), t;
        }
        render() {
          var e = this.state,
            t = e.dotArrs,
            a = e.looptime;
          return r.a.createElement(
            'div',
            { className: 'main-page-container flex-col' },
            r.a.createElement(
              'div',
              { className: 'top-banner-container' },
              r.a.createElement('img', {
                className: 'bg-img-background',
                src: n('Wngw'),
              }),
              r.a.createElement(
                'div',
                { className: 'center-banner-container flex-row' },
                r.a.createElement('img', {
                  className: 'bg-img',
                  src: n('Wngw'),
                }),
                r.a.createElement(
                  'div',
                  { className: 'loop-circle-container' },
                  t.map((e, t) => {
                    var n = this.generateSizeRandom();
                    return r.a.createElement('div', {
                      key: e,
                      className: 'circle',
                      style: {
                        animation: 'animX '
                          .concat(a, 's cubic-bezier(0.36, 0, 0.64, 1) ')
                          .concat(
                            this.handleTime(t + 1, a),
                            's infinite alternate,\n                                        animY ',
                          )
                          .concat(a, 's cubic-bezier(0.36, 0, 0.64, 1) ')
                          .concat(
                            this.handleSecondTime(t + 1, a),
                            's infinite alternate,\n                                        scale ',
                          )
                          .concat(2 * a, 's cubic-bezier(0.36, 0, 0.64, 1) ')
                          .concat(
                            this.handleSecondTime(t + 1, a),
                            's infinite alternate',
                          ),
                        marginTop: ''.concat(this.generateRandom(t), 'px'),
                        marginLeft: ''.concat(this.generateRandom(t), 'px'),
                        width: ''.concat(n, 'px'),
                        height: ''.concat(n, 'px'),
                      },
                    });
                  }),
                ),
              ),
            ),
            r.a.createElement(
              'div',
              { className: 'fill-flex bottom-container' },
              'content',
            ),
          );
        }
      }
      t['default'] = c;
    },
  },
]);
