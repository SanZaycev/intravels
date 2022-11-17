import createAuthApi from './auth.js';
import createToursApi from './tours.js';
import createSightsApi from './sights.js';
import createGuidesApi from './guides.js';
import createProfileApi from './profile.js';

export default http => ({
	auth: createAuthApi(http),
	tours: createToursApi(http),
	sights: createSightsApi(http),
	guides: createGuidesApi(http),
	profile: createProfileApi(http),
})
