export function realOnChildAdded(ref, cb) {
	let counter = 0;
	ref.limitToLast(1).on('child_added', (snapshot) => {
		counter++;
		if (counter < 2) {
			return;
		}
		cb(snapshot);
	});
}
