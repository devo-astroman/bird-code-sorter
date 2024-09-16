const dS = game.GetService("DataStoreService");

const leaderBoardDataStore = dS.GetDataStore("LeaderBoardDS");

export const saveWinMatchData = (data: { time: number; players: number[] }) => {
	/*Improve!*/
	const top10 = leaderBoardDataStore.GetAsync<{ time: number; players: number[] }[]>("Top10") as unknown;
	const t = top10 as { time: number; players: number[] }[];

	t.push(data);
	const newTop10 = t.sort((a, b) => a.time - b.time < 0).filter((a, i) => i < 10);
	const [success, errorMsg] = pcall(() => {
		leaderBoardDataStore.SetAsync("Top10", newTop10);
	});

	if (success) {
		print("Saved data ", newTop10);
	} else {
		print("Error ", errorMsg);
	}
};

export const getWinMatchData = () => {
	const top10 = leaderBoardDataStore.GetAsync<{ time: number; players: number[] }[]>("Top10") as unknown;

	if (!top10) {
		const [success, errorMsg] = pcall(() => {
			leaderBoardDataStore.SetAsync("Top10", []);
		});

		if (success) {
			print("success setAsync");
		} else {
			print("errorMsg ", errorMsg);
		}
	}

	return top10;
};
