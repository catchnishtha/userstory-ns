jQuery(document).ready(function($) {
	$(".signup-form .form-control").focus(function(){ alert("focus");
	$(this).parent().addClass("has-focus");
})
});