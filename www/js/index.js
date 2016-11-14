/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//GLOBAL VARIABLES
GVar = {
    // 'ajax_url':'http://kora.app:8000',
    
    'baseurl':'https://www.betterlifeinkorea.com',
    'ajax_url':'https://www.betterlifeinkorea.com',
    'auth':'0',
    'curpg':'1',
    'take':8,
    'skip':0,
    'qkpost_map':0,
    'category':0,
    'cid':0,
    'scroll_load_more':1,
    'flag_image':'img/beachflag.png',
    'dash':0,
    'uemail':0,
    'utoken':0
}
var images = [];
var $imagesDiv;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        Components.InitiateApp();
        Components.EventHandler();
        Maps.ViewAdInit(37.554084,126.949903);
        ManageAuth();

    


        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
          //PHONE
            document.addEventListener("online", onOnline, false);
            document.addEventListener("offline", onOffline, false);
            var connection = checkConnection();
            if (connection==1) {

            } else {
                alert('Please connect to the Internet to continue ');
                $('#ovwrapper').removeClass('hide');
            }
        } else {
          //BROWSER
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }
};

app.initialize();


// COMPONENTS
Components = {
    PreLoadDom: function() {
        // InitFunctions.PreLoadDom();
    },
    InitiateApp: function() {
        InitFunctions.SetStates();
        InitFunctions.NavbarListener();
        // InitFunctions.Dependencies();
        InitFunctions.PageVisualSetup();
        InitFunctions.SetAjaxHeader();
        InitFunctions.ClearUrl();
        InitFunctions.WindowScrollListener();
        InitFunctions.PhotoUpload();
        // InitFunctions.InitiateDropZones();
        // InitFunctions.InitiateAutoComplete();
    },
    EventHandler: function() {
        Listeners.Events();
    }
};

function ManageAuth(){
    if (typeof(Storage) !== "undefined") {
        var auth_token = localStorage.getItem("auth_token");
        if (!$.isBlank(auth_token)) {
            CheckToken(auth_token);
        } else {
            GVar.auth=0;
            SetStatusBtn();
        }
    } else {
        alert('WEB STORAGE NOT SUPPORTED!');
    }
}
function SetStatusBtn(){
    if (GVar.auth==0) {
        $('#lginicon').addClass('fa fa-user-circle');
        $('#lginlbl').text('Login');
        //set other elements
        $('#_auth').attr('data','0');
        $('#user-status').attr('value','0');
        
    } else {
        $('#lginicon').addClass('fa fa-user-circle');
        $('#lginlbl').text('Logout');

        //set other elements
        $('#_auth').attr('data','1');
        $('#user-status').attr('value','1');
    }
}

function CheckToken(a_t){
    $('#lw').removeClass('hide');
    var data ={"token":a_t}
    $.ajax({
        url: GVar.ajax_url+'/api/init',
        type: 'post',
        dataType: 'json',
        data: a_t,
        success: function(data) {
            GVar.auth=1;
            GVar.utoken=a_t;
            $('#_auth').attr('data','1');
            SetStatusBtn();
            $('#lw').addClass('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#lw').addClass('hide');
            GVar.auth=0;
            console.log(xhr.responseText); // <- same here, your own div, p, span, whatever you wish to use
        }
    });
}
(function($){
  $.isBlank = function(obj){
    return(!obj || $.trim(obj) === "");
  };
})(jQuery);
function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.ETHERNET] = 1;
    states[Connection.WIFI]     = 1;
    states[Connection.CELL_2G]  = 1;
    states[Connection.CELL_3G]  = 1;
    states[Connection.CELL_4G]  = 1;
    states[Connection.CELL]     = 1;
    states[Connection.NONE]     = 0;
    states[Connection.UNKNOWN]  = 0;


    return states[networkState];
}
function onOffline() {
    // Handle the offline event
    alert('Please connect to the Internet to continue ');
    $('#ovwrapper').removeClass('hide');
}
function onOnline() {
    // Handle the online event
    $('#ovwrapper').addClass('hide');
}


