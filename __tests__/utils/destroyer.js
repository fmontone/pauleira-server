/* eslint-disable import/prefer-default-export */

import fs from 'fs';
import { resolve } from 'path';

export function clearGallery(gallery_id) {
  const path = resolve(__dirname, '..', 'imgs-gallery', `${gallery_id}`);

  const files = fs.readdirSync(path);

  files.forEach(file => fs.unlinkSync(resolve(path, file)));

  fs.rmdirSync(path);
}

export function clearProfile(fileName) {
  fs.unlinkSync(resolve(__dirname, '..', 'imgs-profile', fileName));
}
