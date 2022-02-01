function insert(newNode) {
  const footerElement = document.querySelector('footer');
  document.body.insertBefore(newNode, footerElement);
}

export { insert };
