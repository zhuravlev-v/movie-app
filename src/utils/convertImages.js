export default function convertImages(image) {
  if (!image) return 
  fetch(image.src)
  .then(res => res.text())
  .then(data => {
    const parser = new DOMParser();
    const svg = parser.parseFromString(data, 'image/svg+xml').querySelector('svg');

    if (image.id) svg.id = image.id;
    if (image.className) svg.classList = image.classList;

    image.parentNode.replaceChild(svg, image);
  })
}