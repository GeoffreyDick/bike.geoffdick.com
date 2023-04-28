export function resizeObserver(
	el: HTMLDivElement,
	callback: () => void
): {
	destroy: () => void;
} {
	const resizeObserver = new ResizeObserver(() => {
		callback();
	});

	resizeObserver.observe(el);

	return {
		destroy: () => {
			resizeObserver.unobserve(el);
		},
	};
}
