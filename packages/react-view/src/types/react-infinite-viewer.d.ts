declare module "react-infinite-viewer" {
  import * as React from "react";

  export type InfiniteViewerOnScroll = {
    scrollLeft: number;
    scrollTop: number;
    zoomX: number;
    zoomY: number;
  };

  export type InfiniteViewerOnDragStart = {
    inputEvent?: any;
    target?: Element;
    stop?: () => void;
  };

  export type InfiniteViewerProps = React.PropsWithChildren<{
    className?: string;
    margin?: number;
    threshold?: number;
    rangeX?: number[];
    rangeY?: number[];
    useMouseDrag?: boolean;
    useWheelScroll?: boolean;
    preventWheelClick?: boolean;
    displayVerticalScroll?: boolean;
    displayHorizontalScroll?: boolean;
    onScroll?: (e: InfiniteViewerOnScroll) => void;
    onDragStart?: (e: InfiniteViewerOnDragStart) => boolean | void;
    onDragEnd?: (e: any) => void;
  }>;

  const InfiniteViewer: React.ForwardRefExoticComponent<
    InfiniteViewerProps & React.RefAttributes<any>
  >;

  export default InfiniteViewer;
}

