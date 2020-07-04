// name:Quora Bypass
document.body.style = 'position:initial;overflow:initial';
document.head.appendChild(document.createElement('style')).innerHTML = '*{filter:none !important}';
[...document.body.children].find((c) => (c.id || '').includes('signup_wall_wrapper')).remove();