//FUNCTIONS
InitFunctions = {
    // PreLoadDom(){
    //  //PRELOADED DOMELEMETS
    //  window.DomElements = {
    //      'div-a': document.getElementById("a"), 
    //      'div-b': document.getElementById("b"), 
    //      'div-c': document.getElementById("c"), 
    //  };
    // },
    PageVisualSetup(){
        window.flag = 0;
        $('#nav').affix({
            offset: {
                top: 70
            }
        });
        $("#nav").on('affix.bs.affix', function(){
            $('#app-view').css('margin-top','50px');
        });

        $("#nav").on('affix-top.bs.affix', function(){
            $('#app-view').css('margin-top','0');
        });

        $('[data-toggle="tooltip"]').tooltip();

        // $('.body-wrapp').slimScroll({
        //     height: '100%'
        // });
    },
    Dependencies(){

    },
    PhotoUpload(){
        $imagesDiv = $("#images");  

        $("#addPicture").click(function(){
            navigator.camera.getPicture(function(f) {
                var newHtml = "<img class='uimg uplimg-"+$(document).find('.uimg').length+"' style='padding:3px;border-radius:5px;' width='100%' src='"+f+"'>";
                $imagesDiv.append(newHtml);

                imageURI=f;
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                console.log(options.fileName);
                var params = new Object();
                params.value1 = "test";
                params.value2 = "param";
                options.params = params;
                options.chunkedMode = false;

                var ft = new FileTransfer();
                ft.upload(imageURI, GVar.ajax_url+"/api/upload-ads-tmp", function(data){
                    var result = data['response'];
                    var parsed_result = JSON.parse(result);
                    var new_name = parsed_result['img_name'];
                    var old_name = parsed_result['old_name'];
                    var base_type = parsed_result['base_type'];
                    var new_input = HelperFuncions.create_input(new_name,old_name,base_type);
                    $("#file-div").append(new_input);

                    var pl = $(document).find('.uimg').length - 1;
                    $('#qkpmb').animate({
                    scrollTop: $(document).find('.uplimg-'+pl).offset().top + 500},
                    'slow');


                }, function(error){
                    console.log(JSON.stringify(error));
                }, options);

            }, function(e) {
                alert("Error, check console.");
                console.dir(e);
            }, { 
                quality: 100,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            });










        });

    },
    SetStates(){
        window.user_state = document.getElementById('user-status').value;
    },
    SetAjaxHeader(){
        $.ajaxSetup({
            headers: { 'X-CSRF-Token' : $('meta[name=csrf-token]').attr('content') }
        });
    },
    ClearUrl(){
        if ( (location.hash == "#_=_" || location.href.slice(-1) == "#_=_") ) {
            var scrollV, scrollH, loc = window.location;
            if ('replaceState' in history) {
                history.replaceState('', document.title, loc.pathname + loc.search);
            } else {
                // Prevent scrolling by storing the page's current scroll offset
                scrollV = document.body.scrollTop;
                scrollH = document.body.scrollLeft;

                loc.hash = '';

                // Restore the scroll offset, should be flicker free
                document.body.scrollTop = scrollV;
                document.body.scrollLeft = scrollH;
            }
        }
    },
    WindowScrollListener(){
        // $(window).scroll(function() {
        //     console.log('fired');
        //    if(($('#posts-page').scrollTop() + $('#posts-page').height() > $(document).height() - 100)&&flag==0) {
        //         if (GVar.scroll_load_more==1) {
        //             console.log('fired 200');
        //             GVar.skip = GVar.skip+8;
        //             ServerRequests.get_ad(GVar.skip);
        //             flag=1;
        //             $('#loading-data').fadeIn();                    
        //         } else {
        //             console.log('fired 400');
        //             $('#no-ads').fadeIn();
        //         }
        //    }
        // });
        
        $("#lma").click(function(){
            if (GVar.scroll_load_more==1) {
                GVar.skip = GVar.skip+8;
                ServerRequests.get_ad(GVar.skip);
            }
        });
    },
    BindMapToDiv(){
        $('#us2').locationpicker({
            location: {latitude: 37.5551069, longitude: 126.97069110000007},   
            radius: 0,
            inputBinding: {
                latitudeInput: $('#us2-lat'),
                longitudeInput: $('#us2-lon'),
                radiusInput: $('#us2-radius'),
                locationNameInput: $('#us2-address')
            },
            enableAutocomplete: true,
        });
    },
    InitiateDropZones(){
        Dropzone.autoDiscover = false;
          $('#post_upload_zone_image').dropzone({ 
            url: GVar.ajax_url+"/api/upload-ads-tmp",
            paramName: "file",
            maxFilesize: 5,
            acceptedFiles: "image/*",
            maxFiles: 10,
            addRemoveLinks: true,
            init: function() {
                 this.on('success', function(file, json) {
                   var new_name = json['img_name'];
                   var old_name = json['old_name'];
                   var base_type = json['base_type'];
                   var new_input = HelperFuncions.create_input(new_name,old_name,base_type);
                   $("#file-div").append(new_input);
                   // $('#qk-post-btn').removeAttr('disabled');
                 });
                  
                 this.on('addedfile', function(file) {
                    // $('#qk-post-btn').attr('disabled','disabled');
                 });
                  
                 this.on('drop', function(file) {
                 });

                this.on("removedfile", function(file) {
                    HelperFuncions.dropz_removefile(file);
                }); 
            }
         });
         //  $('#post_upload_zone_video').dropzone({ 
         //    url: GVar.ajax_url+"/api/upload-ads-tmp",
         //    paramName: "file",
         //    maxFilesize: 30,
         //    acceptedFiles: "video/*",
         //    maxFiles: 3,
         //    addRemoveLinks: true,
         //    init: function() {
         //         this.on('success', function(file, json) {
         //           var new_name = json['img_name'];
         //           var old_name = json['old_name'];
         //           var base_type = json['base_type'];
         //           var new_input = HelperFuncions.create_input(new_name,old_name,base_type);
         //           $("#file-div").append(new_input);
         //           $('#qk-post-btn').removeAttr('disabled');
         //         });
                  
         //         this.on('addedfile', function(file) {
         //            $('#qk-post-btn').attr('disabled','disabled');
         //         });
                  
         //         this.on('drop', function(file) {
         //         });

         //        this.on("removedfile", function(file) {
         //            HelperFuncions.dropz_removefile(file);
         //        }); 
         //    }
         // });
    },
    InitiateAutoComplete(){
        var options = {

            url: "/assets/cities2.json",

            categories: [{
                listLocation: "Korea",
                maxNumberOfElements: 4,
                header: "South Korea"
            }],

            getValue: function(element) {
                return element.name;
            },

            template: {
                type: "description",
                fields: {
                    description: "realName"
                }
            },

            list: {
                maxNumberOfElements: 8,
                match: {
                    enabled: true
                },
                sort: {
                    enabled: true
                }
            },
            theme: "square"
        };

        $("#cities-autocomplete").easyAutocomplete(options);
    },
    NavbarListener(){
        $('#z').on('shown.bs.collapse', function () {
          $(document).bind( "click", handler );
        })
        $('#z').on('hidden.bs.collapse', function () {
          $(document).unbind( "click", handler );
        })
        var handler = function() {
            $(document).click(function(event) {
                if (!$(event.target).hasClass("form-control")) {
                    $('#z').collapse('hide');
                }
            });
        };      
    }
};

