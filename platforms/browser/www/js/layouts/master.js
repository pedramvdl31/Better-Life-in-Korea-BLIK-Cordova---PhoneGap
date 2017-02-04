$(document).ready(function(){
	master.pageLoad();
	master.events();

});
master = {

	pageLoad: function() {
		$.ajaxSetup({
			headers: { 'X-CSRF-Token' : $('meta[name=csrf-token]').attr('content') }
		});
	},
	events: function() {
		$('#login').click(function(){
			$('#myModal').modal('toggle');
		});
	}
}
request_master = {

};

