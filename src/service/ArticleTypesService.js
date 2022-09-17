export default class ArticleTypesService {

	async getAll(){
		return await fetch('https://stormy-tundra-82595.herokuapp.com/api/v1/article-types',{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
			// body: JSON.stringify(data),
		})
			.then(res => res.json())
			.then(d => d.data);
	}
	async create(payload){
		return await fetch('https://stormy-tundra-82595.herokuapp.com/api/v1/article-types',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload),
		})
			.then(res => res.json())
			.then(d => d);
	}
	async update(id,payload){
		return await fetch(`https://stormy-tundra-82595.herokuapp.com/api/v1/article-types/${id}`,{
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload),
		})
			.then(res => res.json())
			.then(d => d);
	}
	async delete(id){
		return await fetch(`https://stormy-tundra-82595.herokuapp.com/api/v1/article-types/${id}`,{
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
			},
			// body: JSON.stringify(data),
		})
			.then(res => res.json())
			.then(d => d);
	}
    // getProductsSmall() {
	// 	return fetch('data/products-small.json').then(res => res.json()).then(d => d.data);
	// }
	//
	// getProducts() {
	// 	return fetch('data/products.json').then(res => res.json()).then(d => d.data);
    // }
	//
    // getProductsWithOrdersSmall() {
	// 	return fetch('data/products-orders-small.json').then(res => res.json()).then(d => d.data);
	// }
	
}