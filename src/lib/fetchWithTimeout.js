const controller = new AbortController();
const { signal } = controller;

export const fetch2 = (url, options, timeout = 5000) => {
	const to = setTimeout(() => controller.abort(), timeout);
	return fetch(url, { ...options, signal })
		.then(res => {
			clearTimeout(to);
			return res;
		});
};
