import { onClientReceiveMsg } from "shared/services/server-client-comm.module";

export const setupAnimations = () => {
	onClientReceiveMsg((msg) => {
		print("MESSAGE IN CLIENT: ", msg);
	});
};
