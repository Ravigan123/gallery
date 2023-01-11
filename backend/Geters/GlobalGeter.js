class GlobalGeter {
	// this.print = function() {
	//     console.log("konstruktor")
	// }
	constructor() {}

	async getData() {
		return "global getter";
	}
	async checkData(data) {
		return data;
	}

	async storeData(data) {
		return data;
	}
}

module.exports = new GlobalGeter();
// module.exports.GlobalGeter = GlobalGeter;
