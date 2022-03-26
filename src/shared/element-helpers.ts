// Gets all children of a root element, including ones assigned to slots.
export function getChildrenIncludingSlotted(root: Element | ShadowRoot): HTMLElement[] {
  const treeWalker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
  );

  const nodes: HTMLElement[] = [];
  let node = treeWalker.nextNode();

  // recursively walk the tree and add any focusable elements,
  // and children of slots to the
  while (node) {
    nodes.push(node as HTMLElement);

    if (node instanceof HTMLSlotElement) {
      const assigned = node.assignedElements();

      const subNodes = assigned.flatMap(subNode => [
        subNode as HTMLElement,
        ...getChildrenIncludingSlotted(subNode)
      ]);

      nodes.push(...subNodes);
    }

    node = treeWalker.nextNode();
  }

  return nodes;
}

// A simple visibility check, coupled with a check if element is in the bounds
// of another element.
export function isElementVisible(element: HTMLElement, bounds?: DOMRect) {
  // simplified (optimistic) visibility check
  if (!element.offsetHeight || !element.offsetWidth) {
    return false;
  }

  if (!bounds) {
    return true;
  }

  const { x, y } = element.getBoundingClientRect();

  // check if the element is outside the passed bounds
  if (
    x < 0 || x > bounds.x + bounds.width ||
    y < 0 || y > bounds.y + bounds.height
  ) {
    return false;
  }

  return true;
}
