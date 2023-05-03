import { action, atom, computed, onSet, WritableAtom } from 'nanostores';

export const latestIndex: WritableAtom<number> = atom(0);

export const observedIndexes: WritableAtom<number[]> = atom([]);

onSet(observedIndexes, ({ newValue, abort }) => {
	// Abort set if duplicate indexes appear in the array
	if (newValue.length !== new Set(newValue).size) {
		abort();
	}
});

export const addToObservedIndexes = action(observedIndexes, 'add', (store, index: number) => {
	// Prevent duplicate indexes
	if (observedIndexes.get().includes(index)) {
		return;
	}

	observedIndexes.set([...observedIndexes.get(), index]);
});

export const removeFromObservedIndexes = action(observedIndexes, 'remove', (store, index: number): number[] => {
	const i = store.get().indexOf(index);
	if (i > -1) {
		const newArr = store.get().splice(i, 1);
		observedIndexes.set(newArr);
	}
	return store.get();
});

export const lowestObservedIndex = computed(observedIndexes, (val) => {
	return Math.min(...val);
});
