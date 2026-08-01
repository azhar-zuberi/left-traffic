import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

// Custom aviation-inspired line-icon set (docs/DESIGN_SYSTEM.md: "Use custom aviation-inspired
// iconography whenever possible"). Every glyph shares the same construction — 24x24 viewBox,
// round caps/joins, a single stroke weight — so the set reads as one system rather than a grab
// bag of shapes. A few icons lean on the aviation motif where it's a natural fit (hangar-door
// home, compass-dial settings, airspeed-style gauge) rather than forcing it everywhere; most stay
// as clean geometric line icons, which is closer to how Garmin/Rivian/Linear actually do this than
// literal aircraft parts on every glyph would be.
//
// Names intentionally mirror the Ionicons names they replace, so call sites didn't need to be
// renamed — only re-pointed at this component. `logo-google` / `logo-apple` are NOT covered here:
// those are third-party brand marks with their own guidelines and stay on Ionicons.
export type IconName =
  | 'home-outline'
  | 'airplane'
  | 'airplane-outline'
  | 'notifications-outline'
  | 'person-outline'
  | 'person-add'
  | 'people-outline'
  | 'chevron-back'
  | 'chevron-forward'
  | 'chevron-down'
  | 'arrow-up-circle'
  | 'checkmark'
  | 'checkmark-outline'
  | 'image-outline'
  | 'images-outline'
  | 'compass-outline'
  | 'play-circle-outline'
  | 'camera-outline'
  | 'close-circle'
  | 'location-outline'
  | 'heart'
  | 'heart-outline'
  | 'chatbubble'
  | 'chatbubble-outline'
  | 'bookmark'
  | 'bookmark-outline'
  | 'settings-outline'
  | 'add'
  | 'options-outline'
  | 'ribbon-outline'
  | 'mail-outline'
  | 'speedometer-outline'
  | 'information-circle-outline'
  | 'log-out-outline'
  | 'time-outline'
  | 'construct-outline'
  | 'pricetag-outline';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  style?: object;
};

const AIRPLANE_D =
  'M12 2 L13 9.2 L21 11.5 L21 13 L13 11 L13.6 18 L16.5 19.8 L16.5 21 L12 19.8 L7.5 21 L7.5 19.8 L10.4 18 L11 11 L3 13 L3 11.5 L11 9.2 Z';

