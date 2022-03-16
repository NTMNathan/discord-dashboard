const Server = require('./serverModel');

module.exports = class Manager {
	static async createServer(id) {
		const result = new Server({
			serverId: id,
			prefix: null,
		});

		await result.save();

		return result;
	}

	static async findServer(id) {
		const result = await Server.findOne({ serverId: id });

		return result;
	}

	static async getPrefix(id) {
		const result = await Server.findOne({ serverId: id });

		return result.prefix;
	}

	static async updateServerPrefix(id, prefix) {
		const result = await Server.findOne({ serverId: id });

		if (result) {
			return await result.updateOne({ prefix });
		}
		else {
			return;
		}
	}
};