//LISTENERS
Listeners = {
    Events(){

        var exitApp = false, intval = setInterval(function (){exitApp = false;}, 1000);
        document.addEventListener("backbutton", function (e){
            e.preventDefault();
            if (exitApp) {
                // clearInterval(intval); 
                (navigator.app && navigator.app.exitApp()) || (device && device.exitApp())
            }
            else {
                exitApp = true;
                $('.modal').modal('hide');
                if(GVar.curpg>1 && GVar.curpg<5){
                    var _c = GVar.curpg-1;
                    myApp.showTab('#view-'+_c);
                    GVar.curpg= _c;
                }
            } 
        }, false);

        //city map functions
        $(".tt").mouseenter(function() {
          document.getElementById("p"+$(this).attr('ci')).style.fill = '#223b59';
        });
        $(".tt").mouseout(function() {
            if (!$("#p"+$(this).attr('ci')).hasClass('act')) {
                $("#p"+$(this).attr('ci')).css('fill','#dddddd');
            }
        });
        $(document).on('click','#ntdum',function(e){
            window.open('http://map.daum.net/link/map/'+$(this).attr('title')+','+$(this).attr('lat')+','+$(this).attr('lng'), "_self");
        });
        $('.fblogin').click(function(){

            facebookConnectPlugin.login(["email"], function(response) {
            if (response.authResponse) {
                GVar.utoken = response.authResponse.accessToken;
                facebookConnectPlugin.api( "me/?fields=id,email", ["email"],
                    function (response) {
                        $('#vw4').removeClass('active');
                        GVar.uemail = response.email;
                        ServerRequests.fb_login(GVar.utoken,GVar.uemail);
                    }); 
            }
         });
        });

        $(".tt").click(function(){
            $('path').css('fill','#dddddd');
            var ttid =  $(this).attr('ci');
            
            if (!$("#p"+ttid).hasClass('act')) {
                $('path').removeClass('act');
                HelperFuncions.show_to_cat_button();
                HelperFuncions.add_city_id(ttid);
                document.getElementById("p"+$(this).attr('ci')).style.fill = '#223b59';
                $("#p"+ttid).addClass('act');
                GVar.cid=ttid;
            } else {
                HelperFuncions.hide_to_cat_button();
                HelperFuncions.remove_city_id();
                document.getElementById("p"+$(this).attr('ci')).style.fill = '#dddddd';
                $("#p"+ttid).removeClass('act');
                GVar.cid=0;
            }
        });

        $('#vw1').click(function(){
            GVar.curpg=1;
            $('.tab-link').removeClass('active');
            $(this).addClass('active');
        });
        $("#vw2").click(function(){
            GVar.curpg=2;
        });
        $("#vw3").click(function(){
            GVar.curpg=3;
            $('.tab-link').removeClass('active');
            $('#vw3').addClass('active');
            if (typeof(Storage) !== "undefined") {
                var auth_token = localStorage.getItem("auth_token");
                if (!$.isBlank(auth_token)&&GVar.dash==0) {
                    var thtml = '<iframe id="dif" src="'+GVar.ajax_url+'/api/dashboard/'+auth_token+' "></iframe>';
                    $('#p4c').html(thtml);
                    GVar.dash=1;
                } else if(GVar.dash==0) {
                    $('#login-modal').modal('show');
                }
            } else {
                alert('WEB STORAGE NOT SUPPORTED!');
            }
        });
        $('#vw4').click(function(){
            GVar.curpg=4;
            $('.tab-link').removeClass('active');
            $(this).addClass('active');
            setTimeout(function(){
                $('#vw4').removeClass('active');
            }, 2000);
            if (GVar.auth==1) {
                GVar.auth=0;
                $('#lginlbl').text('Login');
                $('#_auth').attr('data','0');
                $('#user-status').attr('value','0');
                localStorage.removeItem('auth_token'); 
                GVar.utoken='';
                GVar.uemail='';           
            } else {
                $('#login-modal').modal('show');
            }
        });


        $('path').click(function(){
            var tcid = $(this).attr('c-id');
            //city intent id
            
            $('.tt').css('fill','#000000');
            if ($(this).hasClass('act')) {
                HelperFuncions.hide_to_cat_button();
                HelperFuncions.remove_city_id();
                $(this).css('fill','#dddddd');
                $(this).removeClass('act');
                GVar.cid=0;
            } else {
                GVar.cid=tcid;
                $('path').removeClass('act');
                HelperFuncions.show_to_cat_button();
                HelperFuncions.add_city_id(tcid);
                $('path').css('fill','#dddddd');
                $(this).css('fill','#223b59');
                $(this).addClass('act');      
            }
        });
        $('#tc').click(function(){
            GVar.curpg=2;
            $('.tab-link').removeClass('active');
            $('#vw2').addClass('active');
        });
        //back to cities
        $('#btc').click(function(){
            $('#view-1').animate({
                right: "0"
            });
            $('#b').animate({
                left: "100%"
            });
            setTimeout(function(){
                $('#b').addClass('hide');
            }, 1200);
        });
        $('#btcat').click(function(){
            HelperFuncions.hide_ads_page();
        });


        // $("path").mouseenter(function() {
        //   var tcid = $(this).attr('c-id');
        //   $('text[c-id*='+tcid+']').css('fill','rgb(255, 255, 255)');
        // });
        // $("path").mouseout(function() {
        //   var tcid = $(this).attr('c-id');
        //   $('text[c-id*='+tcid+']').css('fill','#000000');
        // });
        //city map functions
        

        $("#cats").change(function(){
            var t_v = $("#cats option:selected").val();
            if (t_v != '0') {
                $('.subcats').addClass('hide');
                $('.subcats').attr('name','');
                $('#subcat-select-'+t_v).removeClass('hide');
                $('#subcat-select-'+t_v).attr('name','subcat');
                $('#subcat-wrap').removeClass('hide');
                setTimeout(function(){
                    $('#subcat-wrap').css('visibility','visible').css('opacity',1);
                }, 50);
            } else {
                $('.subcats').addClass('hide');
                $('.2t-wrap').css('visibility','hidden').css('opacity',0);
                $('#subcat-wrap').css('visibility','hidden').css('opacity',0);
                $('#qk-post-btn').attr('disabled','disabled');
                setTimeout(function(){
                    $('.2t-wrap').addClass('hide');
                    $('#subcat-wrap').addClass('hide');
                }, 500);
            }
        });
        $(".subcats").change(function(){
            var t_v = $("option:selected", this).val();
            if (t_v != '0') {
                $('.2t-wrap').removeClass('hide');
                setTimeout(function(){
                    $('.2t-wrap').css('visibility','visible').css('opacity',1);
                    $('#qk-post-btn').removeAttr('disabled');
                    // HelperFuncions.InitGoogleMap();
                    if (GVar.qkpost_map==0) {
                        GVar.qkpost_map = 1;
                        Maps.PostAdInit();
                    }
                    
                }, 50);
            } else {
                    $('.2t-wrap').css('visibility','hidden').css('opacity',0);
                    $('#qk-post-btn').attr('disabled','disabled');
                setTimeout(function(){
                    $('.2t-wrap').addClass('hide');
                }, 500);
            }
        });


        $('#sharetest').click(function(){

            // this is the complete list of currently supported params you can pass to the plugin (all optional)
            var options = {
              url: 'https://www.website.com/foo/#bar?a=b',
              chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
            }

            var onSuccess = function(result) {
              console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
              console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
            }

            var onError = function(msg) {
              console.log("Sharing failed with message: " + msg);
            }

            window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

        });




        $('#lform').submit(function(e){
            e.preventDefault();
            var reg_form = $('#lform').serialize();
            ServerRequests.app_login(reg_form);
        });
        
        $(document).on('click','#waze-drive-to',function(){
            window.location.href = "waze://?ll="+$(this).attr('lat')+","+$(this).attr('lng')+"&navigate=yes";
        });

        $(document).on('click','#testform',function(){

        });
        $(document).on('click','#sharetest',function(){
         // redirect to delicious sharing page
            window.location.href='https://www.delicious.com/save?v=5&noui&jump=close&url='
                    +encodeURIComponent(window.webkitIntent.data)
                    +'&title=Enter title',
                    'delicious','toolbar=no,width=550,height=550';
        });



        $(document).on('click','.logout-btn',function(){
            $('#logout-modal').modal('show');
        });
        $(document).on('click','#reg-btn',function(){
            $('#login-modal').modal('hide');
            $('#register-modal').modal('show');
        });
        $(document).on('click','.m-vad',function(){
            var this_id = $(this).attr('data');
            $('#atwl-btn').attr('data',this_id);
            $('.fbc').html('');
            HelperFuncions.findAndViewAd(this_id);
        });
        $(document).on('click','.qkpost',function(){
            var _auth = parseInt($('#_auth').attr('data'));
            if (_auth == 1) {
                $('#qkpost-modal').modal('show');
                var html = '<div id="map-form-wrapper"><input id="pac-input" class="controls" type="text"'+
                            'placeholder="Enter a location">'+
                            '<div id="type-selector" class="controls">'+
                            '<input type="radio" name="type" id="changetype-all" checked="checked">'+
                            '<label for="changetype-all">All</label>'+
                            '<input type="radio" name="type" id="changetype-establishment">'+
                            '<label for="changetype-establishment">Establishments</label>'+
                            '</div></div>';
                $('#qkpost-map-container').append(html);
            } else {
                $('#login-modal').modal('show');
            }
        });
        //star-rating

        //star-rating
        $(document).on('click','.remove-ad-wl',function(){
            $t_id = $(this).attr('data');
            $('.modal-remove-btn').attr('data',$t_id);
            $('#warning-modal').modal('show');
        });
        $('.modal-remove-btn').click(function(event){
            $('#warning-modal').modal('hide');
            $t_id = $(this).attr('data');
            ServerRequests.removeWishList($t_id);
        });
        $(document).on('click','.view-ad-wl',function(){
            var this_id = $(this).attr('data');
            HelperFuncions.findAndViewAd2(this_id);
        });
        $('#searchbar').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                $tval = $(this).val();
                if (!HelperFuncions.isBlank($tval)) {
                    ServerRequests.s_func_txt($tval);
                }
            }
        });

        $('#submit-btn').click(function(){
            var reg_form = $('#reg-form').serialize();
            ServerRequests.form_validate(reg_form);
        });

        $('.tab-home').click(function(){
            $('.all-tabs').addClass('hide');
            $('.home-tab').removeClass('hide');
            $('.tab-cat').css('border-bottom','none');
            $('.tab-home').css('border-bottom','1px solid white');
        });
        $('.tab-cat').click(function(){
            $('.all-tabs').addClass('hide');
            $('.cat-tab').removeClass('hide');
            $('.tab-home').css('border-bottom','none');
            $('.tab-cat').css('border-bottom','1px solid white');
        });
        $('.links').click(function(){
            GVar.curpg=3;
            myApp.showTab('#view-3');
            $('#lgif').removeClass('hide');
            ServerRequests.refresh_ads($(this).attr('cat-id'));
        });
        $("#city-select-home").change(function(){
            var t_v = $("#city-select-home option:selected").val();
            if (t_v != '') {
                $('#post-list').addClass('hide');
                ServerRequests.refresh_ads_city(t_v);
            }
        });
        $(document).on('change', '#city-select-bar', function() {
         //     var latlng = {};
            // latlng.lat = parseFloat(this.options[this.selectedIndex].getAttribute('lat'));
            // latlng.lng = parseFloat(this.options[this.selectedIndex].getAttribute('lng'));
            // Maps.SetCenterLatLng(latlng);
        });
        $('#qk-post-btn').click(function(){
            var _form = $('#pkpost-form').serialize();
            ServerRequests.process_qkpost(_form,document.getElementById("cats").value);
        });
        $('#back-to-wl').click(function(){
            $(this).parents('.modal-footer').addClass('hide');
            $('#wishlist-ad-content').addClass('hide');
            $('.vwad-loading').addClass('hide');
            $('.wl_modal_body').removeClass('hide');
        });
        $(document).on('click','.add-to-wishlist',function(e){
            e.preventDefault();
            var _auth = parseInt($('#_auth').attr('data'));
            if (_auth == 1) {
                var _data = $(this).attr('data');
                $(this).css('color','green');
                ServerRequests.add_to_wishlist(_data);
            } else {
                $('.modal').modal('hide');
                $('#login-modal').modal('show');
            }
        });
        $('#view_wl').click(function(e){
            e.preventDefault();
            $('#wishlist-modal').modal('show');
        });     

    }
};

