const form = document.getElementById("form");
const layout = document.getElementById("layout");
const lifts = document.getElementsByClassName("lift");

let Alllifts = [];
let remainingFloors = [];

const createFloor = ({
	floorNumber,
	firstFloor = false,
	lastFloor = false,
}) => {
	return `<div class="floor">
				<div class="floor-layout">
					${
						!lastFloor
							? `<div>
						<button onclick="callLift(${floorNumber})">Up</button>
					</div>`
							: ""
					}
					${
						!firstFloor
							? `<div>
						<button onclick="callLift(${floorNumber})">Down</button>
					</div>`
							: ""
					}
				</div>
				<div class="floor-number">Floor ${floorNumber}</div>
			</div>`;
};

const isLiftPresent = (floor) =>
	Alllifts.filter((item) => item.currentFloor === floor);

const findLift = (liftNumber) =>
	Alllifts.filter((item) => item.liftNumber === liftNumber)[0];

const isReached = (liftNumber) =>
	Alllifts.filter((item) => item.liftNumber === liftNumber)[0].reached;

const findClosestActiveLift = (floor) => {
	const filteredLifts = Alllifts.filter((lift) => lift.available);
	if (filteredLifts.length) {
		return filteredLifts.reduce((closestLift, currentLift) =>
			Math.abs(closestLift.currentFloor - floor) <=
			Math.abs(currentLift.currentFloor - floor)
				? closestLift
				: currentLift
		);
	} else {
		return false;
	}
};
const updateLifts = (liftNumber, newFloor) => {
	const floorDifference = Math.abs(
		findLift(liftNumber).currentFloor - newFloor
	);
	lifts[liftNumber - 1].style.transition = `bottom ${floorDifference * 2}s`;
	lifts[liftNumber - 1].style.left = liftNumber * 6 + "rem";
	lifts[liftNumber - 1].style.bottom = (newFloor - 1) * 6 + "rem";
	setTimeout(() => openDoors(liftNumber), 2000 * floorDifference);
	setTimeout(
		() => makeLiftAvailable(liftNumber, remainingFloors),
		2000 * floorDifference + 5000
	);
	Alllifts = Alllifts.map((lift) =>
		lift.liftNumber === liftNumber
			? { ...lift, currentFloor: newFloor, reached: false }
			: { ...lift }
	);
};

const openDoors = (liftNumber) => {
	if (isReached) {
		lifts[liftNumber - 1].children[0].style.width = "0%";
		lifts[liftNumber - 1].children[1].style.width = "0%";
		setTimeout(() => {
			lifts[liftNumber - 1].children[0].style.width = "50%";
			lifts[liftNumber - 1].children[1].style.width = "50%";
		}, 2500);
	}
};

const makeLiftUnavailable = (liftNumber) => {
	Alllifts.forEach((lift) => {
		if (lift.liftNumber === liftNumber) {
			lift.available = false;
		}
	});
};

const makeLiftAvailable = (liftNumber, remainingFloors) => {
	if (remainingFloors.length) {
		updateLifts(liftNumber, remainingFloors[0]);
		remainingFloors.shift();
	} else {
		Alllifts.forEach((lift) => {
			if (lift.liftNumber === liftNumber) {
				lift.available = true;
				lift.reached = true;
			}
		});
	}
};

const callLift = (floorNumber) => {
	let calledLift = isLiftPresent(floorNumber)[0];
	if (calledLift?.reached !== false) {
		console.log('ran')
		if (!calledLift) {
			calledLift = findClosestActiveLift(floorNumber);
		}
		if (calledLift) {
			makeLiftUnavailable(calledLift.liftNumber);
			updateLifts(calledLift.liftNumber, floorNumber);
		} else {
			remainingFloors = [...remainingFloors, floorNumber];
		}
	}
};

const createLayout = (floors, lifts) => {
	layout.innerHTML = "";
	for (let i = floors; i >= 1; i--) {
		if (i === 1) {
			layout.innerHTML += createFloor({ floorNumber: i, firstFloor: true });
		} else if (i === floors) {
			layout.innerHTML += createFloor({ floorNumber: i, lastFloor: true });
		} else {
			layout.innerHTML += createFloor({ floorNumber: i });
		}
	}
	for (let i = 0; i < lifts; i++) {
		Alllifts = [
			...Alllifts,
			{ liftNumber: i + 1, available: true, currentFloor: 1, reached: true },
		];
		layout.innerHTML += `<div style="left: ${
			(i + 1) * 6
		}rem; bottom: 0rem" class="lift"><div class="door left-door"></div><div class="door right-door"></div></div>`;
	}
};

const submitHandler = (e) => {
	e.preventDefault();
	const floors = Number(form[0].value);
	const lifts = Number(form[1].value);
	createLayout(floors, lifts);
};

form.addEventListener("submit", submitHandler);
