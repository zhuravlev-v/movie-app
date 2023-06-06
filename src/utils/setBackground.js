export function setBackground(element, url) {
  element.style.setProperty('--background', `linear-gradient(90deg, #1D1D1D 0%, rgba(29, 29, 29, 0.49) 100%), url(${url}), #2D2D2D`);
}