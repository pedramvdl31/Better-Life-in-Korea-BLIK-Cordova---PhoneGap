// Initialize your app
var myApp = new Framework7({
    statusbarOverlay: false
});
// Export selectors engine
var $$ = Dom7;

// Add views
var view1 = myApp.addView('#view-1');
var view2 = myApp.addView('#view-2');
// var view3 = myApp.addView('#view-3');
var view4 = myApp.addView('#view-4');
var view6 = myApp.addView('#view-6');
var view7 = myApp.addView('#view-7');

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
										    htmlx += '<li class="item-content mlc" item-id="'+va['id']+'"> <div class="item-inner mli"> <div class="col-sm-12 col-md-12 t-wr"> <div class="thumbnail"> <img src="'+va['imgsrc']+'" alt="..."> <div class="caption"> <h3>'+va['title']+'</h3> <p>'+va['des']+'</p><p><span class="label label-success">'+va['dis']+'</span></p></div></div></div></div></li>';
			                            }
			                        });
			                    }
			                } else {
			                    window.plugins.toast.showLongBottom("Ads Returned Empty.");
			                }
						    // Append new items
						    $$('.mlb ul').append(htmlx);
						    $(".mlc").swipe({
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
												    htmlx += '<li class="item-content mlc" item-id="'+va['id']+'"> <div class="item-inner mli"> <div class="col-sm-12 col-md-12 t-wr"> <div class="thumbnail"> <img src="'+va['imgsrc']+'" alt="..."> <div class="caption"> <h3>'+va['title']+'</h3> <p>'+va['des']+'</p><p><span class="label label-success">'+va['dis']+'</span></p></div></div></div></div></li>';
					                            }
					                        });
					                    }
					                } else {
					                    window.plugins.toast.showLongBottom("Ads Returned Empty.");
					                }
								    // Append new items
								    $$('.mlb ul').append(htmlx);
								    $(".mlc").swipe("destroy");
								    $(".mlc").swipe({
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