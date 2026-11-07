// Animation features load after hydration, so they stay off the critical path. Content is
// visible by default, so nothing depends on them arriving.
export const loadFeatures = () => import("./features").then((module) => module.default);
