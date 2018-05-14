const container   = document.getElementsByClassName("container")[0];
const body        = document.getElementsByTagName("body")[0];
const overlay     = document.createElement("DIV");
overlay.className = "overlay";
container.appendChild(overlay);

const createElementWithClass = (element, className) => {
	const anElement     = document.createElement(element);
	anElement.className = className;

	return anElement;
};

const createElementWithClassAndText = (element, className, text) => {
	const anElement     = createElementWithClass(element, className);
	anElement.innerText = text;

	return anElement;
};

let request                = new XMLHttpRequest();
request.onreadystatechange = function () {
	if (this.readyState === 4 && this.status === 200) {
		const object = JSON.parse(this.responseText);
		object.results.forEach(contact => {
			const image               = contact.picture.large;
			const firstName           = toTitleCase(contact.name.first);
			const lastName            = toTitleCase(contact.name.last);
			const fullName            = `${firstName} ${lastName}`;
			const username            = contact.login.username;
			const email               = contact.email;
			const cell                = contact.cell;
			const addressStreet       = toTitleCase(contact.location.street);
			const addressCity         = toTitleCase(contact.location.city);
			const addressState        = toTitleCase(contact.location.state);
			const addressPostcode     = contact.location.postcode;
			const fullAddress         = `${addressStreet}, ${addressCity}, ${addressState} ${addressPostcode}`;
			const birthdayArray       = contact.dob.split(" ");
			const birthdayNoTimeArray = birthdayArray[0].split("-");
			const birthday            = `Birthday: ${birthdayNoTimeArray[1]}/${birthdayNoTimeArray[2]}/${birthdayNoTimeArray[0]}`;

			const contactElement      = createContactElement(image, fullName, email, addressCity);
			const contactModalElement = createContactModalElement(image, fullName, username, email, cell, fullAddress, birthday);
			body.appendChild(contactModalElement);

			contactElement.addEventListener("click", () => openModal(contactModalElement));
			container.appendChild(contactElement);
		});

	}
};

function ajax(url, userCount = 1, nationality = "US", gender = "", format = "JSON") {
	url += `?results=${userCount}`;
	url += (nationality ? `&nat=${nationality}` : "");
	url += (gender ? `&gender=${gender}` : "");
	url += (format ? `&format=${format}` : "");
	request.open("GET", url, true);
	request.send();
}

ajax("https://randomuser.me/api/", 12);

function createContactElement(image, name, email, city) {
	const contactContainerElement = createElementWithClass("DIV", "contact-container");
	const contactElement          = createElementWithClass("DIV", "contact clearfix");
	const imageContainerElement   = createElementWithClass("DIV", "image-container");
	const contactSplitLeft        = createElementWithClass("DIV", "contact-split");
	const contactSplitRight       = createElementWithClass("DIV", "contact-split");
	const nameElement             = createElementWithClassAndText("H3", "name", name);
	const emailElement            = createElementWithClassAndText("DIV", "email", email);
	const cityElement             = createElementWithClassAndText("DIV", "city", city);
	const imageElement            = createElementWithClass("IMG", "location");
	imageElement.src              = image;

	imageContainerElement.appendChild(imageElement);

	contactSplitLeft.appendChild(imageContainerElement);

	contactSplitRight.appendChild(nameElement);
	contactSplitRight.appendChild(emailElement);
	contactSplitRight.appendChild(cityElement);

	contactElement.appendChild(contactSplitLeft);
	contactElement.appendChild(contactSplitRight);

	contactContainerElement.appendChild(contactElement);

	return contactContainerElement;
}

function createContactModalElement(image, name, username, email, cell, address, birthday) {
	const modalContainerElement  = createElementWithClass("DIV", "modal-container");
	const modalCloseElement      = createElementWithClass("DIV", "modal-close");
	const modalTopHalfElement    = createElementWithClass("DIV", "modal-half modal-top");
	const modalBottomHalfElement = createElementWithClass("DIV", "modal-half modal-bottom");
	const imageElement           = createElementWithClass("IMG", "modal-item");
	imageElement.src             = image;
	const nameElement            = createElementWithClassAndText("H3", "modal-name modal-item", name);
	const emailElement           = createElementWithClassAndText("DIV", "modal-email modal-item", email);
	const cityElement            = createElementWithClassAndText("DIV", "modal-username modal-item", username);
	const cellElement            = createElementWithClassAndText("DIV", "modal-cell modal-item", cell);
	const addressElement         = createElementWithClassAndText("DIV", "modal-address modal-item", address);
	const birthdayElement        = createElementWithClassAndText("DIV", "modal-birthday modal-item", birthday);

	modalCloseElement.addEventListener("click", event => closeModal(event));

	modalBottomHalfElement.appendChild(cellElement);
	modalBottomHalfElement.appendChild(addressElement);
	modalBottomHalfElement.appendChild(birthdayElement);

	modalTopHalfElement.appendChild(imageElement);
	modalTopHalfElement.appendChild(nameElement);
	modalTopHalfElement.appendChild(emailElement);
	modalTopHalfElement.appendChild(cityElement);

	modalContainerElement.append(modalCloseElement);
	modalContainerElement.append(modalTopHalfElement);
	modalContainerElement.append(modalBottomHalfElement);

	return modalContainerElement;
}

function openModal(target) {
	target.style.display  = "block";
	overlay.style.display = "block";
}

function closeModal(event) {
	console.log("close modal");
	overlay.style.display   = "none";
	let container           = event.target.parentElement;
	container.style.display = "none";
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}
