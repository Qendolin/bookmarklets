// name:Reddit Bypass
if (window.location.href.includes('www.reddit.')) {
	window.location = window.location.href.replace('www.', 'i.');
}
