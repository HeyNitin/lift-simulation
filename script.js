const form = document.getElementById("form");
const layout = document.getElementById("layout");
const lifts = document.getElementsByClassName('lift')

// Check if a lift is already present at that floor, if yes, open doors
// Find out the closest available lift
// Call that lift

let Alllifts = []

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

const isLiftPresent = floor => Alllifts.filter(item=>item.currentFloor === floor).length !== 0

const findClosestLift = floor => Alllifts.filter(lifts=>lifts.available).reduce((closestLift, currentLift) =>  Math.abs(closestLift.currentFloor - floor) <= Math.abs(currentLift.currentFloor - floor) ? closestLift:currentLift)

const updateLifts = (liftNumber, newFloor) => {
	console.log("lift position is being updated", lifts[liftNumber - 1]);
	lifts[liftNumber - 1].style.left = liftNumber * 6+"rem" 
	lifts[liftNumber - 1].style.bottom = (newFloor-1) * 6+"rem" 

	Alllifts = Alllifts.map((lift) =>
		lift.liftNumber === liftNumber
			? { ...lift, currentFloor: newFloor }
			: { ...lift }
	);
};

const callLift = (floorNumber) =>{
	if(isLiftPresent(floorNumber)){
		// Open doors
		console.log('opening door')
	}
	else{
		const calledLift = findClosestLift(floorNumber)
		console.log('This lift is being called', calledLift)
		updateLifts(calledLift.liftNumber, floorNumber)
	}
}

const createLayout = (floors, lifts) => {
	layout.innerHTML = "";
	console.log('layout created')
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
		Alllifts = [...Alllifts, {liftNumber: i+1, available: true, currentFloor: 1}]
		layout.innerHTML += `<div style="left: ${(i+1)*6}rem; bottom: 0rem" class="lift"></div>`;
	}
};

const submitHandler = (e) => {
	console.log('request submitted')
	e.preventDefault();
	const floors = Number(form[0].value);
	const lifts = Number(form[1].value);
	createLayout(floors, lifts);
};

form.addEventListener("submit", submitHandler);
