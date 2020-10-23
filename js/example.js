function print_today() {
	var now = new Date();
	var months = new Array(
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	);
	var date = (now.getDate() < 10 ? "0" : "") + now.getDate();
	function fourdigits(number) {
		return number < 1000 ? number + 1900 : number;
	}
	var today =
		months[now.getMonth()] + " " + date + ", " + fourdigits(now.getYear());
	return today;
}
function roundNumber(number, decimals) {
	var newString;
	decimals = Number(decimals);
	if (decimals < 1) {
		newString = Math.round(number).toString();
	} else {
		var numString = number.toString();
		if (numString.lastIndexOf(".") == -1) {
			numString += ".";
		}
		var cutoff = numString.lastIndexOf(".") + decimals;
		var d1 = Number(numString.substring(cutoff, cutoff + 1));
		var d2 = Number(numString.substring(cutoff + 1, cutoff + 2));
		if (d2 >= 5) {
			if (d1 == 9 && cutoff > 0) {
				while (cutoff > 0 && (d1 == 9 || isNaN(d1))) {
					if (d1 != ".") {
						cutoff -= 1;
						d1 = Number(numString.substring(cutoff, cutoff + 1));
					} else {
						cutoff -= 1;
					}
				}
			}
			d1 += 1;
		}
		if (d1 == 10) {
			numString = numString.substring(0, numString.lastIndexOf("."));
			var roundedNum = Number(numString) + 1;
			newString = roundedNum.toString() + ".";
		} else {
			newString = numString.substring(0, cutoff) + d1.toString();
		}
	}
	if (newString.lastIndexOf(".") == -1) {
		newString += ".";
	}
	var decs = newString.substring(newString.lastIndexOf(".") + 1).length;
	for (var i = 0; i < decimals - decs; i++) newString += "0";
	return newString;
}
function update_total() {
	var total = 0;
	$(".price").each(function (i) {
		price = $(this).html().replace("₹", "");
        if (!isNaN(price)) total += Number(price);
        
	});
	total = roundNumber(total, 2);
	$("#subtotal").html("₹" + total);
	$("#total").html("₹" + total);
	update_balance();    
	document.getElementById('qty').onkeyup = function () {
		document.getElementById('words').innerHTML = inWords(total);
	};
}

/*==================================================================*/

var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

function inWords (num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
}


/*==================================================================*/

function update_balance() {
	var due = $("#total").html().replace("₹", "") - $("#paid").val().replace("₹", "");
	due = roundNumber(due, 2);
	$(".due").html("₹" + due);
}
function update_price() {
	var row = $(this).parents(".item-row");
	var price = row.find(".cost").val().replace("₹", "") * row.find(".qty").val();
	price = roundNumber(price, 2);
	isNaN(price)
		? row.find(".price").html("N/A")
		: row.find(".price").html("₹" + price);
	update_total();
}
function bind() {
	$(".cost").blur(update_price);
	$(".qty").blur(update_price);
}
$(document).ready(function () {
	$("input").click(function () {
		$(this).select();
	});
	$("#paid").blur(update_balance);
	$("#addrow").click(function () {
		$(".item-row:last").after(
            '<tr class="item-row"><td class="description"><div class="delete-wpr"><textarea placeholder="Description"></textarea><a class="delete" href="javascript:;" title="Remove row">X</a></div></td><td><textarea class="cost">0</textarea></td><td><textarea class="qty">0</textarea></td><td><span class="price">0</span></td></tr>'            
		);
		if ($(".delete").length > 0) $(".delete").show();
		bind();
	});
	bind();
	$(".delete").live("click", function () {
		$(this).parents(".item-row").remove();
		update_total();
		if ($(".delete").length < 2) $(".delete").hide();
	});
	$("#cancel-logo").click(function () {
		$("#logo").removeClass("edit");
	});
	$("#delete-logo").click(function () {
		$("#logo").remove();
	});
	$("#change-logo").click(function () {
		$("#logo").addClass("edit");
		$("#imageloc").val($("#image").attr("src"));
		$("#image").select();
	});
	$("#save-logo").click(function () {
		$("#image").attr("src", $("#imageloc").val());
		$("#logo").removeClass("edit");
	});
	$("#date").val(print_today());
});

