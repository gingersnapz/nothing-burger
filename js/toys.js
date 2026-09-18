function button(text, onClick, className = 'play-button') {
  const node = document.createElement('button');
  node.type = 'button';
  node.className = className;
  node.textContent = text;
  node.addEventListener('click', onClick);
  return node;
}
function status(container, text) {
  const node = document.createElement('p');
  node.className = 'play-status';
  node.textContent = text;
  container.append(node);
  return node;
}
export const interactions = {
  bubbles(container) {
    const row = document.createElement('div');
    row.className = 'pop-row';
    container.append(row);
    const message = status(container, '0 of 6 bubbles popped. A clean slate.');
    let popped = 0;
    for (let i = 0; i < 6; i++) {
      const bubble = button('', () => {
        bubble.disabled = true;
        bubble.textContent = '·';
        bubble.setAttribute('aria-label', `Bubble ${i + 1}, popped`);
        popped++;
        message.textContent = popped === 6 ? 'All popped. You have accomplished absolutely enough.' : `${popped} of 6 bubbles popped. Keep up the unnecessary work.`;
      }, 'bubble');
      bubble.setAttribute('aria-label', `Pop bubble ${i + 1}`);
      row.append(bubble);
    }
  },
  coin(container) {
    const flip = button('Flip the coin ↻', () => {
      message.textContent = Math.random() < .5 ? 'Heads. The coin seems very sure about this.' : 'Tails. An equally well-researched conclusion.';
    });
    container.append(flip);
    const message = status(container, 'The coin awaits your very minor dilemma.');
  },
  stamp(container) {
    const stamp = button('Make it official ✓', () => {
      message.textContent = 'APPROVED: doing absolutely nothing. Signed, The Machine.';
      stamp.disabled = true;
      stamp.textContent = 'Officially unofficial ✓';
    });
    container.append(stamp);
    const message = status(container, 'No forms. No follow-up meeting.');
  },
};
