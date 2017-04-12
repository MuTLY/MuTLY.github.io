$("#password").on("keyup", function() {
	
    var score = 0;
    var a = $(this).val();
    var desc = new Array();

    // strength desc
    desc[0] = "Too short";
    desc[1] = "Weak";
    desc[2] = "Medium";
    desc[3] = "Strong";
    desc[4] = "Strong"; //save in case we have another level

    // at least have password length
    if (a.length >= 8) {
		
        $("#length").removeClass("invalid").addClass("valid");
        //score++;  DONT SCORE MIN CHAR
        // at least 1 digit in password
        if (a.match(/\d/)) {
            $("#pnum").removeClass("invalid").addClass("valid");
            score++;
        } else {
            $("#pnum").removeClass("valid").addClass("invalid");
        }

        // at least 1 lower
        if (a.match(/[a-z]/)) {
            $("#capital").removeClass("invalid").addClass("valid");
            score++;
        } else {
            $("#capital").removeClass("valid").addClass("invalid");
        }
		 // at least 1 capital
		if (a.match(/[A-Z]/)) {
            $("#capital").removeClass("invalid").addClass("valid");
            score++;
        } else {
            $("#capital").removeClass("valid").addClass("invalid");
        }

        // at least 1 special character in password {
        if (a.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) {
            $("#spchar").removeClass("invalid").addClass("valid");
            score++;
        } else {
            $("#spchar").removeClass("valid").addClass("invalid");
        }
		
    } 
	// end length, etc
	
	// build text
    if (a.length > 0) {
        //show strength text
        $(".passwordDescription").text(desc[score]);
        // show indicator
        $("#passwordStrength").removeClass().addClass("pwdStrength" + score);
    } else {
        $("#passwordStrength").removeClass().addClass("");
    }
	// end build text
});