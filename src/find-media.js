// name:Find Media
let tmpFrames = [];
let docs = [
	document,
	...[...document.querySelectorAll('iframe')].map((f) => {
		if (f.contentDocument) return Promise.resolve(f.contentDocument);
		return fetch(`https://cors-anywhere.herokuapp.com:443/${f.src}`, { mode: 'cors' })
			.then((r) => r.text())
			.then(
				(html) =>
					new Promise((res, rej) => {
						let corsFrame = document.createElement('iframe');
						corsFrame.onerror = rej;
						corsFrame.onload = () => res(corsFrame.contentDocument);
						corsFrame.srcdoc = html;
						tmpFrames.push(corsFrame);
						document.body.appendChild(corsFrame);
					})
			);
	}),
];

Promise.allSettled(docs)
	.then((docs) => {
		let medias = docs
			.filter((doc) => doc.status == 'fulfilled')
			.map((doc) => [...doc.value.querySelectorAll('video,audio')])
			.filter((e) => e.length)
			.flat();
		if (medias.length == 0) return alert('No videos or audios found');
		let q = medias
			.map((m, i) => `${i}: ${m.tagName.toLowerCase()}, ${m.currentSrc.replace(/\?.*|#.*/, '')}`)
			.join('\n');
		let i = prompt('Select media index:\n' + q);
		if (i == '' || i == null || Number.isNaN(Number(i)) || Number(i) >= medias.length) return;
		location.href = medias[i].currentSrc;
	})
	.then(() => {
		tmpFrames.forEach((f) => f.remove());
	});
