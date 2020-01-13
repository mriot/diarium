const controller = new AbortController();
const { signal } = controller;

export default (url, options, timeout = 5000) => {
	setTimeout(() => controller.abort(), timeout);
	return fetch(url, { ...options, signal });
};
