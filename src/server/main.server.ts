import Binder from "@rbxts/binder";
import { PREMATCH_TAG } from "shared/constants.module";
import { Prematch } from "shared/prematch/prematch.module";

const binder = new Binder(PREMATCH_TAG, Prematch);
binder.Start();
