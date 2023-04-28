export async function fetchApi<T>(path: string): Promise<T> {
	return await fetch(path).then((response) => response.json() as Promise<T>);
}
