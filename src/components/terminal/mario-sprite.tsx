// Pixel-art Super Mario sprite. Two running frames, 16x16, classic SMB palette.
// Letters in the grid map to colors below. `.` = transparent.

// Tones drive off CSS custom properties on `.terminal`, so Mario re-skins
// automatically for each terminal theme (matrix / dark / light).
const PALETTE_THEMED: Record<string, string> = {
  R: 'var(--mario-bright)', // cap, shirt
  B: 'var(--mario-outline)', // hair, mustache, shoes
  S: 'var(--mario-mid)', // skin
  O: 'var(--mario-shadow)', // overalls
  Y: 'var(--mario-accent)', // overall buttons
};

// Authentic Super Mario Bros NES palette.
const PALETTE_CLASSIC: Record<string, string> = {
  R: '#e52521', // fire-engine red
  B: '#3a1f04', // dark brown
  S: '#fcd6a6', // peach
  O: '#3a4ae6', // royal blue
  Y: '#fbd000', // amber yellow
};

const FRAME_A = [
  '................',
  '....RRRRR.......',
  '...RRRRRRRRR....',
  '...BBBSSBS......',
  '..BSBSSSSBSSS...',
  '..BSBBSSSSBBSS..',
  '..BBSSSSBBBBBB..',
  '....SSSSSS......',
  '...RRBRRRR......',
  '..RRRRBRRBRRR...',
  '.RRRROOBOOORRRR.',
  '.SSRROOOYOORSSS.',
  '.SSOOOYOOOOSS...',
  '..SOOOYYYOOOS...',
  '.OOO........OOO.',
  'BBBB........BBBB',
];

const FRAME_B = [
  '................',
  '....RRRRR.......',
  '...RRRRRRRRR....',
  '...BBBSSBS......',
  '..BSBSSSSBSSS...',
  '..BSBBSSSSBBSS..',
  '..BBSSSSBBBBBB..',
  '....SSSSSS......',
  '...RRBRRRR......',
  '..RRRRBRRBRRR...',
  '.RRRROOBOOORRRR.',
  '.SSRROOOYOORSSS.',
  '.SSOOOYOOOOSS...',
  '..SOOOYYYOOOS...',
  '....OOOOOO......',
  '....BBBBBB......',
];

const renderFrame = (grid: ReadonlyArray<string>, palette: Record<string, string>) =>
  grid.flatMap((row, y) =>
    Array.from(row).flatMap((ch, x) => {
      const fill = palette[ch];
      if (!fill) return [];
      return [<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />];
    })
  );

export interface MarioSpriteProps {
  frame: 'a' | 'b';
  className?: string;
  /** When true, use authentic SMB colors instead of theme-driven CSS variables. */
  classic?: boolean;
}

export function MarioSprite({ frame, className, classic = false }: MarioSpriteProps) {
  const grid = frame === 'a' ? FRAME_A : FRAME_B;
  const palette = classic ? PALETTE_CLASSIC : PALETTE_THEMED;
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Mario running"
    >
      {renderFrame(grid, palette)}
    </svg>
  );
}
