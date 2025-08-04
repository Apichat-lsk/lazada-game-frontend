interface Window {
  grecaptcha: {
    render: (container: string | HTMLElement, parameters: any) => number;
    getResponse: (widgetId?: number) => string;
    reset: (widgetId?: number) => void;
  };
}
