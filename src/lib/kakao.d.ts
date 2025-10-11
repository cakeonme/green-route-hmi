// Kakao Maps JavaScript API 타입 정의
declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

declare namespace kakao {
  namespace maps {
    class LatLng {
      constructor(latitude: number, longitude: number);
      getLat(): number;
      getLng(): number;
    }

    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      setLevel(level: number, options?: { animate?: boolean }): void;
      getLevel(): number;
      setBounds(bounds: LatLngBounds, paddingTop?: number, paddingRight?: number, paddingBottom?: number, paddingLeft?: number): void;
      getBounds(): LatLngBounds;
      panTo(latlng: LatLng): void;
    }

    interface MapOptions {
      center: LatLng;
      level?: number;
      mapTypeId?: MapTypeId;
      draggable?: boolean;
      scrollwheel?: boolean;
      disableDoubleClick?: boolean;
      disableDoubleClickZoom?: boolean;
      projectionId?: string;
      tileAnimation?: boolean;
      keyboardShortcuts?: boolean;
    }

    enum MapTypeId {
      ROADMAP = 1,
      SKYVIEW = 2,
      HYBRID = 3,
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setPosition(position: LatLng): void;
      getPosition(): LatLng;
      setZIndex(zIndex: number): void;
      setVisible(visible: boolean): void;
      setTitle(title: string): void;
      setImage(image: MarkerImage): void;
      setOpacity(opacity: number): void;
    }

    interface MarkerOptions {
      map?: Map;
      position: LatLng;
      image?: MarkerImage;
      title?: string;
      draggable?: boolean;
      clickable?: boolean;
      zIndex?: number;
      opacity?: number;
      altitude?: number;
      range?: number;
    }

    class MarkerImage {
      constructor(src: string, size: Size, options?: MarkerImageOptions);
    }

    interface MarkerImageOptions {
      alt?: string;
      coords?: string;
      offset?: Point;
      shape?: string;
      spriteOrigin?: Point;
      spriteSize?: Size;
    }

    class Size {
      constructor(width: number, height: number);
    }

    class Point {
      constructor(x: number, y: number);
    }

    class Polyline {
      constructor(options: PolylineOptions);
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setPath(path: LatLng[]): void;
      getPath(): LatLng[];
      setZIndex(zIndex: number): void;
    }

    interface PolylineOptions {
      map?: Map;
      endArrow?: boolean;
      path?: LatLng[];
      strokeWeight?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeStyle?: string;
      zIndex?: number;
    }

    class Polygon {
      constructor(options: PolygonOptions);
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setPath(path: LatLng[] | LatLng[][]): void;
      getPath(): LatLng[] | LatLng[][];
    }

    interface PolygonOptions {
      map?: Map;
      path?: LatLng[] | LatLng[][];
      strokeWeight?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeStyle?: string;
      fillColor?: string;
      fillOpacity?: number;
      zIndex?: number;
    }

    class CustomOverlay {
      constructor(options: CustomOverlayOptions);
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setPosition(position: LatLng): void;
      getPosition(): LatLng;
      setContent(content: string | HTMLElement): void;
      getContent(): HTMLElement;
      setZIndex(zIndex: number): void;
      setAltitude(altitude: number): void;
      setRange(range: number): void;
      setVisible(visible: boolean): void;
    }

    interface CustomOverlayOptions {
      map?: Map;
      clickable?: boolean;
      content?: string | HTMLElement;
      position: LatLng;
      xAnchor?: number;
      yAnchor?: number;
      zIndex?: number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(latlng: LatLng): void;
      contain(latlng: LatLng): boolean;
      getSouthWest(): LatLng;
      getNorthEast(): LatLng;
      isEmpty(): boolean;
    }

    class InfoWindow {
      constructor(options: InfoWindowOptions);
      open(map: Map, marker: Marker): void;
      close(): void;
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setPosition(position: LatLng): void;
      getPosition(): LatLng;
      setContent(content: string | HTMLElement): void;
      getContent(): HTMLElement;
      setZIndex(zIndex: number): void;
    }

    interface InfoWindowOptions {
      map?: Map;
      position?: LatLng;
      content?: string | HTMLElement;
      removable?: boolean;
      zIndex?: number;
    }

    function load(callback: () => void): void;

    namespace services {
      class Geocoder {
        addressSearch(
          address: string,
          callback: (result: any[], status: Status) => void
        ): void;
        coord2Address(
          lng: number,
          lat: number,
          callback: (result: any[], status: Status) => void
        ): void;
      }

      enum Status {
        OK = "OK",
        ZERO_RESULT = "ZERO_RESULT",
        ERROR = "ERROR",
      }
    }

    namespace event {
      function addListener(
        target: any,
        type: string,
        handler: Function
      ): void;
      function removeListener(
        target: any,
        type: string,
        handler: Function
      ): void;
    }
  }
}

export {};