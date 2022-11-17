const LOCAL_ACCESS_NAME = 'auth_accessToken';

const setAuthToken = (token) => {
	if (process.__CLIENT__) {
		localStorage.setItem(LOCAL_ACCESS_NAME, token);
	}
}

const addAuthToken = (request) => {
	const token = getAuthToken()
	if (token) {
		request.headers.Authorization = `token ${token}`
	}
	return request
}

const getAuthToken = () => {
	return process.__CLIENT__ ? localStorage.getItem(LOCAL_ACCESS_NAME) : null
}

const cleanAuthToken = () => {
	if (process.__CLIENT__) {
		localStorage.removeItem(LOCAL_ACCESS_NAME);
	}
}

const getJWTPayload = (token) => {
	return _parseJWT(token).payload;
}

const _parseJWT = (token) => {
	const parts = token.split('.');
	return {
		header: _parsePart(parts[0]),
		payload: _parsePart(parts[1]),
		sign: parts[2]
	}
}

const _parsePart = (str) => {
	if (process.__CLIENT__) {
		return JSON.parse(window.atob(str));
	}
}

export { setAuthToken, cleanAuthToken, getJWTPayload, addAuthToken, getAuthToken }