//SERVER REQUESTS
ServerRequests = {
    fb_login: function(tkn,email) {
        var data ={"token":tkn, "email":email}
        $.ajax({
            url: GVar.ajax_url+'/api/fblogin',
            type: 'post',
            dataType: 'json',
            'data': data,
            success: function(data) {
                var status = data.status;
                if (status==200) {
                    localStorage.setItem("auth_token", data.tkn);
                    GVar.auth=1;
                    $('#_auth').attr('data','1');
                    $('#user-status').attr('value','1'); 
                    $('#lginlbl').text('Logout');
                    $('#login-modal').modal('hide');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(JSON.stringify(xhr.responseText));
            }
        });
    },
    app_login: function(data) {
        $.ajax({
            url: GVar.ajax_url+'/api/login',
            type: 'post',
            dataType: 'json',
            'data': data,
            success: function(data) {
                var status = data.status;
                if (status==200) {
                    localStorage.setItem("auth_token", data.tkn);
                    GVar.auth=1;
                    $('#lnot').addClass('hide');
                    $('#_auth').attr('data','1');
                    $('#user-status').attr('value','1'); 
                    $('#lginlbl').text('Logout');
                    $('#login-modal').modal('hide');
                } else {
                    $('#lnot').removeClass('hide');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.responseText); // <- same here, your own div, p, span, whatever you wish to use
            }
        });
    },
    removeWishList: function(ad_id) {
        var token = $('meta[name=csrf-token]').attr('content');
        $.post(
            '/remove-wishlist',
            {
                "_token": token,
                "ad_id":ad_id
            },
            function(result){
                var status = result.status;
                var wl_html = result.wl_html;
                switch(status){                 
                    case 200:
                        $('#wishlist-table').html(wl_html);
                    break;

                    case 400:
                    break;

                }
            }
            );
    },
    refresh_ads: function(cat_id) {
        $('#p3c').html('');
        $('#lma').addClass('hide');
        GVar.category = cat_id;
        //new category reset load more
        GVar.scroll_load_more = 1;

        // document.getElementById("no-ads").style.display = 'none';
        var data ={"city_id":GVar.cid, "cat_id":cat_id}

        $.ajax({
            url: GVar.ajax_url+'/api/search-02',
            type: 'post',
            dataType: 'json',
            'data': data,
            success: function(data) {
                $('#lgif').addClass('hide');
                var status = data.status;
                if (status==200) {
                    if (data.ads['html']!='') {
                        
                        $('#p3c').html(data.ads['html']);
                        if (data.ads['empty']==1) {
                            $('#lma').addClass('hide');
                        } else {
                            $('#lma').removeClass('hide');
                        }
                    }

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#lgif').addClass('hide');
                console.log(xhr.responseText); // <- same here, your own div, p, span, whatever you wish to use
            }
        });

    },
    get_ad: function(ad_num) {
        var data ={"ad_num":ad_num, "city_id":GVar.cid, "cat_id":GVar.category}
        $.ajax({
            url: GVar.ajax_url+'/api/get-more-adds',
            type: 'post',
            dataType: 'json',
            'data': data,
            success: function(result) {
                var html = result.html_data['html'];
                //no more ads in this category
                if (html=='') {
                    GVar.scroll_load_more = 0;
                    $('#lma').addClass('hide');
                } else {
                    if (result.html_data['empty']==1) {
                        $('#lma').addClass('hide');
                    }
                    $('#lma').removeClass('hide');
                    $('#p3c').append(result.html_data['html']);
                    flag=0;
                }
                
                // $('.sin-ad').removeClass('updated_ads');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                // alert(xhr.responseText);
            }
        });
    },
    refresh_ads_city: function(city_id) {
        $loading_in = HelperFuncions.create_loading_input();
        $('.post-loading').html($loading_in);
        $('.post-loading').removeClass('hide');
        $('#footer').css('margin-top','150px');
        var token = $('meta[name=csrf-token]').attr('content');
        $.post(
            '/search-03',
            {
                "_token": token,
                "city_id":city_id
            },
            function(result){
                $('.post-loading').addClass('hide');
                $('.post-loading').html('');
                $('#footer').css('margin-top','0');
                var status = result.status;
                var ads = result.ads;
                var render = result.render;
                switch(status){                 
                    case 200:

                        $('#madsw').html(ads['html']);
                        $('#post-list').removeClass('hide');
                    break;

                    case 400:
                    break;

                }
            }
            );
    },
    s_func_txt: function(ttxt) {
        $('.search-loading').removeClass('hide');
        var token = $('meta[name=csrf-token]').attr('content');
        $.post(
            '/search-01',
            {
                "_token": token,
                "ttxt":ttxt
            },
            function(result){

                $('.all-tabs').addClass('hide');
                $('.home-tab').removeClass('hide');
                $('.tab-cat').css('border-bottom','none');
                $('.tab-home').css('border-bottom','1px solid white');

                $('.search-loading').addClass('hide');
                var status = result.status;
                var ads = result.ads;
                switch(status){                 
                    case 200:
                        $('#madsw').html(ads);
                    break;
                    case 400:
                    break;

                }
            }
            );
    },
    add_to_wishlist: function(data_id) {
        var token = $('meta[name=csrf-token]').attr('content');
        $.post(
            '/store-wishlist',
            {
                "_token": token,
                "data_id":data_id
            },
            function(result){
                var status = result.status;
                switch(status){                 
                    case 200:

                    break;

                    case 400:
                    break;

                }
            }
            );
    },
    vwad2: function(data_id) {
        $('.postview_modal_body').addClass('hide');
        $('.vwad-loading').removeClass('hide');
        var token = $('meta[name=csrf-token]').attr('content');
        $.post(
            '/prepare-ad',
            {
                "_token": token,
                "data_id":data_id
            },
            function(result){
                var status = result.status;
                var ad = result.ad;
                switch(status){                 
                    case 200:
                        $('#wishlist-ad-content').removeClass('hide');
                        $('#wishlist-ad-content').html(ad);
                        $('.vwad-loading').addClass('hide');

                    break;

                    case 400:
                    break;

                }
            }
            );
    },
    save_rate: function(rate,data_id) {
        var data ={"rate":rate, "data_id":data_id}
        $.ajax({
            url: GVar.ajax_url+'/api/save-rate',
            type: 'post',
            dataType: 'json',
            'data': data,
            success: function(data) {
                var status = data.status;
                if (status==200) {
                    document.getElementById('rev-c').innerHTML = 'Thank You!';
                }
            }
        });
    },
    vwad: function(data_id) {
        $('#postview-modal').modal('show');
        $('.postview_modal_body').addClass('hide');
        $('.vwad-loading').removeClass('hide');
        //clear reviews
        document.getElementById('rv').innerHTML = '';
        $('.rev').rating('destroy');
        //clear reviews
        var data ={"data_id":data_id}

        $.ajax({
            url: GVar.ajax_url+'/api/prepare-ad',
            type: 'post',
            dataType: 'json',
            'data': data,
            success: function(result) {
                var status = result.status;
                 var status = result.status;
                var ad_array = result.ad_array;
                var photos = ad_array.images_array;
                if (status==200) {
                    //init
                    document.getElementById('postview-data').innerHTML = '';
                    
                    //SHARING BUTTONS
                    var slink = GVar.baseurl+'/posts/'+data_id;
                    $('#ktalkbtn').click(function(event){
                        window.plugins.socialsharing.shareVia(
                            'kakao', 
                            ad_array['title_txt'], 
                            null, 
                            null, 
                            slink, 
                        function(){
                            console.log('share ok')
                        }, function(msg) {
                            alert('error: ' + msg)
                        });
                    });    

                    $('#fbsbtn').click(function(event){
                        var options = {
                            method: "share",
                            href: slink,
                            caption: ad_array['title_txt'],
                            description: ad_array['des_txt'],
                            picture: ad_array['simage'],
                            share_feedWeb: true
                        };
                        var onSuccess = function (userData) {
                        }
                        var onfailure = function (userData) {
                        }
                        facebookConnectPlugin.showDialog(
                            options, 
                            onSuccess, 
                            onfailure);

                    }); 

                    $('#gshare').click(function(event){
                        var options = {
                          message: ad_array['title_txt'], // not supported on some apps (Facebook, Instagram)
                          subject: 'Blik Posts', // fi. for email
                          files: null, // an array of filenames either locally or remotely
                          url: slink,
                          chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
                        }
                        var onSuccess = function(result) {
                          console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                          console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                        }
                        var onError = function(msg) {
                          console.log("Sharing failed with message: " + msg);
                        }
                        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
                    });
                    //SHARING BUTTONS END 

                    var new_html = "<div class='form-group break_all' id='pt'></div>"+
                    "<div class='form-group break_all' id='pd'></div>"+
                    "<div class='my-container' id='pi' style='opacity:0'></div>"+
                    "<div class='' id='pv' style='opacity:0'></div>";
                    document.getElementById('postview-data').innerHTML = new_html;
                    document.getElementById('pt').innerHTML = ad_array['title'];
                    document.getElementById('pd').innerHTML = ad_array['des'];
                    // document.getElementById('pi').innerHTML = ad_array['images'];
                    document.getElementById('pv').innerHTML = ad_array['videos'];
                    document.getElementById('dtw').innerHTML = ad_array['drivebtn'];

                    var linksContainer = $('#pi');
                    var baseUrl;
                    var title = ad_array['title_txt'];
                    // Add the demo images as links with thumbnails to the page:
                    $.each(photos, function (index, photo) {
                      baseUrl = photo.src;
                      $('<a/>')
                        .append($('<img>').prop('src', baseUrl))
                        .prop('href', baseUrl)
                        .prop('title', title)
                        .addClass('my-item')
                        .attr('data-gallery', '')
                        .appendTo(linksContainer)
                    });

                    // FIT IMAGES c
                    $(document).find('.my-container').sortablePhotos({
                      selector: '> .my-item',
                      sortable: 0,
                      padding: 3
                    });

                    //FULLSCREEN VIEWER
                    $('#pi').click(function(event){
                        event = event || window.event;
                        var target = event.target || event.srcElement,
                            link = target.src ? target.parentNode : target,
                            options = {
                                index: link,
                                // The number of elements to load around the current index:
                                preloadRange: 2,
                                // The transition speed for automatic slide changes, set to an integer
                                // greater 0 to override the default transition speed:
                                slideshowTransitionSpeed: 1,
                                // The event object for which the default action will be canceled
                                // on Gallery initialization (e.g. the click event to open the Gallery):
                                event: event
                            },
                            links = this.getElementsByTagName('a');
                        blueimp.Gallery(links, options);
                    });     


                    //LOAD MAP
                    if (ad_array['lat']!='' && ad_array['lng']!='') {
                        Maps.ViewAdUpdate(parseFloat(ad_array['lat']),parseFloat(ad_array['lng']));
                        $(document).find('#waze-info').tooltip();
                    }

                    //VIEW IT
                    $('.postview_modal_body').removeClass('hide');
                    $('.vwad-loading').addClass('hide');

                    //REFRESH MAP
                    Maps.ViewPostMapRefresh();

                    //RENDER REVIEWS
                    var rv_html = '<input name="input-name" type="number" class="rating rev"><span id="rev-c">'+ad_array['rvs-count']+' reviews</span>';
                    document.getElementById('rv').innerHTML = rv_html;
                    $(".rev").rating({
                        min:1, 
                        max:10, 
                        step:0.5, 
                        size:'xs',
                        showCaption:0,
                        showClear:0
                    });
                    $('.rev').rating('update', ad_array['rvs-rate']);
                    $('.rev').on('rating.change', function(event, value, caption) {
                        var _auth = parseInt($('#_auth').attr('data'));
                        if (_auth == 1) {
                            ServerRequests.save_rate(value,data_id);
                        } else {
                            $('#postview-modal').modal('hide');
                            $('#login-modal').modal('show');
                        }
                    });
                    //RENDER REVIEWS


                    setTimeout(function(){ 
                        $('#pi').css('opacity','1');
                        $('#pv').css('opacity','1');
                    }, 500);

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.responseText); // <- same here, your own div, p, span, whatever you wish to use
            }
        });

    },
    process_qkpost: function(_form,cat_id) {
        $('._required').css('color','inherit');
        $('#validating').removeClass('hide');
        $('#pos-gif').removeClass('hide');

        var data ={"_form":_form}

        $.ajax({
            url: GVar.ajax_url+'/api/process-qkpost',
            type: 'post',
            dataType: 'json',
            'data': data,
            success: function(data) {
                $('#lgif').addClass('hide');
                var status = data.status;
                switch(status){                 
                    case 200:
                        //relaod-ads-to show new post
                        ServerRequests.refresh_ads(cat_id);

                        $('#qkpost-modal').modal('hide');
                        setTimeout(function(){ 
                            $('#success-modal').modal('show');
                         }, 100);
                        setTimeout(function(){ 
                            $('#success-modal').modal('hide');
                         }, 1500);
                        HelperFuncions.clear_qp_modal();
                        $('body').css('padding-right','0');

                        //reload map search
                        $('#map-form-wrapper').remove();
                        GVar.qkpost_map = 0;
                    break;

                    case 400:
                        $('._required').css('color','red');
                    break;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#lgif').addClass('hide');
                console.log(xhr.responseText); // <- same here, your own div, p, span, whatever you wish to use
            }
        });

    },
    form_validate: function(reg_form) {
        var data ={"reg_form":reg_form}
        $.ajax({
            url: GVar.ajax_url+'/api/users/validate',
            type: 'post',
            dataType: 'json',
            'data': data,
            success: function(result) {
                $('#validating').addClass('hide');
                var status = result.status;
                var call_back = result.validation_callback;
                HelperFuncions.reset_errors();
                HelperFuncions.view_errors(call_back);
            }
        });

    },
    reg_submit: function(reg_form) {
        var data ={"reg_form":reg_form}
        $.ajax({
            url: GVar.ajax_url+'/api/users/register',
            type: 'post',
            dataType: 'json',
            'data': data,
            success: function(result) {
                var status = result.status;
                if (status==200) {
                    localStorage.setItem("auth_token", result.tkn);
                    GVar.auth=1;
                    $('#_auth').attr('data','1');
                    $('#user-status').attr('value','1'); 
                    $('#lginlbl').text('Logout');
                    $('#register-modal').modal('hide');
                }
            }
        });

    }
};

//HELPER FUNCTIONS
HelperFuncions = {
    isBlank(obj){
        return(!obj || $.trim(obj) === "");
    },
    hide_to_cat_button(){
        $('#tc').addClass('hide');
    },
    show_to_cat_button(){
        $('#tc').removeClass('hide');
    },
    add_city_id(tid){
        $('#tc').attr('t_city_id',tid);
    },
    remove_city_id(){
        $('#tc').attr('t_city_id','');
    },
    //VIEW AND HIDE ADS PAGE
    view_ads_page(){
        var c = $('#c');
        var b = $('#b');
        c.removeClass('hide');
        b.animate({
          left: "-100%"
        }, {
          duration: 50,
          easing: "swing"
        });
        c.animate({
          left: "0"
        }, {
          duration: 50,
          easing: "swing"
        });
        setTimeout(function(){
            b.addClass('hide');
        }, 500);
    },
    hide_ads_page(){
        var b = $('#b');
        var c = $('#c');
        b.removeClass('hide');
        b.animate({
          left: "0"
        }, {
          duration: 50,
          easing: "swing"
        });
        c.animate({
          left: "100%"
        }, {
          duration: 50,
          easing: "swing"
        });
        setTimeout(function(){
            c.addClass('hide');
        }, 500);
    },
    InitGoogleMap(){
        $('#us2-lat').attr('name','lat');
        $('#us2-lon').attr('name','long');
        lastCenter=_map.getCenter(); 
        google.maps.event.trigger(_map, "resize");
        _map.setCenter(lastCenter);
    },
    reset_errors(){
        $('.error-feedback').addClass('hide');
        $('.form-group').removeClass('has-error');
    },
    findAndViewAd(this_id){
        ServerRequests.vwad(this_id);
    },
    findAndViewAd2(this_id){
        $('.wl_modal_body').addClass('hide');
        $('.vwad-loading').removeClass('hide');
        $('.wl-footer').removeClass('hide');
        ServerRequests.vwad2(this_id);
    },
    view_errors(data){
        var error_status = false;
        $.each(data, function (i, j) {
            var message = null;
            switch(i){
                case "email":
                if (j['status'] == 400) {
                    error_status = true;
                    message = j['message'];
                    $('.email-error-feedback').removeClass('hide').html(message);
                    $('.email-error-feedback').parents('.form-group').addClass('has-error');
                }
                break;
                case "password":
                if (j['status'] == 400) {
                    error_status = true;
                    message = j['message'];
                    $('.password-error-feedback').removeClass('hide').html(message);
                    $('.password-error-feedback').parents('.form-group').addClass('has-error');

                }
                break;
                case "password_again":
                if (j['status'] == 400) {
                    error_status = true;
                    message = j['message'];
                    $('.password-again-error-feedback').removeClass('hide').html(message);
                    $('.password-again-error-feedback').parents('.form-group').addClass('has-error');
                }
                break;
            }

        });
        //IF THERE WAS NO ERRORS SUBMIT THE FORM
        if (error_status == false) {
            var reg_form = $('#reg-form').serialize();
            ServerRequests.reg_submit(reg_form);
        };
    },
    create_input(name,old_name,base_type) {
        var count = $(document).find('.posted-files').length;
        return '<input old-name="'+old_name+'" class="posted-files" name="posted_files['+count+']['+base_type+'][name]" type="hidden" value="'+name+'"/>';
    },
    dropz_removefile(file) {
        var name = file['name'];
        var poste_input = $('.posted-files[old-name="'+name+'"]');
        if (poste_input.length > 0) {
            poste_input.remove();
        } else {
            alert('Somthing Went Wrong!');
        }
    },
    clear_qp_modal() {
        $('.address-wrap').addClass('hide');
        $('.address-wrap').css('visibility','hidden').css('opacity','0');
        $('#address-checkbox').attr('checked', false);

        $('#subcat-wrap').addClass('hide');
        $('#subcat-wrap').css('visibility','hidden').css('opacity','0');

        $('.2t-wrap').addClass('hide');
        $('.2t-wrap').css('visibility','hidden').css('opacity','0');

        $('#title-wrap').addClass('hide');
        $('#title-wrap').css('visibility','hidden').css('opacity','0');
        
        $('#des-wrap').addClass('hide');
        $('#des-wrap').css('visibility','hidden').css('opacity','0');
        
        $('.zones').addClass('hide');
        $('.zones').css('visibility','hidden').css('opacity','0');

        $('.pk-form').val('');
        $(".qp-selects").val("0");
        $("#city-select-bar").val("0");
        $("#city-select-bar").val("0");

        // Dropzone.forElement("#post_upload_zone_image").removeAllFiles(true);
        // Dropzone.forElement("#post_upload_zone_video").removeAllFiles(true);
        $('#file-div').html('');
    },
    create_loading_input() {
        var loading_html =  '<div class="cssload-loader">'+
                                '<div class="cssload-flipper">'+
                                '<div class="cssload-front"></div>'+
                                '<div class="cssload-back"></div>'+
                                '</div>'+
                            '</div>';
        return loading_html;
    }
};

//MAPS
Maps = {
    PostAdInit(){
        var myLatLng = {lat: 37.555172565547075, lng: 126.9708452528564};
        document.getElementById('qkp-lat').value = myLatLng.lat;
        document.getElementById('qkp-lng').value = myLatLng.lng;
        window.map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            zoom: 12,    
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              mapTypeIds: ['roadmap', 'satellite']
            },
            streetViewControl: false
        });


        var geolocationDiv = document.createElement('div');
        geolocationDiv.setAttribute("id", "mylocation1");
        geolocationDiv.style.width = '30px';
        geolocationDiv.style.right = '0 !important';
       
        var geolocationControl = new GeolocationControl(geolocationDiv, map);
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(geolocationDiv);

        // GOOGLE MAP RESPONSIVENESS
        google.maps.event.addDomListener(window, "resize", function() {
         var center = map.getCenter();
         google.maps.event.trigger(map, "resize");
         map.setCenter(center); 
        });
        var input = /** @type {!HTMLInputElement} */(
            document.getElementById('pac-input'));
        var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
        //MARKER
        var infowindow = new google.maps.InfoWindow();
        window.PostAdMarker = new google.maps.Marker({
          map: map,
          position:myLatLng,
          draggable: true,
          anchorPoint: new google.maps.Point(0, -29)
        });
        //LOAD FROM CURRENT CITY
        var geocoder = new google.maps.Geocoder();
        //     navigator.geolocation.getCurrentPosition(function (position) {
        //          initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //          map.setCenter(initialLocation);

        //          marker.setPosition(initialLocation);

        //          infowindow.setContent('<div><strong>Search or Drag Marker</strong></div>');
        //  infowindow.open(map, marker);
        //     });
        //AFTER DRAG AND DROP SHOWS THE LAT AND LONG
        google.maps.event.addListener(PostAdMarker, 'dragend', function (event) {
            var latlng = {lat: this.getPosition().lat(), lng: this.getPosition().lng()};
            geocoder.geocode({'location': latlng}, function(results, status) {
              if (status === 'OK') {
                if (results[1]) {
                    // saving to dom
                    document.getElementById('qkp-lat').value = latlng.lat;
                    document.getElementById('qkp-lng').value = latlng.lng;

                    infowindow.setContent(results[1].formatted_address);
                    document.getElementById('pac-input').value = results[1].formatted_address;
                    // infowindow.open(map, marker);
                } else {
                  window.alert('No results found');
                }
              } else {
                window.alert('Geocoder failed due to: ' + status);
              }
            });
        });

        autocomplete.addListener('place_changed', function() {
            infowindow.close();
            PostAdMarker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);  // Why 17? Because it looks good.
            }

            // saving to dom
            document.getElementById('qkp-lat').value = place.geometry.location.lat();
            document.getElementById('qkp-lng').value = place.geometry.location.lng();
            PostAdMarker.setPosition(place.geometry.location);
            PostAdMarker.setVisible(true);
            
            var address = '';
            if (place.address_components) {
                address = [
                  (place.address_components[0] && place.address_components[0].short_name || ''),
                  (place.address_components[1] && place.address_components[1].short_name || ''),
                  (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address+'</div>');
            infowindow.open(map, PostAdMarker);
        });

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, types) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function() {
            autocomplete.setTypes(types);
          });
        }

        setupClickListener('changetype-all', []);
        setupClickListener('changetype-establishment', ['establishment']);
    },
    //initiation of posts map
    ViewAdInit(lat,lng){
        var myLatLng = {lat: lat, lng: lng};
        window.PostViewMap = new google.maps.Map(document.getElementById('map-post-view'), {
            center: myLatLng,
            zoom: 15,    
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              mapTypeIds: ['roadmap', 'satellite']
            },
            streetViewControl: true
        });



        // GOOGLE MAP RESPONSIVENESS
        google.maps.event.addDomListener(window, "resize", function() {
         var center = PostViewMap.getCenter();
         google.maps.event.trigger(PostViewMap, "resize");
         PostViewMap.setCenter(center); 
        });

        //MARKER
        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: PostViewMap,
          icon:GVar.flag_image,
          position:myLatLng,
          draggable: false,
          anchorPoint: new google.maps.Point(0, -29)
        });
    },
    ViewAdUpdate(lat,lng){
        var myLatLng = {lat: lat, lng: lng};
        PostViewMap.setCenter(myLatLng);
        var marker = new google.maps.Marker({
          map: PostViewMap,
          icon:GVar.flag_image,
          position:myLatLng,
          draggable: false,
          anchorPoint: new google.maps.Point(0, -29)
        });
    },
    ViewPostMapRefresh(){
        setTimeout(function(){ 
            var center = PostViewMap.getCenter();
            google.maps.event.trigger(PostViewMap, "resize");
            PostViewMap.setCenter(center); 
         }, 500);
    },
    SetCenterLatLng(latlng){
        document.getElementById('qkp-lat').value = latlng.lat;
        document.getElementById('qkp-lng').value = latlng.lng;
        map.setCenter(latlng);
        PostAdMarker.setPosition(latlng);
        google.maps.event.trigger(PostViewMap, "resize");
    }
}


