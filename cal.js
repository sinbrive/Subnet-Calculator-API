
module.exports = {
    ret: function(data) {
        return calcIP(data);
    }
};


function calcIP(data) {

	const ipmask = data.split(',');

	var inputip = ipmask[0];
	var inputcidr = ipmask[1];

	if (checkInput(inputip)==false || !(inputcidr >= 1 && inputcidr <=24)) {
		inputip="192.168.1.1";
		inputcidr = "31";
		console.log(inputcidr);
	}

	var ret={}
	ret['cidr_notation'] =inputip+'/'+inputcidr;

	var x = 32-parseInt(inputcidr);

	if (x >= 1 && x <=24) {

		inputmask=toIP(0xFFFFFFFF << x);
		wildcard_mask = toIP(~(0xFFFFFFFF << x));
	}


	ret['subnet_mask'] =inputmask;
	ret['wildcard_mask'] =wildcard_mask;


	var ip = inputip.split('.');

	var masque = inputmask.split('.');
	
	var mask = parseInt(masque[0]) << 24 | parseInt(masque[1]) << 16 | parseInt(masque[2]) << 8 | parseInt(masque[3]);
	
	var CIDR = 0;
	var m = mask;
	if (masque.length == 4) for (i = 0; i < 32; i++) {
		if ((m & 0x01) == 0x00) CIDR++;
		else break;
		m = m >> 1;
	}

	var IP = parseInt(ip[0]) << 24 | parseInt(ip[1]) << 16 | parseInt(ip[2]) << 8 | parseInt(ip[3]);
	
	

	ret['subnet_bits'] = 32 - CIDR;
	
	// network address
	var adrN = IP & mask;
	ret['network_address'] = toIP(adrN);

	// first address
	var adrFirst = adrN + 1;
	ret['first_assignable_host']  = toIP(adrFirst);

	// boroadcast address
	var adrDiff = adrN | ~mask;
	ret['broadcast_address']  = toIP(adrDiff);

	// last address
	var adrLast = adrDiff - 1;
	ret['last_assignable_host']  = toIP(adrLast);

	// hosts number
	var nb = Math.pow(2, CIDR) - 2;
	ret['assignable_hosts'] = nb;

	return ret;
}


function toIP(data) {
	return (data >> 24 & 0xFF).toString() + "." +
		(data >> 16 & 0xFF).toString() + "." + (data >> 8 & 0xFF).toString() + "." + (data & 0xFF).toString();
}


function checkInput(ipp) {
	var expectedChars = "0123456789.";
	var dot = 0;
	var i = 0;
	for (i = 0; i < ipp.length; i++) {
		if (expectedChars.indexOf(ipp.charAt(i)) === -1) break;
		if (ipp.charAt(i) == '.') dot++;
	}
	return (dot == 3) && (i == ipp.length);
}