export function proxyImage(image: string | null) {
  return image ? `/api/imageproxy?url=${image}` : '/noavatar.png';
}
