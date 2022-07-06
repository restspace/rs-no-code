import { catalogue } from "../test-data/catalogue";
import { services } from "../test-data/services";

const getCatalogue = async () => {
	return Promise.resolve(catalogue);
}

const getServices = async () => {
	return Promise.resolve(services);
}