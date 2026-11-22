// Stands in for the React support assistant when this folder builds on its
// own from the es-site repo. The assistant lives in the app, so previews built
// there render nothing in its place.
export function mountDocsSupportAssistant() {
  return {
    render() {},
    unmount() {},
  };
}
