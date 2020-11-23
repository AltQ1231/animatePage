
// function changeTitle(matchedRoutes) {
//   console.log('APP', matchedRoutes);
//   if (this.props.route.title) {
//     document.title = this.props.route.title
//   } else {
//     document.title = '车间看板'
//   }
// };

export function onRouteChange({ matchedRoutes }) {
  if (matchedRoutes.length) {
    const tempTitle = matchedRoutes[matchedRoutes.length - 1].route.title || '车间看板';
    document.title = tempTitle
    localStorage.setItem('title', tempTitle)
  }
}
