$(document).ready(function(){
	blank.pageLoad();
	blank.events();

});
blank = {

	pageLoad: function() {
		$.ajaxSetup({
			headers: { 'X-CSRF-Token' : $('meta[name=csrf-token]').attr('content') }
		});
		alert();
	},
	events: function() {
		$("").click(function(){
		});

        $(document).on('click','.blank',function(){
        	if (!$.isBlank('text')) {

            }
        	//CHECKBOX
            var $this = $(this);
		     
		    // $this will contain a reference to the checkbox   
		    if ($this.is(':checked')) {
		       
		    } else {
		        // the checkbox was unchecked
		    }
        });
        $(document).on('click','._ignore_',function(){
		});
	}
}
request = {
	blank: function(id) {
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
function blankf(url)
{

}
(function($){
  $.isBlank = function(obj){
    return(!obj || $.trim(obj) === "");
  };
})(jQuery);