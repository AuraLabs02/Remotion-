import {getStaticFiles, staticFile} from 'remotion';

// Real channel artwork is optional. When a file exists in public/brand/ it is
// used; otherwise components fall back to the vector stand-ins in this repo.

const files = new Set(getStaticFiles().map((f) => f.name));

const pick = (...names: string[]) => {
  for (const n of names) {
    if (files.has(n)) return staticFile(n);
  }
  return null;
};

const exts = (base: string) => ['png', 'jpg', 'jpeg', 'webp'].map((e) => `${base}.${e}`);

export const REAL = {
  avatar: pick(...exts('brand/avatar')),
  banner: pick(...exts('brand/banner')),
  thumb: (i: number) => pick(...exts(`brand/thumb-${i + 1}`)),
  memberThumb: (i: number) => pick(...exts(`brand/members-${i + 1}`)),
};