export function Icon({ name, size = 24, color = '#1C1C1E', style }: Props) {
  const strokeWidth = 1.75;
  const line = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const dot = { fill: color };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={[{ flexShrink: 0 }, style]}>
      {(() => {
        switch (name) {
          case 'home-outline':
            return (
              <>
                <Path d="M3 11.5 L12 4 L21 11.5" {...line} />
                <Path d="M5 10.2 L5 20 L19 20 L19 10.2" {...line} />
                <Line x1="10" y1="13.5" x2="10" y2="20" {...line} />
                <Line x1="14" y1="13.5" x2="14" y2="20" {...line} />
              </>
            );
          case 'airplane':
            return <Path d={AIRPLANE_D} fill={color} stroke="none" />;
          case 'airplane-outline':
            return <Path d={AIRPLANE_D} {...line} />;
          case 'notifications-outline':
            return (
              <>
                <Path d="M6 10a6 6 0 0 1 12 0v3.5l2 3.5H4l2-3.5Z" {...line} />
                <Path d="M10.3 19.5a1.9 1.9 0 0 0 3.4 0" {...line} />
              </>
            );
          case 'person-outline':
            return (
              <>
                <Circle cx="12" cy="8" r="3.3" {...line} />
                <Path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" {...line} />
              </>
            );
          case 'person-add':
            return (
              <>
                <Circle cx="9.5" cy="8" r="2.8" {...line} />
                <Path d="M3.5 19.5c0-3.5 2.5-6 6-6s6 2.5 6 6" {...line} />
                <Line x1="18" y1="6" x2="18" y2="12" {...line} />
                <Line x1="15" y1="9" x2="21" y2="9" {...line} />
              </>
            );
          case 'people-outline':
            return (
              <>
                <Circle cx="15.2" cy="7.8" r="2.4" {...line} />
                <Path d="M10.5 19.2c0-3.3 2.2-5.4 4.9-5.4s4.8 2.1 4.8 5.4" {...line} />
                <Circle cx="8.6" cy="8.3" r="2.9" {...line} />
                <Path d="M3 19.5c0-3.7 2.5-6 5.6-6s5.6 2.3 5.6 6" {...line} />
              </>
            );
          case 'chevron-back':
            return <Polyline points="15,5 8,12 15,19" {...line} />;
          case 'chevron-forward':
            return <Polyline points="9,5 16,12 9,19" {...line} />;
          case 'chevron-down':
            return <Polyline points="5,9 12,16 19,9" {...line} />;
          case 'arrow-up-circle':
            return (
              <>
                <Circle cx="12" cy="12" r="9.25" {...line} />
                <Line x1="12" y1="16" x2="12" y2="8" {...line} />
                <Polyline points="8.5,11.5 12,8 15.5,11.5" {...line} />
              </>
            );
          case 'checkmark':
          case 'checkmark-outline':
            return <Polyline points="5,13 10,18 19,7" {...line} />;
          case 'image-outline':
            return (
              <>
                <Path d="M3.5 4.5 h17 a1 1 0 0 1 1 1 v13 a1 1 0 0 1 -1 1 h-17 a1 1 0 0 1 -1 -1 v-13 a1 1 0 0 1 1 -1 Z" {...line} />
                <Circle cx="8.7" cy="9.5" r="1.6" {...line} />
                <Path d="M4.5 17.5 L9.5 12.5 L13 16 L16.5 12.5 L19.7 15.7" {...line} />
              </>
            );
          case 'images-outline':
            return (
              <>
                <Path d="M7 7 V5 a1 1 0 0 1 1 -1 h11 a1 1 0 0 1 1 1 v11 a1 1 0 0 1 -1 1 h-2" {...line} />
                <Path d="M3.5 7 h13 a1 1 0 0 1 1 1 v11 a1 1 0 0 1 -1 1 h-13 a1 1 0 0 1 -1 -1 V8 a1 1 0 0 1 1 -1 Z" {...line} />
                <Circle cx="8" cy="11.2" r="1.3" {...line} />
              </>
            );
          case 'compass-outline':
            return (
              <>
                <Circle cx="12" cy="12" r="9" {...line} />
                <Path d="M12 6 L14 12 L12 18 L10 12 Z" {...line} />
              </>
            );
          case 'play-circle-outline':
            return (
              <>
                <Circle cx="12" cy="12" r="9.25" {...line} />
                <Path d="M10 8.5 L16 12 L10 15.5 Z" fill={color} stroke="none" />
              </>
            );
          case 'camera-outline':
            return (
              <>
                <Path d="M9 5 L10 3.5 L14 3.5 L15 5" {...line} />
                <Path d="M3.5 5 h17 a1 1 0 0 1 1 1 v12.5 a1 1 0 0 1 -1 1 h-17 a1 1 0 0 1 -1 -1 v-12.5 a1 1 0 0 1 1 -1 Z" {...line} />
                <Circle cx="12" cy="12.2" r="3.8" {...line} />
              </>
            );
          case 'close-circle':
            return (
              <>
                <Circle cx="12" cy="12" r="9.25" {...line} />
                <Line x1="8.5" y1="8.5" x2="15.5" y2="15.5" {...line} />
                <Line x1="15.5" y1="8.5" x2="8.5" y2="15.5" {...line} />
              </>
            );
          case 'location-outline':
            return (
              <>
                <Path d="M12 21s7-7.4 7-12.4A7 7 0 0 0 5 8.6C5 13.6 12 21 12 21Z" {...line} />
                <Circle cx="12" cy="8.5" r="2.3" {...line} />
              </>
            );
          case 'heart':
          case 'heart-outline': {
            const d =
              'M12 20s-7.5-4.6-10-9.3C0.5 7.5 2 4 5.5 4c2 0 3.5 1.2 4.5 2.8C11 5.2 12.5 4 14.5 4 18 4 19.5 7.5 18 10.7 15.5 15.4 12 20 12 20Z';
            return name === 'heart' ? <Path d={d} fill={color} stroke="none" /> : <Path d={d} {...line} />;
          }
          case 'chatbubble':
          case 'chatbubble-outline': {
            const d = 'M4 5 h16 a1 1 0 0 1 1 1 v10 a1 1 0 0 1 -1 1 H9 l-4.5 4 v-4 H4 a1 1 0 0 1 -1 -1 V6 a1 1 0 0 1 1 -1 Z';
            return name === 'chatbubble' ? <Path d={d} fill={color} stroke="none" /> : <Path d={d} {...line} />;
          }
          case 'bookmark':
          case 'bookmark-outline': {
            const d = 'M6 3.5 h12 a1 1 0 0 1 1 1 V21 l-7-4.2 -7 4.2 V4.5 a1 1 0 0 1 1 -1 Z';
            return name === 'bookmark' ? <Path d={d} fill={color} stroke="none" /> : <Path d={d} {...line} />;
          }
          case 'settings-outline':
            return (
              <>
                <Circle cx="12" cy="12" r="8" {...line} />
                <Line x1="12" y1="1.5" x2="12" y2="4" {...line} />
                <Line x1="12" y1="20" x2="12" y2="22.5" {...line} />
                <Line x1="1.5" y1="12" x2="4" y2="12" {...line} />
                <Line x1="20" y1="12" x2="22.5" y2="12" {...line} />
                <Circle cx="12" cy="12" r="1.3" {...dot} />
              </>
            );
          case 'add':
            return (
              <>
                <Line x1="12" y1="5" x2="12" y2="19" {...line} />
                <Line x1="5" y1="12" x2="19" y2="12" {...line} />
              </>
            );
          case 'options-outline':
            return (
              <>
                <Line x1="4" y1="6" x2="20" y2="6" {...line} />
                <Circle cx="15" cy="6" r="2" {...line} />
                <Line x1="4" y1="12" x2="20" y2="12" {...line} />
                <Circle cx="9" cy="12" r="2" {...line} />
                <Line x1="4" y1="18" x2="20" y2="18" {...line} />
                <Circle cx="17" cy="18" r="2" {...line} />
              </>
            );
          case 'ribbon-outline':
            return (
              <>
                <Path d="M11 12 C8 11 5 10.3 2.3 12.5 C5 12 8 13 11 13.3 Z" fill={color} stroke="none" />
                <Path d="M13 12 C16 11 19 10.3 21.7 12.5 C19 12 16 13 13 13.3 Z" fill={color} stroke="none" />
                <Circle cx="12" cy="12.3" r="1.5" {...line} />
              </>
            );
          case 'mail-outline':
            return (
              <>
                <Path d="M3.5 5.5 h17 a1 1 0 0 1 1 1 v11 a1 1 0 0 1 -1 1 h-17 a1 1 0 0 1 -1 -1 v-11 a1 1 0 0 1 1 -1 Z" {...line} />
                <Path d="M4 7 L12 13.5 L20 7" {...line} />
              </>
            );
          case 'speedometer-outline':
            return (
              <>
                <Path d="M4 17 A8 8 0 0 1 20 17" {...line} />
                <Line x1="12" y1="17" x2="15.8" y2="11.5" {...line} />
                <Circle cx="12" cy="17" r="1.3" {...dot} />
              </>
            );
          case 'information-circle-outline':
            return (
              <>
                <Circle cx="12" cy="12" r="9.25" {...line} />
                <Line x1="12" y1="11" x2="12" y2="16.5" {...line} />
                <Circle cx="12" cy="7.6" r="1.1" {...dot} />
              </>
            );
          case 'time-outline':
            return (
              <>
                <Circle cx="12" cy="12" r="9.25" {...line} />
                <Line x1="12" y1="12" x2="12" y2="7" {...line} />
                <Line x1="12" y1="12" x2="15.5" y2="13.5" {...line} />
              </>
            );
          case 'construct-outline':
            return (
              <>
                <Path d="M9 3 h6 a1 1 0 0 1 1 1 v6 h-8 V4 a1 1 0 0 1 1 -1 Z" {...line} />
                <Line x1="12" y1="10" x2="12" y2="14" {...line} />
                <Path d="M7.5 14 h9 l-1 6.5 h-7 Z" {...line} />
              </>
            );
          case 'pricetag-outline':
            return (
              <>
                <Path d="M4 4 H11 L20 13 L13 20 L4 11 Z" {...line} />
                <Circle cx="7.5" cy="7.5" r="1.3" {...line} />
              </>
            );
          case 'log-out-outline':
            return (
              <>
                <Path d="M9 4 H5 a1 1 0 0 0 -1 1 v14 a1 1 0 0 0 1 1 h4" {...line} />
                <Line x1="10" y1="12" x2="21" y2="12" {...line} />
                <Polyline points="17,8 21,12 17,16" {...line} />
              </>
            );
          default:
            return null;
        }
      })()}
    </Svg>
  );
}
