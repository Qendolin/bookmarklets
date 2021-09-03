// name:Find IFrames
const frames = [...document.querySelectorAll('iframe')];
if (frames.length == 0) return alert('No iframes found');
const q = frames.map((f, i) => `${i + 1}: [${new URL(f.src).hostname}] ${f.src.replace('/\\?.*|#.*/', '')}`).join('\n');
let i = prompt('Select iframes Index:\n' + q);
if (!i || Number(i) > frames.length) return;
location.href = frames[i - 1].src;
