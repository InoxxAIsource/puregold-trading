import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { crashed: boolean; }

export class ChatWidgetBoundary extends Component<Props, State> {
  state: State = { crashed: false };

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  componentDidCatch(error: Error) {
    console.error("[ChatWidget] rendering error:", error.message);
  }

  render() {
    if (this.state.crashed) return null;
    return this.props.children;
  }
}
