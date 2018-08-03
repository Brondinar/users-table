const mainBlock = document.getElementById('table');

export function addBlock(view, element = mainBlock) {
  if (!view || !view.element) return;

  element.appendChild(view.element);
}

export function removeBlock(view, element = mainBlock) {
	element.removeChild(view.element);
}