import { cookie_options } from '$lib/const';
import { delete_session, find_by_session_token } from '$lib/server/sess';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async function ({ locals }) {
	locals.user;
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		const accessToken = cookies.get('accessToken');
		// clear access token
		cookies.delete('accessToken', cookie_options);
		// clear refresh token
		cookies.delete('refreshToken', cookie_options);
		// if access token exists, find session by access token
		if (accessToken) {
			// if session exists, delete session
			const session = await find_by_session_token(accessToken);

			if (session) {
				await delete_session(session.user_id, session.id);
			}
		}
		throw redirect(302, '/');
	},
};
