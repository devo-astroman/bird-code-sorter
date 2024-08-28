/* 
Setup in the dummy reference:
	-Create the dummy Reference
	-Add the object/item (sword,hammer, etc) desired to well in the part of the dummy reference needed
	-Add an objectValue to the object/item (sword,hammer, etc) the objectValue.value should point to that part of the dummyReference that will "hold" the object/item, for example the hand of the dummyRefetence.
	-Parent the object/item to the referenceDummy
	-Move the dummyReference to the ServerStorage
	-IMPORTANT:
		-The object (sword,hammer,etc) should be a basePart
		-If there is an object with multiple baseparts, then every part should follow the root part, and the root part should be the part to be used in the weld.
		-Every part should not be anchored, and removed the collisions.
*/

export const weld = (partA: BasePart, partB: BasePart, cframeOffset: CFrame) => {
	partA.CFrame = partB.CFrame.mul(cframeOffset);

	const weldConstraint = new Instance("WeldConstraint") as WeldConstraint;
	weldConstraint.Part0 = partA;
	weldConstraint.Part1 = partB;

	weldConstraint.Parent = partA;
};

export const setupWeld = (character: Model, attachmentName: string, referenceDummy: Model) => {
	const originalAttachment = referenceDummy.WaitForChild(attachmentName) as BasePart;
	const newWeld = <BasePart>originalAttachment.Clone();

	const originalTags = <string[]>originalAttachment.GetTags();

	originalTags.forEach((tag) => {
		newWeld.AddTag(tag);
	});

	newWeld.Anchored = false;
	const objectValue = <ObjectValue>newWeld.WaitForChild("WeldPart");
	const dummyBodyPart = <MeshPart>objectValue.Value;
	const characterPartName = dummyBodyPart.Name;
	const characterPart = <Part>character.WaitForChild(characterPartName);
	if (characterPart) {
		weld(newWeld, characterPart, dummyBodyPart.CFrame.Inverse().mul(newWeld.CFrame));
		newWeld.Parent = character;
	} else {
		print("there is no ", characterPartName);
	}
	return newWeld;
};