function GeolocationControl(controlDiv, map) {

    // Set CSS for the control button
    var controlUI = document.createElement('div');

    controlUI.style.backgroundColor = '#444';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '1px';
    controlUI.style.borderColor = 'white';
    controlUI.style.height = '28px';
    controlUI.style.marginTop = '5px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to center map on your location';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control text
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '15px';
    controlText.style.color = 'white';
    // controlText.style.paddingLeft = '10px';
    // controlText.style.paddingRight = '10px';
    controlText.style.marginTop = '4px';
    controlText.innerHTML = '<i class="glyphicon glyphicon-map-marker"></i>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners to geolocate user
    google.maps.event.addDomListener(controlUI, 'click', geolocate);
}

function geolocate() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            // Create a marker and center map on user location
            marker = new google.maps.Marker({
                position: pos,
                draggable: true,
                animation: google.maps.Animation.DROP,
                map: map
            });

            map.setCenter(pos);
        });
    }
}

function uploadPics() {
    console.log("Ok, going to upload "+images.length+" images.");
    var defs = [];

    images.forEach(function(i) {
        console.log('processing '+i);
        var def = $.Deferred();

        function win(r) {
            console.log("thing done");
            if($.trim(r.response) === "0") {
                console.log("this one failed");
                def.resolve(0);
            } else {
                console.log("this one passed");
                def.resolve(1);
            }
        }

        function fail(error) {
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
            def.resolve(0);
        }

        var uri = encodeURI("http://localhost/testingzone/test.cfm");

        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName=i.substr(i.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";

        var ft = new FileTransfer();
        ft.upload(i, uri, win, fail, options);
        defs.push(def.promise());
        
    });

    $.when.apply($, defs).then(function() {
        console.log("all things done");
        console.dir(arguments);
    });

}