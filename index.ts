import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./src/config";
import routes from "./src/routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((error) => console.log(error));
