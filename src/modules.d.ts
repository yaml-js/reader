declare module '*.yaml' {
  const data: Record<string, any>;
  export default data;
}

declare module '*.yml' {
  const data: Record<string, any>;
  export default data;
}
