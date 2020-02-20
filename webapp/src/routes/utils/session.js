import send from '@polka/send-type';

export async function post(req, res) {
	req.session.data = { ...req.session.data, ...req.body.data };
	send(res, 200, { success: true });
}