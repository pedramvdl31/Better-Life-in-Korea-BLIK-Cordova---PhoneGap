$(document).ready(function(){
	general.pageLoad();
	general.events();

});
general = {

	pageLoad: function() {
	},
	events: function() {
	
		


		$(".thumbnail-wrapper").hover(function(){
		    $(this).find('.thumb_like_btn').removeClass('hide');
		    }, function(){
		    $(this).find('.thumb_like_btn').addClass('hide');
		});

		$(".cat-li").click(function(){
			var this_cat = $(this).attr('this-cat');
			$('.inv-cat-container').addClass('hide');
			$('.'+this_cat).removeClass('hide');
		});



	}
}
requestg = {
	item_liked: function(this_id) {
		var token = $('meta[name=csrf-token]').attr('content');
		$.post(
			'/inventories/inv-liked',
			{
				"_token": token,
				"this_id":this_id
			},
			function(result){
				var status = result.status;
				var count = result.liked_session_count;

				var icon_type = $('#like-icon-type').val();

				if (count > 0) {
					$('.liked-heart').removeClass('glyphicon-'+icon_type+'-empty').addClass('glyphicon-'+icon_type);
					$('.like-badge').text(count);
				};

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
	},
	item_liked_removed: function(this_id) {
		var token = $('meta[name=csrf-token]').attr('content');
		$.post(
			'/inventories/like-removed',
			{
				"_token": token,
				"this_id":this_id
			},
			function(result){
				var status = result.status;
				var count = parseInt(result.liked_session_count);
				var icon_type = $('#like-icon-type').val();

				if (count > 0) {
					$('.liked-heart').removeClass('glyphicon-'+icon_type+'-empty').addClass('glyphicon-'+icon_type);
					$('.like-badge').text(count);
				} else {
					$('.like-badge').text('');
					$('.liked-heart').removeClass('glyphicon-'+icon_type).addClass('glyphicon-'+icon_type+'-empty');
				}

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

