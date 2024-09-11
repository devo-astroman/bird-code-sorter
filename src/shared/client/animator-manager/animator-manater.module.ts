import { CABINET_TAG } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { findElement, findElementShallow } from "shared/services/gom-service.module";

export class AnimatorManager extends MyMaid {
	private allCabinets: { idRoom: number; cabinetDoor: Model; track: AnimationTrack }[];

	constructor() {
		super();
		const cS = game.GetService("CollectionService");
		this.allCabinets = cS.GetTagged(CABINET_TAG).map((cabinetFolder) => {
			const numberValue = findElementShallow<NumberValue>(cabinetFolder, "Value");
			const idRoom = numberValue.Value;
			const cabinetDoor = findElementShallow<Model>(cabinetFolder, "cabinet_door");
			const animator = findElement<Animator>(cabinetDoor, "Animator");
			const animation = findElement<Animation>(animator, "Animation");
			const track = animator.LoadAnimation(animation);

			this.maidConnection(track.GetMarkerReachedSignal("op"), () => {
				track.AdjustSpeed(0);
			});

			return {
				idRoom,
				cabinetDoor,
				track
			};
		});
	}

	playCabinetAnimation(idRoom: number) {
		this.allCabinets[idRoom].track.Play();
	}

	prepareMaid(): void {}
}
