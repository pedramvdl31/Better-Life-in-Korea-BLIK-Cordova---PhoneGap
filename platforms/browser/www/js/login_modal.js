$(document).ready(function(){
	login_modal.pageLoad();
	login_modal.events();
});
login_modal = {
	pageLoad: function() {

		},
	events: function() {
		$('#login').click(function(){
			$('#myModal').modal('show');
		});


		$(document).find('#login-btn-1').click(function(){
			$('#myModal').modal('toggle');
			$('#login-form-1').submit();
		});
		$('#forgot').click(function(){
			window.location = '/password-reset';
		});

		$('#username, #password').bind('keyup', function(e) {
		    if (e.which == 13) {
				$('#login-form').submit();
		        e.preventDefault();
		    }
		});
	}
}
request = {

};

