// Initialize your app
var myApp = new Framework7({
    statusbarOverlay: false
});
// Export selectors engine
var $$ = Dom7;

// Add views
var view1 = myApp.addView('#view-1');
var view2 = myApp.addView('#view-2');
var view4 = myApp.addView('#view-4');
var view6 = myApp.addView('#view-6');
var view7 = myApp.addView('#view-7');
var view7 = myApp.addView('#view-8');

var mySearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block-search',
    searchIn: '.item-title'
});   



setTimeout(function () {

	var ajaxinterv = setInterval(function(){ 
		var got_loc = GVar.got_loc;
		if (got_loc==1) {
			// Generate new items HTML
			var current_ulat = GVar.lndinglat;
			var current_ulng = GVar.lndinglng;
			var take_ad = 5;
			var skip_ad = 0;
			var data ={"lat":current_ulat,"lng":current_ulng,"take_ad":take_ad,"skip_ad":skip_ad};
			$.ajax({
			    url: GVar.ajax_url+'/api/load-ads',
			    type: 'post',
			    dataType: 'json',
			    'data': data,
			    success: function(data) {
			        var status = data.status;
			        var ads = data.ads;
			        switch(status){
			            case 200:
			            	var htmlx = '';
			                if (!isBlank(ads)) {
			                    if ($.isArray(ads)) {
			                    	
			                        $.each( ads, function( ke, va ) {
			                            if (!isBlank(va)) { 
			                            	htmlx += CreateAdBox('posthu',va['user_email'],va['id'],va['imgsrc'],va['title'],va['des'],va['dis'],va['time_ago'],va['img_w'],va['img_h']);
			                            }
			                        });
			                    }
			                } else {
			                    window.plugins.toast.showLongBottom("Ads Returned Empty.");
			                }
						    // Append new items
						    $$('.mlb ul').html('');
						    $$('.mlb ul').append(htmlx);
						    $(".posthu").swipe({
						        hold:function(event, target) {
							        $('#vw6').removeClass('active');
							        findAndViewAd($(this).attr('item-id'));
						        }
						    });

			            break;

			            case 400:
			                alert("Somthing Went Wrong! Try Again.");
			            break;
			        }
			    },
			    error: function (xhr, ajaxOptions, thrownError) {

			    }
			});
			setTimeout(function () {
				// Loading flag
				var loading = false;
				 
				// Last loaded index
				var lastIndex = $$('.mlb li').length;
				 
				// Max items to load
				var maxItems = 100;
				 
				// Append items per load
				var itemsPerLoad = 5;
				 
				// Attach 'infinite' event handler
				$$('.infinite-scroll').on('infinite', function () {
				 
					// Exit, if loading in progress
					if (loading) return;

					// Set loading flag
					loading = true;
					var htmlx = '';
					// Emulate 1s loading
					setTimeout(function () {
					// Reset loading flag
					loading = false;

					if (lastIndex >= maxItems) {
					  // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
					  myApp.detachInfiniteScroll($$('.infinite-scroll'));
					  // Remove preloader
					  $$('.infinite-scroll-preloader').remove();
					  return;
					}

					// Update last loaded index
					lastIndex = $$('.mlb li').length;
					}, 1000);


				 
					// Generate new items HTML
					var current_ulat = GVar.lndinglat;
					var current_ulng = GVar.lndinglng;
					var take_ad = itemsPerLoad;
					var skip_ad = lastIndex;
					var data ={"lat":current_ulat,"lng":current_ulng,"take_ad":take_ad,"skip_ad":skip_ad};
					$.ajax({
					    url: GVar.ajax_url+'/api/load-ads',
					    type: 'post',
					    dataType: 'json',
					    'data': data,
					    success: function(data) {
					        var status = data.status;
					        var ads = data.ads;
					        switch(status){
					            case 200:
					            	var htmlx = '';
					                if (!isBlank(ads)) {
					                    if ($.isArray(ads)) {
					                    	
					                        $.each( ads, function( ke, va ) {
					                            if (!isBlank(va)) { 
					                            	htmlx += CreateAdBox('posthu',va['user_email'],va['id'],va['imgsrc'],va['title'],va['des'],va['dis'],va['time_ago'],va['img_w'],va['img_h']);
					                            }
					                        });
					                    }
					                } else {
					                    window.plugins.toast.showLongBottom("Ads Returned Empty.");
					                }
								    // Append new items
								    $$('.mlb ul').append(htmlx);
								    $(".posthu").swipe("destroy");
								    $(".posthu").swipe({
								        hold:function(event, target) {
									        $('#vw6').removeClass('active');
									        findAndViewAd($(this).attr('item-id'));
								        }
								    });
					            break;

					            case 400:
					                alert("Somthing Went Wrong! Try Again.");
					            break;
					        }
					    },
					    error: function (xhr, ajaxOptions, thrownError) {

					    }
					});

				});    
			}, 1000);   
			clearInterval(ajaxinterv);
		}

	}, 500);

}, 1000);

