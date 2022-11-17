import axios from 'axios';
import {path} from "../core/state.js";

export default () => {
	return axios.create({
		baseURL: path.API,
		timeout: 10000
		// withCredentials: true,
		// headers: {'X-Custom-Header': 'foobar'}
	})
}
