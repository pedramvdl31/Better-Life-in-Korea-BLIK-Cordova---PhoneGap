$(document).ready(function(){
	edit.pageLoad();
	edit.events();

});
edit = {

	pageLoad: function() {
		$.ajaxSetup({
			headers: { 'X-CSRF-Token' : $('meta[name=csrf-token]').attr('content') }
		});
	},
	events: function() {
        $(document).on('click','#delete-layouts_ob',function(){
        	var this_href = $(this).attr('this-href');
			window.location = "/admins/layouts/remove/"+this_href;
        });
	}
}
request = {
	edit: function(id) {
		var token = $('meta[name=csrf-token]').attr('content');
		$.post(
			'/',
			{
				"_token": token
			},
			function(result){
				var status = result.status;

				switch(status) {
					case 200: 
						
					break;				
					case 400: 
						
					break;
					default:
					break;
				}

				}
				);
	}
};
function editf(url)
{

}
