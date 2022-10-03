const form = document.getElementById("form");
const layout = document.getElementById("layout");

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
						<button>Up</button>
					</div>`
							: ""
					}
					${
						!firstFloor
							? `<div>
						<button>Down</button>
					</div>`
							: ""
					}
				</div>
				<div class="floor-number">Floor ${floorNumber}</div>
			</div>`;
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
		layout.children[
			layout.children.length - 1
		].children[0].innerHTML += `<div class="lift"></div>`;
	}
};

const submitHandler = (e) => {
	e.preventDefault();
	const floors = Number(form[0].value);
	const lifts = Number(form[1].value);
	createLayout(floors, lifts);
};

form.addEventListener("submit", submitHandler);
