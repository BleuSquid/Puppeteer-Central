contact = {
		"name" : "Firstname Lastname",
		"email" : "user@host.name",
		"address" : {
			"name" : "Firstname Lastname",
			"street1" : "1 Mystreet",
			"street2" : "",
			"city" : "Mytown",
			"postcode" : "A123456",
			"country" : "South Nowhere"
		}
	};

function updateSpan(elmId, value) {
	var elem = document.getElementById(elmId);
	if(typeof elem !== 'undefined' && elem !== null) {
		elem.innerHTML = value;
	}
}

updateSpan("contact-name", contact.name);
updateSpan("contact-email", contact.email);
updateSpan("contact-address-name",  contact.address.name);
updateSpan("contact-address-street1", contact.address.street1);
updateSpan("contact-address-street2", contact.address.street2);
updateSpan("contact-address-city", contact.address.city);
updateSpan("contact-address-postcode", contact.address.postcode);
updateSpan("contact-address-country", contact.address.country);