function ShowDashboardAds(){
    var dtake_ad = GVar.dash_take_default;
    var dskip_ad = 0;
    GVar.dash_take = dtake_ad;
	GVar.dash_skip = dskip_ad;
    var current_ulat = GVar.lndinglat;
    var current_ulng = GVar.lndinglng;
    var data ={"lat":current_ulat,"lng":current_ulng,"tkn":localStorage.getItem("auth_token"),"take_ad":dtake_ad,"skip_ad":dskip_ad};
    $.ajax({
        url: GVar.ajax_url+'/api/load-ads-profile',
        type: 'post',
        dataType: 'json',
        'data': data,
        success: function(data) {
            var status = data.status;
            var ads = data.ads;
            switch(status){
                case 200:
                    var htmlx = '';
                    if (!isBlank(ads)) {
                        if ($.isArray(ads)) {
                            $.each( ads, function( ke, va ) {
                                if (!isBlank(va)) { 
                                    htmlx +=  CreateAdBox('posthu2',va['user_email'],va['id'],va['imgsrc'],va['title'],va['des'],va['dis'],va['time_ago'],va['img_w'],va['img_h']);
                                }
                            });
                        }
                    } else {
                        // window.plugins.toast.showLongBottom("No posts to view!"); xxx
                        $("#load-more-dash").addClass('opacity-0');
                    }
                    // Append new items
                    $$('.mlb2 ul').html('');
                    $$('.mlb2 ul').append(htmlx);
                    $(".posthu2").swipe({
                        hold:function(event, target) {
                            $('#vw6').removeClass('active');
                            findAndViewAd($(this).attr('item-id'));
                        }
                    });
                    AdjustLoadMoreBtn();

                break;


                case 400:
                    alert("Somthing Went Wrong! Try Again.");
                break;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {

        }
    });
}
function ShowDashboardAdsReload(){
	ShowDashboardAds();
}
function ShowDashboardAdsLoadMore(){
    var dtake_ad = GVar.dash_take_default;
    var dskip_ad = $$('.mlb2 li').length;
    GVar.dash_take = dtake_ad;
	GVar.dash_skip = dskip_ad;
    var current_ulat = GVar.lndinglat;
    var current_ulng = GVar.lndinglng;
    var data ={"lat":current_ulat,"lng":current_ulng,"tkn":localStorage.getItem("auth_token"),"take_ad":dtake_ad,"skip_ad":dskip_ad};
    $.ajax({
        url: GVar.ajax_url+'/api/load-ads-profile',
        type: 'post',
        dataType: 'json',
        'data': data,
        success: function(data) {
            var status = data.status;
            var ads = data.ads;
            switch(status){
                case 200:
                    var htmlx = '';
                    if (!isBlank(ads)) {
                        if ($.isArray(ads)) {
                            $.each( ads, function( ke, va ) {
                                if (!isBlank(va)) { 
                                    htmlx +=  CreateAdBox('posthu2',va['user_email'],va['id'],va['imgsrc'],va['title'],va['des'],va['dis'],va['time_ago'],va['img_w'],va['img_h']);
                                }
                            });
                        }
                        
                    } else {
                        // window.plugins.toast.showLongBottom("No posts to view!"); xxx
                        $("#load-more-dash").addClass('opacity-0');
                    }
                    // Append new items
                    $$('.mlb2 ul').append(htmlx);
                    $(".posthu2").swipe({
                        hold:function(event, target) {
                            $('#vw6').removeClass('active');
                            findAndViewAd($(this).attr('item-id'));
                        }
                    });
                    AdjustLoadMoreBtn();
                break;

                case 400:
                    alert("Somthing Went Wrong! Try Again.");
                break;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {

        }
    });

}

function CreateAdBox($kind,$user_email,$item_id,$img_src,$title,$des,$distance,$time_ago,img_w,img_h){
	var show_cover = "hide";
	var cut_image = "";
	if ((img_w/img_h)<1) {
		show_cover = "";
		cut_image = "_cutimage";
	}
	var data = '<li class="item-content mlc"> <div class="item-inner mli">  <div class="col-sm-12 col-md-12 t-wr"> <div class="poswrap"> <span class="posname"><span>'+$user_email+'</span></span> <i this-id="'+$item_id+'" class="_vaprofile posmore fa fa-ellipsis-h open-popover" data-popover=".popover-viewprofile" aria-hidden="true"></i><i this-id="'+$item_id+'" class="posdelete fa fa-ellipsis-h open-popover" data-popover=".popover-delete" aria-hidden="true"></i> </div> <div item-id="'+$item_id+'" class="_imgwrap thumbnail '+$kind+' '+cut_image+'"> <div class="imgcover '+show_cover+'"><span class="ictext"><i class="fa fa-expand" aria-hidden="true"></i> Expand Post</span></div> <img class="pro-img" src="'+$img_src+'" ><span class="badge ad-dis">'+$distance+'</span></div> <div class="caption ad-cap"> <h3>'+$title+'</h3><span class="tmago">'+$time_ago+'</span></div></div></div></div></li>';
	return data;
}


function AdjustLoadMoreBtn(){
    //load btn config
    if (GVar.cur_user_no_posts<=$$('.mlb2 li').length) {
    	$("#load-more-dash").addClass('opacity-0');
    } else {
    	$("#load-more-dash").removeClass('opacity-0');
    }
}