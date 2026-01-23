declare module 'katex' {
  export function renderToString(math: string, options?: any): string;
  export function render(math: string, element: Element, options?: any): void;
  const __esModule: boolean;
  export default { renderToString, render } as any;
}
