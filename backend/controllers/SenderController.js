const Sender = require("../models/Sender");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

class SenderController {
	async getAllSenders(req, res) {
		try {
			const senders = await Sender.query()
				.select(
					"senders.id",
					"email",
					"status",
					"phone",
					"locations.name_location"
				)
				.innerJoin("locations", "locations.id", "senders.id_location");
			res.status(200).json(senders);
		} catch (error) {
			res.status(422).json(error);
		}
	}

	// async getLocationsToSelect(req, res) {
	// 	try {
	// 		const location = await Location.query()
	// 			.select("id", "name_location")
	// 			.where("enabled", 1);
	// 		res.status(200).json(location);
	// 	} catch (error) {
	// 		res.status(500).json(error);
	// 	}
	// }

	async storeSender(req, res) {
		const email = req.body.email;
		const status = req.body.status;
		const phone = req.body.phone;
		const id_location = parseInt(req.body.location);

		let newSender;
		try {
			const token = randomstring.generate(32);

			newSender = await Sender.query().insert({
				token,
				email,
				status,
				phone,
				id_location,
			});

			sendEmail(email, token);
		} catch (err) {
			console.log(err.message);
			return res.status(422).json({ message: err.message });
		}

		res.status(201).json(newSender);
	}

	async updateSender(req, res) {
		try {
			const id = req.body.id;
			const email = req.body.email;
			const status = req.body.status;
			const phone = req.body.phone;
			const id_location = parseInt(req.body.location);

			const sender = await Sender.query().findById(id).patch({
				email,
				status,
				phone,
				id_location,
			});
			res.status(201).json(sender);
		} catch (err) {
			return res.status(422).json({ message: err.message });
		}
	}

	async deleteSender(req, res) {
		try {
			const id = req.params.id;
			const sender = await Sender.query().deleteById(id);
			res.sendStatus(204);
		} catch (err) {
			return res.status(422).json({ message: err.message });
		}
	}
}

function sendEmail(receiver, message) {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		secure: false,
		auth: {
			user: "mailnastronezgrami@gmail.com",
			pass: "bordsgedxeygovnp",
		},
	});

	const allTitle = "Token";
	const allMessage = "Token: " + message;
	let mailOptions = {
		from: "mailnastronezgrami@gmail.com",
		to: receiver,
		subject: allTitle,
		text: allMessage,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
}

module.exports = new SenderController();
