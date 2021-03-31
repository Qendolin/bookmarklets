// name:remove
window.addEventListener('touchstart', async function handle(e) {
	await e.target.animate(
		[
			{ backgroundColor: '#ffffff80', filter: 'invert(1)' },
			{ backgroundColor: '#ffffff00', filter: 'invert(0)' },
		],
		{ duration: 500, iterations: 2 }
	).finished;
	if (confirm('Remove?')) e.target.remove();
	const again = confirm('Again?');
	if (!again) window.removeEventListener('touchstart', handle);
});
