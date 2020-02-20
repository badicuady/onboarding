export function get(req, res) {
	res.status(200)
		.json({ a: 1 })
		.end();
}