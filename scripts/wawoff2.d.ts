declare module 'wawoff2' {
  export function compress(input: Buffer | Uint8Array): Promise<Uint8Array>;
  export function decompress(input: Buffer | Uint8Array): Promise<Uint8Array>;

  const wawoff2: {
    compress: typeof compress;
    decompress: typeof decompress;
  };

  export default wawoff2;
}
