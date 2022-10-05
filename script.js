const form = document.getElementById("form");
const layout = document.getElementById("layout");
const lifts = document.getElementsByClassName("lift");

// Check if a lift is already present at that floor, if yes, open doors
// Find out the closest available lift
// Call that lift

let Alllifts = [];

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

const findClosestActiveLift = (floor) =>
	Alllifts.filter((lift) => lift.available).reduce(
		(closestLift, currentLift) =>
			Math.abs(closestLift.currentFloor - floor) <=
			Math.abs(currentLift.currentFloor - floor)
				? closestLift
				: currentLift
	);

const updateLifts = (liftNumber, newFloor) => {
	const floorDifference = Math.abs(findLift(liftNumber).currentFloor - newFloor)
	lifts[liftNumber - 1].style.transition = `bottom ${floorDifference * 2}s`
	lifts[liftNumber - 1].style.left = liftNumber * 6 + "rem";
	lifts[liftNumber - 1].style.bottom = (newFloor - 1) * 6 + "rem";
	setTimeout(() => {
		openDoors(liftNumber)
		Alllifts = Alllifts.map((lift) =>
			lift.liftNumber === liftNumber
				? { ...lift, currentFloor: newFloor }
				: { ...lift }
		);		
	}, 2000*floorDifference);
	setTimeout(()=> makeLiftAvailable(liftNumber), (2000*floorDifference)+5000)
};

const openDoors = liftNumber =>{
	lifts[liftNumber - 1].children[0].style.left = '-50%'
	lifts[liftNumber - 1].children[1].style.right = '-50%'
	setTimeout(()=>{
		lifts[liftNumber - 1].children[0].style.left = 0;
		lifts[liftNumber - 1].children[1].style.right = 0;
	},2500)
}

const makeLiftUnavailable = liftNumber =>{
	Alllifts.forEach(lift=> {
		if(lift.liftNumber === liftNumber){
			lift.available = false
		}
	})
}

const makeLiftAvailable = (liftNumber) => {
	Alllifts.forEach((lift) => {
		if (lift.liftNumber === liftNumber) {
			lift.available = true;
		}
	});
}; 

const callLift = (floorNumber) => {
	const onFloorLift = isLiftPresent(floorNumber)
	if (onFloorLift.length) {
		makeLiftUnavailable(onFloorLift[0].liftNumber)
		openDoors(onFloorLift[0].liftNumber);
		setTimeout(() => makeLiftAvailable(onFloorLift[0].liftNumber), 5000);
	} else {
		const calledLift = findClosestActiveLift(floorNumber);
		makeLiftUnavailable(calledLift.liftNumber)
		updateLifts(calledLift.liftNumber, floorNumber);
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
			{ liftNumber: i + 1, available: true, currentFloor: 1 },
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
