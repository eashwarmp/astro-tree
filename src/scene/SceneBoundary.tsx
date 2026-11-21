import { Component, type ReactNode } from "react";

/**
 * If WebGL fails (old GPU, lost context, blocked by the browser) drop the 3D layer and keep
 * the page usable: the nebula backdrop and every reading are plain HTML.
 */
export default class SceneBoundary extends Component<{ children: ReactNode; onError?: () => void }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D scene disabled:", error);
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
