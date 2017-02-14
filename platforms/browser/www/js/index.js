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
    'l':0,
    'll':0,
    'skip':0,
    'qkpost_map':0,
    'category':0,
    'cid':0,
    'scroll_load_more':1,
    'flag_image':'img/beachflag.png',
    'lof_image':'img/lof.png',
    'lor_image':'img/lor.png',
    'bball':'img/bball.png',
    'rball':'img/rball2.png',
    'dash':0,
    'uemail':0,
    'fbid':'',
    'utoken':0,
    'lndinglat':36.5802466,
    'lndinglng':127.95776367,
    'utoken':0,
    'lmarkers':[],
    'admkrs':[],
    'qpmarkers':[],
    'pmmarkers':[],
    'lcircle':[],
    'iswaze':0,
    'imgcounter':0,
    'totalimgcounter':0,
    'drad':25,
    'icont':0,
    'vaf':0,
    'curcat':0,
    'lmarkerinfo':[],
    'adsbuffer':null,
    'emailorfbid':0,
    'currentpost':0
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
        InitiateApp();
        EventHandler();
        ViewAdInit(37.554084,126.949903);
        LandingInit(36.5802466,127.95776367);
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



            setTimeout(function(){ 
                setInterval(function(){ 
                    var num = GVar.l;
                    var numll = GVar.ll;
                    if (num == 0) {
                        if (numll==0) {
                            $('#lw4').removeClass('hide');
                        }
                        CheckGPS.check(function win(){
                            var onSuccess = function(position) {
                                $('#lw4').addClass('hide');
                                var nll = GVar.ll;
                                if (nll == 0) {
                                    GVar.ll=1;
                                    LandingUpdate(position.coords.latitude,position.coords.longitude);
                                }
                                GVar.l = 0;
                            };
                            function onError(error) {
                                GVar.ll=0;
                                GVar.l = 9;
                                $('#lw4').removeClass('hide');
                                autogpson();
                                // calldialog();
                            }
                            navigator.geolocation.getCurrentPosition(onSuccess, onError);
                          },
                          function fail(){
                            GVar.ll=0;
                            GVar.l = 9;
                            $('#lw4').removeClass('hide');
                            autogpson();
                            // calldialog();
                          });                
                    }
                }, 2000);
            }, 1000);


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


function PreLoadDom(){

}
function InitiateApp(){
    SetStates();
    NavbarListener();
    // InitFunctions.Dependencies();
    PageVisualSetup();
    SetAjaxHeader();
    ClearUrl();
    // WindowScrollListener();
    PhotoUpload();
    // InitFunctions.InitiateAutoComplete();
}
function EventHandler(){
    Events();
}

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
        $('#_auth').attr('data','0');
        $('#user-status').attr('value','0');
    } else {
        $('#lginicon').addClass('fa fa-user-circle');
        $('#lginlbl').text('Logout');
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
            InjectDashboard();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#lw').addClass('hide');
            GVar.auth=0;
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
function PageVisualSetup() {
    var fruits = ('Bar & Pub,Car Dealership,Coffee Shop,Entertainment,Food,Gas Station,Hotel,Medical Center,Movie Theater,Nightlife Spot,Outdoors & Recreation,Parking,Pharmacy,Real Estate,Supermarket,Taxi,Transport,Travel Agency').split(',');
    var autocompleteDropdownExpand = myApp.autocomplete({
        input: '#acde',
        openIn: 'dropdown',
        valueProperty: 'id',
        expandInput: true, // expand input
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        },
        onChange: function (autocomplete, value) {
            switch(value){                 
                case 'Bar & Pub':
                    GVar.curcat = 1;
                break;
                case 'Car Dealership':
                    GVar.curcat = 2;
                break;
                case 'Coffee Shop':
                    GVar.curcat = 3;
                break;
                case 'Entertainment':
                    GVar.curcat = 4;
                break;
                case 'Food':
                    GVar.curcat = 5;
                break;
                case 'Gas Station':
                    GVar.curcat = 6;
                break;
                case 'Hotel':
                    GVar.curcat = 7;
                break;
                case 'Medical Center':
                    GVar.curcat = 8;
                break;
                case 'Movie Theater':
                    GVar.curcat = 9;
                break;
                case 'Nightlife Spot':
                    GVar.curcat = 10;
                break;
                case 'Outdoors & Recreation':
                    GVar.curcat = 11;
                break;
                case 'Parking':
                    GVar.curcat = 12;
                break;
                case 'Pharmacy':
                    GVar.curcat = 13;
                break;
                case 'Real Estate':
                    GVar.curcat = 14;
                break;
                case 'Supermarket':
                    GVar.curcat = 15;
                break;
                case 'Taxi':
                    GVar.curcat = 16;
                break;
                case 'Transport':
                    GVar.curcat = 17;
                break;
                case 'Travel Agency':
                    GVar.curcat = 18;
                break;
                default:
                    alert('Somthing Went Wrong!');
            }
        }
    });
    var diar = ('5 10 15 20 25 30 35 40 45 50 60 70 100').split(' ');
    var autocompleteDropdownExpand = myApp.autocomplete({
        input: '#disin',
        openIn: 'dropdown',
        expandInput: true, // expand input
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < diar.length; i++) {
                if (diar[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(diar[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });
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
}

function PhotoUpload() {
    $(document).on('touchstart','#addPicture',function(){
        $imagesDiv = $(document).find("#images");  
        var imcount = $(document).find('.uimg').length;
        window.mxupld = 10 - imcount;
        window.imagePicker.getPictures(
            function(results) {
                $(document).find('#_upp').removeClass('hide');
                GVar.icont = GVar.icont + results.length;
                for (var i = 0; i < results.length; i++) {
                    var auth_token = localStorage.getItem("auth_token");
                    if (!$.isBlank(auth_token)&&GVar.dash==0) {
                        var fxxx = results[i];
                        var imageURI = results[i];
                        var options = new FileUploadOptions();
                        options.fileKey = "file";
                        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                        options.mimeType = "image/jpeg";
                        var params = new Object();
                        params.usertoken = auth_token;
                        options.params = params;
                        options.chunkedMode = false;
                        var ft = new FileTransfer();
                        ft.onprogress = function(progressEvent) {
                            var percent =  progressEvent.loaded / progressEvent.total * 100;
                            percent = Math.round(percent);
                            $(document).find('#pco').text(percent);
                        };
                        ft.upload(imageURI, GVar.ajax_url+"/api/upload-ads-tmp", function(data){
                            var newHtml = "<img class='uimg uplimg-"+$(document).find('.uimg').length+"' style='padding:3px;border-radius:5px;' width='25%' src='"+results[GVar.imgcounter]+"'>";
                            $imagesDiv.append(newHtml);
                            GVar.imgcounter = GVar.imgcounter+1;
                            GVar.totalimgcounter = GVar.totalimgcounter+1;
                            if (GVar.totalimgcounter>9) {
                                $(document).find("#addPicture").attr('disabled','disabled');
                            }
                            var result = data['response'];
                            var parsed_result = JSON.parse(result);
                            var new_name = parsed_result['img_name'];
                            var old_name = parsed_result['old_name'];
                            var base_type = parsed_result['base_type'];
                            var new_input = create_input(new_name,old_name,base_type);
                            $(document).find("#file-div").append(new_input);
                            $(document).find('#qkpmb').animate({ 
                                scrollTop: $(document).find('#qkpmb').height()
                            },'slow');
                            GVar.icont = GVar.icont - 1;
                            if (GVar.icont==0) {
                                $(document).find('#_upp').addClass('hide');
                            }

                        }, function(error){
                            GVar.icont = GVar.icont - 1;
                            if (GVar.icont==0) {
                                $(document).find('#_upp').addClass('hide');
                            }

                            $(document).find('#qppl').addClass('hide');
                            console.log(JSON.stringify(error));
                        }, options);

                    } else {
                        alert('Please Try to Login Again.')
                    }

                    GVar.imgcounter = 0;
                }

            }, function (error) {
                console.log('Error: ' + error);
            }, {
                maximumImagesCount: mxupld
            }
        );

    });
}
function SetStates() {
    window.user_state = document.getElementById('user-status').value;

}
function SetAjaxHeader() {
    $.ajaxSetup({
        headers: { 'X-CSRF-Token' : $('meta[name=csrf-token]').attr('content') }
    });
}
function ClearUrl() {
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
}
function WindowScrollListener() {
    $("#lma").click(function(){
        if (GVar.scroll_load_more==1) {
            GVar.skip = GVar.skip+8;
            get_ad(GVar.skip);
        }
    });
}
function BindMapToDiv() {
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
}
function InitiateAutoComplete() {
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
}
function NavbarListener() {
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
function Events() {

    var exitApp = false, intval = setInterval(function (){exitApp = false;}, 1000);
    document.addEventListener("backbutton", function (e){
        e.preventDefault();
        myApp.closePanel();
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

    $('#qkpost-modal').on('hidden.bs.modal', function () {
        clear_qp_modal();
    })
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
        window.open('http://map.daum.net/link/map/'+$(this).attr('title')+','+$(this).attr('lat')+','+$(this).attr('lng'), "_system");
    });

    $(".fbloginbtn").on('touchstart', function(e) {
        // alert('rep0');
        facebookConnectPlugin.login(["email"], function(response) {
        if (response.authResponse) {
            // alert('rep1');
            // console.log(response.authResponse);
            GVar.utoken = response.authResponse.accessToken;
            facebookConnectPlugin.api( "me/?fields=id,email", ["email"],
                function (response) {
                    $('#vw4').removeClass('active');
                    GVar.uemail = response.email;
                    if ($.isBlank(response.email)) {
                        GVar.uemail = response.id;
                    }
                    fb_login(GVar.utoken,GVar.uemail);
                }); 
        }
     });
    });
    $(document).on('touchstart','.rvcom',function(){
        var _auth = parseInt($('#_auth').attr('data'));
        var this_star = parseInt($(this).attr('revstar'));
        if (this_star!=999) {
            if (_auth == 1) {
                var com = $('.sendcomment textarea').val();
                var auth_token = localStorage.getItem("auth_token");
                if (!$.isBlank(com) && !$.isBlank(auth_token)) {
                    post_comment(auth_token,GVar.currentpost,com,this_star);
                    //ajax the message
                    $('.sendcomment textarea').val('');
                    $('.sendcomment textarea').attr('placeholder','Thank you');
                    $('.sbtnrev').rating('update', 0);
                    $(this).attr('revstar','999')
                    setTimeout(function(){
                        $('.sendcomment textarea').attr('placeholder','Write a Review');
                    }, 2000);
                }
            } else {
                $('#login-modal').modal('show');
            }            
        } else {
            alert('Tap on the stars to rate!')
        }

    });
    $(document).on('touchstart','.delcom',function(){
        var _auth = parseInt($('#_auth').attr('data'));
        if (_auth == 1) {
            var tci = $(this).parents('li').first().attr('tc');
            var auth_token = localStorage.getItem("auth_token");
            if (!$.isBlank(tci) && !$.isBlank(auth_token)) {
                del_comment(auth_token,tci);
            }
        } else {
            $('#login-modal').modal('show');
        }
    });

    $("#gobtn").on('touchstart', function(e) {
        myApp.closePanel();
        var dv = parseInt($('#disin').val());
        if (!$.isBlank(dv) && dv!=0) {
            GVar.drad=dv;
        } else {
            GVar.drad=25;
        }
        var tiv = GVar.curcat;
        setTimeout(function(){
            myApp.closePanel('left');
        }, 100);
        setTimeout(function(){
            if (GVar.vaf==0) {
                VAOM(GVar.lndinglat,GVar.lndinglng,tiv,GVar.drad);
            }
            GVar.vaf = 1;
        }, 500);

    });

    $(".itx").tap(function() {
        $('#acde').val($(this).text());
    });
    $(".icx").tap(function() {
        var tiv = $(this).attr('iv');
        setTimeout(function(){
            myApp.closePanel('left');
        }, 100);
        $('#acde').val($(this).find('.itx').first().text());
        setTimeout(function(){
            if (GVar.vaf==0) {
                VAOM(GVar.lndinglat,GVar.lndinglng,tiv,GVar.drad);
            }
            GVar.vaf = 1;
        }, 500);
    });
 
    $('#vw1').click(function(){
        setTimeout(function(){
            ResetLandingAndReasin();
        }, 50);
        GVar.curpg=1;
        $('.tab-link').removeClass('active');
        $(this).addClass('active');
        
    });
    $("#vw2").click(function(){
        GVar.curpg=2;
    });
    $("#vw3").click(function(){//dash
        GVar.curpg=3;
        $('.tab-link').removeClass('active');
        $('#vw3').addClass('active');
        var _auth = parseInt($('#_auth').attr('data'));
        if (_auth == 1) {
        } else {
            $('#login-modal').modal('show');
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
            ClearDashboard();           
        } else {
            $('#login-modal').modal('show');
        }
    });
    $('#tc').click(function(){
        GVar.curpg=2;
        $('.tab-link').removeClass('active');
        $('#vw2').addClass('active');
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
        app_login(reg_form);
    });
    
    $(document).on('click','#waze-drive-to',function(){
        OpenWazeAppOrMarket();
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
        findAndViewAd(this_id);
    });
    $(".qkpost").on('touchstart', function(e) {
        var _auth = parseInt($('#_auth').attr('data'));
        if (_auth == 1) {
            myApp.showTab('#view-2');
            GVar.qkpost_map = 1;
            PostAdInit();
        } else {
            $('#login-modal').modal('show');
        }
    });


    $(document).on('click','.remove-ad-wl',function(){
        $t_id = $(this).attr('data');
        $('.modal-remove-btn').attr('data',$t_id);
        $('#warning-modal').modal('show');
    });
    $('.modal-remove-btn').click(function(event){
        $('#warning-modal').modal('hide');
        $t_id = $(this).attr('data');
        removeWishList($t_id);
    });
    $(document).on('click','.view-ad-wl',function(){
        var this_id = $(this).attr('data');
        findAndViewAd2(this_id);
    });
    $(document).on('touchstart','#curlocqp',function(){
        $('#lw3').removeClass('hide');
        CheckGPS.check(function win(){
            $('#lw3').addClass('hide');
            var onSuccess = function(position) {
                qkpmUpdate(position.coords.latitude,position.coords.longitude);
            };
            function onError(error) {
                calldialog();
            }
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
          },
          function fail(){
            $('#lw3').addClass('hide');
            calldialog();
          });
    });
    $(document).on('touchstart','#gbtn-wrap',function(){
        $('#lw3').removeClass('hide');
        CheckGPS.check(function win(){
            $('#lw3').addClass('hide');
            var onSuccess = function(position) {
                LandingUpdate(position.coords.latitude,position.coords.longitude);
            };
            function onError(error) {
                calldialog();
            }
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
          },
          function fail(){
            $('#lw3').addClass('hide');
            calldialog();
          });
    });
    $('#searchbar').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            $tval = $(this).val();
            if (!isBlank($tval)) {
                s_func_txt($tval);
            }
        }
    });

    $(document).on('touchstart','#testpr',function(){
        $('#lw3').removeClass('hide');
    });
    $(document).on('touchstart','#addrad',function(){
        myApp.closePanel('right');
        GVar.drad = parseInt($('#rorp').val());
    });
    $('#submit-btn').click(function(){
        var reg_form = $('#reg-form').serialize();
        form_validate(reg_form);
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
        refresh_ads($(this).attr('cat-id'));
    });
    $("#city-select-home").change(function(){
        var t_v = $("#city-select-home option:selected").val();
        if (t_v != '') {
            $('#post-list').addClass('hide');
            refresh_ads_city(t_v);
        }
    });
    $(document).find("#qk-post-btn").on('touchstart', function(e) {
        e.preventDefault();
        if ($(document).find('.uimg').length < 1) {
            alert('you must upload at least one image');
        } else {
            var _form = $('#pkpost-form').serialize();
            process_qkpost(_form,document.getElementById("cats").value);    
        }
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
            add_to_wishlist(_data);
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
function del_comment(auth_token,com_id) {
    var data ={"token":auth_token, "com_id":com_id}
    $.ajax({
        url: GVar.ajax_url+'/api/del-comment',
        type: 'post',
        dataType: 'json',
        'data': data,
        success: function(data) {
            var status = data.status;
            if (status==200) {
                $(document).find('.coli[tc='+com_id+']').remove();
            } else{

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.stringify(xhr.responseText));
        }
    });
}
function post_comment(auth_token,post_id,comment,this_star) {
    var data ={"token":auth_token, "post_id":post_id, "comment":comment,"rate":this_star}
    $.ajax({
        url: GVar.ajax_url+'/api/post-comment',
        type: 'post',
        dataType: 'json',
        'data': data,
        success: function(data) {
            var status = data.status;
            var rhtml = data.rhtml;
            if (status==200) {
                if (!isBlank(rhtml)) {
                    var sndli = $(document).find('#snd-li');
                    $(rhtml).insertBefore(sndli);
                    $(".nrate").rating({
                        size:'xs',
                        showCaption:0,
                        showClear:0
                    });
                } 
            } else if(status==401){
               alert('You have previously reviewed this post! If you wish to add a new review please delete your previous review and try again.');
            } else{

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.stringify(xhr.responseText));
        }
    });
}
function fb_login(tkn,email) {
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
                InjectDashboard();
            } else{
                alert('Unable To Login');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.stringify(xhr.responseText));
        }
    });
}
function app_login(data) {
    $.ajax({
        url: GVar.ajax_url+'/api/login',
        type: 'post',
        dataType: 'json',
        'data': data,
        success: function(data) {
            var status = data.status;
            $('#lnot').addClass('hide');
            if (status==200) {
                localStorage.setItem("auth_token", data.tkn);
                GVar.auth=1;
                $('#_auth').attr('data','1');
                $('#user-status').attr('value','1'); 
                $('#lginlbl').text('Logout');
                $('#login-modal').modal('hide');
                InjectDashboard();
            } else {
                $('#lnot').removeClass('hide');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText); // <- same here, your own div, p, span, whatever you wish to use
        }
    });
}
function removeWishList(ad_id) {
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
}
function refresh_ads(cat_id) {
    $('#p3c').html('');
    $('#lma').addClass('hide');
    GVar.category = cat_id;
    //new category reset load more
    GVar.scroll_load_more = 1;

    var rad = $('#lndrad').val();
    var data ={"lat":GVar.lndinglat,"lng":GVar.lndinglng, "cat_id":cat_id,'radius':rad}

    $.ajax({
        url: GVar.ajax_url+'/api/search-02loc',
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
}
function get_ad(ad_num) {
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
}
function refresh_ads_city(city_id) {
    $loading_in = create_loading_input();
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
}
function s_func_txt(ttxt) {
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
}
function add_to_wishlist(data_id) {
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
}
function vwad2(data_id) {
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
}
function save_rate(rate,data_id) {
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
}
function VAOM(lat,lng,cat_id,rd) {
    $('#lw2').removeClass('hide');
    var olatlng = {lat: parseFloat(lat),lng: parseFloat(lng)};
    var data ={"cat_id":cat_id,"lat":lat,"lng":lng,"radius":rd}
    $.ajax({
        url: GVar.ajax_url+'/api/ads-req-map',
        type: 'post',
        dataType: 'json',
        'data': data,
        success: function(data) {
            $('#lw2').addClass('hide');
            GVar.vaf=0;
            var status = data.status;
            switch(status){  
                case 200:
                    adClearMarker();
                    var ads = data.ads;
                    var zoomnum = 9;
                    var drd = GVar.drad;
                    if (drd==25) {
                        zoomnum=9;
                    } else if(drd<20 && drd >= 10){
                        zoomnum=10;
                    } else if(drd<10 && drd >= 5){
                        zoomnum=12;
                    } else if(drd<5 && drd > 0){
                        zoomnum=14;
                    } else if(drd>25 && drd <= 50){
                        zoomnum=8;
                    } else if(drd>50 && drd <= 200){
                        zoomnum=7;
                    } else if(drd>200 && drd <= 1000){
                        zoomnum=4;
                    }
                    LandingMap.setCenter(olatlng);
                    LandingMap.setZoom(zoomnum);
                    if (!isBlank(ads)) {
                        GVar.adsbuffer =  ads;
                        if ($.isArray(ads)) {
                            $.each( ads, function( ke, va ) {
                                if (!isBlank(va)) {
                                        if (!isBlank(va['lat']) && !isBlank(va['lng']) && !isBlank(va['title']) ) {
                                            var myLatLng = {lat: parseFloat(va['lat']),lng: parseFloat(va['lng'])};
                                            var cstr = '<div id="content">'+
                                            '<div id="siteNotice">'+
                                            '</div>'+
                                            '<div id="bodyContent">'+
                                            '<p><b>'+va['title']+'</b>, '+va['des']+'</p>'+
                                            '<a href="#" class="m-vad btn btn-primary btn-block" data="'+va['id']+'">See This Post</a>'+
                                            '</div>'+
                                            '</div>';

                                            var infowindow = new google.maps.InfoWindow({
                                              content: cstr
                                            });
                                            var image = {
                                              url: GVar.bball,
                                              size: new google.maps.Size(40, 40),
                                              origin: new google.maps.Point(0, 0),
                                              anchor: new google.maps.Point(17, 34),
                                              scaledSize: new google.maps.Size(40, 40)
                                            };
                                            var marker = new google.maps.Marker({
                                              map: LandingMap,
                                              icon:image,
                                              position:myLatLng,
                                              animation: google.maps.Animation.DROP,
                                              draggable: false,
                                              title: va['title']
                                            });
                                            marker.addListener('click', function() {
                                              infowindow.open(LandingMap, marker);
                                            });
                                            GVar.admkrs.push(marker);
                                            GVar.lmarkerinfo.push(infowindow);

                                        }
                                }
                            });  
                        }
                    } else {
                        if(typeof(timeout) != "undefined" && timeout !== null) {
                            clearTimeout(timeout);
                        }
                        myApp.closeNotification(".notification-item");
                        myApp.addNotification({
                            title: 'BLINK',
                            message: "Sorry we couldn't find any results :/ Try broaden search radius or try different category",
                        });
                        window.timeout = setTimeout(function () { myApp.closeNotification(".notification-item"); }, 2000); 
                    }

                break;

                case 400:
                    alert("Somthing Went Wrong! Try Again.");
                break;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            GVar.vaf=0;
            $('#lw2').addClass('hide');
        }
    });
}
function ResetLandingAndReasin(){
    var lat = GVar.lndinglat;
    var lng = GVar.lndinglng;

    $('#fpmap').html('');
    $('#fpmap').css('height',($(window).height()-20));
    $(window).resize(function() {
        $('#fpmap').css('height',($(window).height()-20));
    });

    var myLatLng = {lat: lat, lng: lng};
    window.LandingMap = new google.maps.Map(document.getElementById('fpmap'), {
        center: myLatLng,
        zoom: 6,    
        mapTypeControl: false,
        streetViewControl: false,
        disableDefaultUI: true
    });
    // GOOGLE MAP RESPONSIVENESS
    google.maps.event.addDomListener(window, "resize", function() {
     var center = LandingMap.getCenter();
     google.maps.event.trigger(LandingMap, "resize");
     LandingMap.setCenter(center); 
    });


    google.maps.event.addListener(LandingMap, 'click', function(event) {
       placeMarker(event.latLng);
    });

    function placeMarker(location) {
        LandingClearMarker();
        var marker = new google.maps.Marker({
            position: location, 
            map: LandingMap
        });
        GVar.lndinglat = marker.getPosition().lat();
        GVar.lndinglng = marker.getPosition().lng();
        GVar.lmarkers.push(marker);

        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
            strokeColor: '#badbff',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#a0ccfb',
            fillOpacity: 0.35,
            map: LandingMap,
            center: location,
            radius: GVar.drad*1000
        });
        GVar.lcircle.push(cityCircle);
        // var zoomnum = 9;
        // if (GVar.drad==25) {
        //     zoomnum=9;
        // } else if(GVar.drad<20 && GVar.drad >= 10){
        //     zoomnum=10;
        // } else if(GVar.drad<10 && GVar.drad >= 5){
        //     zoomnum=12;
        // } else if(GVar.drad<5 && GVar.drad > 0){
        //     zoomnum=14;
        // } else if(GVar.drad>25 && GVar.drad <= 50){
        //     zoomnum=8;
        // } else if(GVar.drad>50 && GVar.drad <= 200){
        //     zoomnum=7;
        // } else if(GVar.drad>200 && GVar.drad <= 1000){
        //     zoomnum=4;
        // }

        // LandingMap.setCenter(location);
        // LandingMap.setZoom(zoomnum);
    }


    adClearMarker();
    var ads = GVar.adsbuffer;
    if (!isBlank(ads)) {
        if ($.isArray(ads)) {
            $.each( ads, function( ke, va ) {
                if (!isBlank(va)) {
                        if (!isBlank(va['lat']) && !isBlank(va['lng']) && !isBlank(va['title']) ) {
                            var myLatLng = {lat: parseFloat(va['lat']),lng: parseFloat(va['lng'])};
                            var cstr = '<div id="content">'+
                            '<div id="siteNotice">'+
                            '</div>'+
                            '<div id="bodyContent">'+
                            '<p><b>'+va['title']+'</b>, '+va['des']+'</p>'+
                            '<a href="#" class="btn btn-sm btn-success m-vad" data="'+va['id']+'">View</a>'+
                            '</div>'+
                            '</div>';

                            var infowindow = new google.maps.InfoWindow({
                              content: cstr
                            });
                            var image = {
                              url: GVar.bball,
                              size: new google.maps.Size(40, 40),
                              origin: new google.maps.Point(0, 0),
                              anchor: new google.maps.Point(17, 34),
                              scaledSize: new google.maps.Size(40, 40)
                            };
                            var marker = new google.maps.Marker({
                              map: LandingMap,
                              icon:image,
                              position:myLatLng,
                              draggable: false,
                              title: va['title']
                            });
                            marker.addListener('click', function() {
                              infowindow.open(LandingMap, marker);
                            });
                            GVar.admkrs.push(marker);
                            GVar.lmarkerinfo.push(infowindow);
                        }
                }
            });  
        }
    }
    var drd = GVar.drad;
    if (drd==25) {
        zoomnum=9;
    } else if(drd<20 && drd >= 10){
        zoomnum=10;
    } else if(drd<10 && drd >= 5){
        zoomnum=12;
    } else if(drd<5 && drd > 0){
        zoomnum=14;
    } else if(drd>25 && drd <= 50){
        zoomnum=8;
    } else if(drd>50 && drd <= 200){
        zoomnum=7;
    } else if(drd>200 && drd <= 1000){
        zoomnum=4;
    }

    var olatlng = {lat: parseFloat(GVar.lndinglat),lng: parseFloat(GVar.lndinglng)};
    LandingMap.setCenter(olatlng);
    LandingMap.setZoom(zoomnum);
    GetGPSLocationNoZoom();
}
function vwad(data_id) {
    $('.vwad-loading').removeClass('hide');
    //clear reviews
    document.getElementById('rv').innerHTML = '';
    $('.rev').rating('destroy');
    //clear reviews

    var user_token = 0;
    var _auth = parseInt($('#_auth').attr('data'));
    if (_auth == 1) {
        var auth_token = localStorage.getItem("auth_token");
        if (!$.isBlank(auth_token)) {
            user_token = auth_token;
        }
    }

    var data ={"data_id":data_id,"user_token":user_token};

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
                myApp.showTab('#view-5');
                //init
                document.getElementById('postview-data').innerHTML = '';

                // var fbcomhtml ='<iframe src="https://www.betterlifeinkorea.com/api/fbcomment/'+data_id+'/'+GVar.utoken+'" style="position:relative; top:0px;'+
                //                 'left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0;'+
                //                 'overflow:hidden; z-index:999999;"></iframe>';
                // $('.fbc').html(fbcomhtml);
                
                //SHARING BUTTONS
                var slink = GVar.baseurl+'/api/appurlhandler/'+data_id;


                $("#gshare").on('touchstart', function(event) {
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
                "<div class='my-container' id='pi' style='opacity:0'></div>";
                document.getElementById('postview-data').innerHTML = new_html;
                document.getElementById('pt').innerHTML = ad_array['title'];
                document.getElementById('pd').innerHTML = ad_array['des'];
                // document.getElementById('dtw').innerHTML = ad_array['drivebtn'];
                document.getElementById('dbtn2').innerHTML = ad_array['drivebtn'];


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

                
                if (ad_array['lat']!='' && ad_array['lng']!='') {
                    ViewAdUpdate(parseFloat(ad_array['lat']),parseFloat(ad_array['lng']));
                    $(document).find('#waze-info').tooltip();
                }

                //VIEW IT
                $('.vwad-loading').addClass('hide');
                //REFRESH MAP
                ViewPostMapRefresh();

                //RENDER REVIEWS
                var rv_html = '<input name="input-name" type="number" class="rating rev"><span id="rev-c">'+ad_array['rvs-count']+' reviews</span>';
                document.getElementById('rv').innerHTML = rv_html;
                $(".rev").rating({
                    min:1, 
                    max:10, 
                    step:0.5, 
                    size:'xs',
                    showCaption:0,
                    showClear:0,
                    disabled:true
                });
                $('.rev').rating('update', ad_array['rvs-rate']);
                $('.rev').on('rating.change', function(event, value, caption) {
                    var _auth = parseInt($('#_auth').attr('data'));
                    if (_auth == 1) {
                        save_rate(value,data_id);
                    } else {
                        $('#postview-modal').modal('hide');
                        $('#login-modal').modal('show');
                    }
                });
                //comments
                if (!$.isBlank(ad_array['coms'])) {
                    document.getElementById('comw').innerHTML = ad_array['coms'];
                    $(".sbtnrev").rating({
                        min:1, 
                        max:10, 
                        step:0.5, 
                        size:'xs',
                        showCaption:0,
                        showClear:0
                    });
                    $('.sbtnrev').on('rating.change', function(event, value, caption) {
                        $('.rvcom').attr('revstar',value);
                    });
                    $(".comrate").rating({
                        size:'xs',
                        showCaption:0,
                        showClear:0
                    });


                }

                GVar.currentpost = data_id;
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
}
function process_qkpost(_form,cat_id) {
    $('._required').css('color','inherit');
    // $('#validating').removeClass('hide');
    $('#pos-gif').removeClass('hide');

    var data ={"_form":_form,"tkn":localStorage.getItem("auth_token")}

    $.ajax({
        url: GVar.ajax_url+'/api/process-qkpost',
        type: 'post',
        dataType: 'json',
        'data': data,
        success: function(data) {
            $('#pos-gif').addClass('hide');
            var status = data.status;
            switch(status){                 
                case 200:
                    //relaod-ads-to show new post
                    // refresh_ads(cat_id);
                    ResetLandingAndReasin();
                    ResetView2();
                    myApp.addNotification({
                        title: 'BLINK',
                        message: 'Successfully Posted! Continue Exploring BLIK',
                        media: '<i style="color:#5cb85c" class="fa fa-check" aria-hidden="true"></i>'
                    });
                    setTimeout(function(){
                        myApp.showTab('#view-1');
                    }, 100);
                    setTimeout(function(){
                        ResetLandingAndReasin();
                    }, 300);

                break;

                case 400:
                    alert('please fill the required fields')
                    $('._required').css('color','red');
                break;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#pos-gif').addClass('hide');
            console.log(xhr.responseText); // <- same here, your own div, p, span, whatever you wish to use
        }
    });
}
function form_validate(reg_form) {
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
            reset_errors();
            view_errors(call_back);
        }
    });
}
function ResetView2(){
    GVar.qkpost_map = 1;
    GVar.imgcounter = 0;
    GVar.icont = 0;
    GVar.totalimgcounter = 0;
    $('#v2pc').html('<form id="pkpost-form" style="float: left;width: 100%"> <div class="list-block"> <ul> <li> <a href="#" data-searchbar="true" data-searchbar-placeholder="Search Category" class="item-link smart-select" data-back-on-select="true"> <select name="cat" class="form-control qp-selects" id="cats"> <option value="1">Bar & Pub</option> <option value="2">Car Dealership</option> <option value="3">Coffee Shop</option> <option value="4">Entertainment</option> <option value="5">Food</option> <option value="6">Gas Station</option> <option value="7">Hotel</option> <option value="8">Medical Center</option> <option value="9">Movie Theater</option> <option value="10">Nightlife Spot</option> <option value="11">Outdoors & Recreation</option> <option value="12">Parking</option> <option value="13">Pharmacy</option> <option value="14">Real Estate</option> <option value="15">Supermarket</option> <option value="16">Taxi</option> <option value="17">Transport</option> <option value="18">Travel Agency</option> </select> <div class="item-content"> <div class="item-inner"> <div class="item-title">Category</div><div class="item-after">Select</div></div></div></a> </li><li style="display: none"> <a href="#" data-searchbar="true" data-searchbar-placeholder="Search Cities" class="item-link smart-select" data-back-on-select="true"> <select name="city" class="form-control" id="city-select-bar" status=false> <option value="1" selected="">Gangwon-Do</option> <option value="2">Gyeonggi-Do</option> <option value="3">Seoul</option> <option value="4">Incheon</option> <option value="5">Daejeon</option> <option value="6">Chungcheong-Bukdo</option> <option value="7">Ullung-Do</option> <option value="8">Gyeongsang-Bukdo</option> <option value="9">Ulsan</option> <option value="10">Gyeongsang-Namdo</option> <option value="11">Busan</option> <option value="12">Daegu</option> <option value="13">Gwangju</option> <option value="14">Jeolla-Bukdo</option> <option value="15">Chungcheong-Namdo</option> <option value="16">Jeollanam-Do</option> <option value="17">Jeju-Do</option> </select> <div class="item-content"> <div class="item-inner"> <div class="item-title">City</div><div class="item-after">Select</div></div></div></a> </li></ul> </div><div class="form-group" style="float:left;width: 100%;"> <input type="hidden" id="qkp-lat" name="lat"/> <input type="hidden" id="qkp-lng" name="long"/> <div id="qkpost-map-container" style="width:80%;margin:0 auto"> <input id="pac-input" class="controls" type="text" placeholder="Search Address" style="width: 80% !important;margin: 3px 0 0 3px !important;height: 36px !important;"><div style="height:300px" id="postmap"></div></div></div><div class="form-group" id="title-wrap" style=""> <label>Title: <span class="_required">*required</span> </label> <input type="text" class="form-control pk-form" name="title" id="email" placeholder="Title" aria-describedby="sizing-addon2"> </div><div class="form-group" id="des-wrap" style=""> <label>Description: <span class="_required">*required</span> </label> <textarea style="resize:vertical;" class="form-control pk-form" name="description"></textarea> </div><div id="file-div"></div></form> <div class="" style="float: left;width: 100%"> <div id="_upp" class="hide"> <p> Uploading... ( <span id="pco"></span> %) </p></div><div style="float: left;width: 100%;padding: 10px" id="images"> </div></div><div class="" style="float: right;"> <div class="btn-group"> <a href="#" id="addPicture" class="btn btn-primary">Browse Images</a> <a href="#" id="qk-post-btn" class="btn btn-success">Post</a> </div><div id="pos-gif" class="pull-right hide" style="line-height: 32px; margin-right: 10px;"> <img src="gif/loading1.gif" width="20px;"> </div></div>');
    setTimeout(function(){
        PostAdInit();
        $(document).find("#qk-post-btn").on('touchstart', function(e) {
            e.preventDefault();
            var _form = $('#pkpost-form').serialize();
            process_qkpost(_form,document.getElementById("cats").value);
        });
        // PhotoUpload();
    }, 300);
}
function reg_submit(reg_form) {
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
function isBlank(obj) {
    return(!obj || $.trim(obj) === "");
}
function hide_to_cat_button() {
    $('#tc').addClass('hide');
}
function show_to_cat_button() {
    $('#tc').removeClass('hide');
}
function add_city_id(tid) {
    $('#tc').attr('t_city_id',tid);
}
function remove_city_id() {
    $('#tc').attr('t_city_id','');
}
function view_ads_page() {
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
}
function hide_ads_page() {
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
}
function reset_errors() {
    $('.error-feedback').addClass('hide');
    $('.form-group').removeClass('has-error');
}
function findAndViewAd(this_id) {
    vwad(this_id);
}
function findAndViewAd2(this_id) {
    $('.wl_modal_body').addClass('hide');
    $('.vwad-loading').removeClass('hide');
    $('.wl-footer').removeClass('hide');
    vwad2(this_id);
}
function view_errors(data) {
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
        reg_submit(reg_form);
    };
}
function create_input(name,old_name,base_type) {
    var count = $(document).find('.posted-files').length;
    return '<input old-name="'+old_name+'" class="posted-files" name="posted_files['+count+']['+base_type+'][name]" type="hidden" value="'+name+'"/>';

}
function dropz_removefile(file) {
    var name = file['name'];
    var poste_input = $('.posted-files[old-name="'+name+'"]');
    if (poste_input.length > 0) {
        poste_input.remove();
    } else {
        alert('Somthing Went Wrong!');
    }
}
function clear_qp_modal() {
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

    $('.pk-form').val('');
    $(".qp-selects").val("0");
    $("#city-select-bar").val("0");
    $('#images').html('');
    $('#file-div').html('');

    $("#addPicture").removeAttr('disabled');

    GVar.imgcounter = 0;
    GVar.totalimgcounter = 0;
}
function create_loading_input() {
    var loading_html =  '<div class="cssload-loader">'+
                            '<div class="cssload-flipper">'+
                            '<div class="cssload-front"></div>'+
                            '<div class="cssload-back"></div>'+
                            '</div>'+
                        '</div>';
    return loading_html;
}
function PostAdInit() {
    // $(document).find("#qkpcl").on('touchstart', function(e) {
    //     e.preventDefault();
    //     CheckGPS.check(function win(){
    //         var onSuccess = function(position) {
    //             qkpmUpdate(position.coords.latitude,position.coords.longitude);
    //         };
    //         function onError(error) {
    //             calldialog();
    //         }
    //         navigator.geolocation.getCurrentPosition(onSuccess, onError);
    //       },
    //       function fail(){
    //         calldialog();
    //       });
    // });

    var myLatLng = {lat: 36.5802466, lng: 127.95776367};
    document.getElementById('qkp-lat').value = myLatLng.lat;
    document.getElementById('qkp-lng').value = myLatLng.lng;
    window.postmap = new google.maps.Map(document.getElementById('postmap'), {
        center: myLatLng,
        zoom: 6,    
        mapTypeControl: false,
        streetViewControl: false,
        disableDefaultUI: true,
        mapTypeId: 'roadmap'
    });

    google.maps.event.addListener(postmap, 'click', function(event) {
       placeMarkerpm(event.latLng);
    });
    //MARKER
    window.PostAdMarker = new google.maps.Marker({
      map: postmap,
      position:myLatLng,
      draggable: true,
      anchorPoint: new google.maps.Point(0, -29)
    });
    GVar.pmmarkers.push(PostAdMarker);

    function placeMarkerpm(location) {
        PostMapClearMarker();
        var marker = new google.maps.Marker({
            position: location, 
            map: postmap,
            draggable: true,
            anchorPoint: new google.maps.Point(0, -29)
        });

        document.getElementById('qkp-lat').value = marker.getPosition().lat();
        document.getElementById('qkp-lng').value = marker.getPosition().lng();
        GVar.pmmarkers.push(marker);

        postmap.setCenter(location);
        postmap.setZoom(15);
    }

    // GOOGLE MAP RESPONSIVENESS
    google.maps.event.addDomListener(window, "resize", function() {
     var center = postmap.getCenter();
     google.maps.event.trigger(postmap, "resize");
     postmap.setCenter(center); 
    });


    //LOAD FROM CURRENT CITY
    var geocoder = new google.maps.Geocoder();
    //AFTER DRAG AND DROP SHOWS THE LAT AND LONG
    google.maps.event.addListener(PostAdMarker, 'dragend', function (event) {
        var latlng = {lat: this.getPosition().lat(), lng: this.getPosition().lng()};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
                // saving to dom
                document.getElementById('qkp-lat').value = latlng.lat;
                document.getElementById('qkp-lng').value = latlng.lng;
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
    });

    var getlocDiv = document.createElement('div');
    var getlocvar = new getloc(getlocDiv, postmap);  
    getlocDiv.index = 1;
    postmap.controls[google.maps.ControlPosition.TOP_RIGHT].push(getlocDiv);

    // Create the search box and link it to the UI element.
     var options = {
      types: ['(cities)'],
      componentRestrictions: {country: "kr"}
     };
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input, options);
    postmap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    postmap.addListener('bounds_changed', function() {
      searchBox.setBounds(postmap.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }
      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      postmap.fitBounds(bounds);
    });
    $$('body').on('touchstart','.pac-container', function(e){
        e.stopImmediatePropagation();
    })
}
function qkpmUpdate(lat,lng) {
    document.getElementById('qkp-lat').value = lat;
    document.getElementById('qkp-lng').value = lng;
    qkpmClearMarker();
    var myLatLng = {lat: lat, lng: lng};
    postmap.setCenter(myLatLng);
    postmap.setZoom(15);
    var marker = new google.maps.Marker({
      map: postmap,
      icon:GVar.flag_image,
      position:myLatLng,
      draggable: true,
      anchorPoint: new google.maps.Point(0, -29)
    });
    GVar.qpmarkers.push(marker);
}
function qkpmClearMarker() {
    for (var i = 0; i < GVar.qpmarkers.length; i++) {
      GVar.qpmarkers[i].setMap(null);
    }
}
function adClearMarker() {
    for (var i = 0; i < GVar.admkrs.length; i++) {
      GVar.admkrs[i].setMap(null);
    }
    for (var i = 0; i < GVar.lmarkerinfo.length; i++) {
      GVar.lmarkerinfo[i].setMap(null);
    }
}
function LandingInit(lat,lng) {
    $('#fpmap').html('');
    $('#fpmap').css('height',($(window).height()-20));
    $(window).resize(function() {
        $('#fpmap').css('height',($(window).height()-20));
    });
    var myLatLng = {lat: lat, lng: lng};
    window.LandingMap = new google.maps.Map(document.getElementById('fpmap'), {
        center: myLatLng,
        zoom: 6,    
        mapTypeControl: false,
        streetViewControl: false,
        disableDefaultUI: true,
        mapTypeId: 'roadmap'
    });
    // GOOGLE MAP RESPONSIVENESS
    google.maps.event.addDomListener(window, "resize", function() {
     var center = LandingMap.getCenter();
     google.maps.event.trigger(LandingMap, "resize");
     LandingMap.setCenter(center); 
    });


    google.maps.event.addListener(LandingMap, 'click', function(event) {
       placeMarker(event.latLng);
    });

    function placeMarker(location) {
        LandingClearMarker();
        var marker = new google.maps.Marker({
            position: location, 
            map: LandingMap
        });
        GVar.lndinglat = marker.getPosition().lat();
        GVar.lndinglng = marker.getPosition().lng();
        GVar.lmarkers.push(marker);

        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
            strokeColor: '#badbff',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#a0ccfb',
            fillOpacity: 0.35,
            map: LandingMap,
            center: location,
            radius: GVar.drad*1000
        });
        GVar.lcircle.push(cityCircle);
        // var zoomnum = 9;
        // if (GVar.drad==25) {
        //     zoomnum=9;
        // } else if(GVar.drad<20 && GVar.drad >= 10){
        //     zoomnum=10;
        // } else if(GVar.drad<10 && GVar.drad >= 5){
        //     zoomnum=12;
        // } else if(GVar.drad<5 && GVar.drad > 0){
        //     zoomnum=14;
        // } else if(GVar.drad>25 && GVar.drad <= 50){
        //     zoomnum=8;
        // } else if(GVar.drad>50 && GVar.drad <= 200){
        //     zoomnum=7;
        // } else if(GVar.drad>200 && GVar.drad <= 1000){
        //     zoomnum=4;
        // }

        // LandingMap.setCenter(location);
        // LandingMap.setZoom(zoomnum);
    }

    
    //MARKER
    var infowindow = new google.maps.InfoWindow();
}
function LandingUpdate(lat,lng) {
    LandingClearMarker();
    var myLatLng = {lat: lat, lng: lng};
    GVar.lndinglat = lat;
    GVar.lndinglng = lng;
    LandingMap.setCenter(myLatLng);
    LandingMap.setZoom(15);
    var image = {
      url: GVar.rball,
      size: new google.maps.Size(200, 200),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(40, 40)
    };
    var marker = new google.maps.Marker({
      map: LandingMap,
      icon:image,
      animation: google.maps.Animation.BOUNCE,
      position:myLatLng,
      draggable: false,
      anchorPoint: new google.maps.Point(0, -29)
    });
    GVar.lmarkers.push(marker);
    setTimeout(function(){ marker.setAnimation(null); }, 3000);
}
function InjectDashboard(){
    var _auth = parseInt($('#_auth').attr('data'));
    if (_auth == 1) {
        var auth_token = localStorage.getItem("auth_token");
        if (!$.isBlank(auth_token)) {
            var thtml = '<iframe id="dif" src="'+GVar.ajax_url+'/api/dashboard/'+auth_token+' "></iframe>';
            $('#p4c').html(thtml);
            GVar.dash=1;
        }
    } else {
        $('#login-modal').modal('show');
    }
}
function ClearDashboard(){
    $('#p4c').html('');
}
function LandingUpdateNoZoom(lat,lng) {
    LandingClearMarker();
    var myLatLng = {lat: lat, lng: lng};
    GVar.lndinglat = lat;
    GVar.lndinglng = lng;
    var image = {
      url: GVar.rball,
      size: new google.maps.Size(200, 200),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(40, 40)
    };
    var marker = new google.maps.Marker({
      map: LandingMap,
      icon:image,
      position:myLatLng,
      draggable: false,
      anchorPoint: new google.maps.Point(0, -29)
    });
    GVar.lmarkers.push(marker);
}

function QpUpdate(lat,lng) {
    LandingClearMarker();
    var myLatLng = {lat: lat, lng: lng};
    postmap.setCenter(myLatLng);
    postmap.setZoom(15);
    PostAdMarker.setPosition(myLatLng);
    document.getElementById('qkp-lat').value = lat;
    document.getElementById('qkp-lng').value = lng;
}
function LandingClearMarker() {
    for (var i = 0; i < GVar.lmarkers.length; i++) {
      GVar.lmarkers[i].setMap(null);
    }  
    for (var j = 0; j < GVar.lcircle.length; j++) {
      GVar.lcircle[j].setMap(null);
    }          
}
function PostMapClearMarker() {
    for (var i = 0; i < GVar.pmmarkers.length; i++) {
      GVar.pmmarkers[i].setMap(null);
    }  
}
function ViewAdInit(lat,lng) {
    var myLatLng = {lat: lat, lng: lng};
    window.PostViewMap = new google.maps.Map(document.getElementById('map-post-view'), {
        center: myLatLng,
        zoom: 15,    
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          mapTypeIds: ['roadmap']
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
}
function ViewAdUpdate(lat,lng) {
    var myLatLng = {lat: lat, lng: lng};
    PostViewMap.setCenter(myLatLng);
    var marker = new google.maps.Marker({
      map: PostViewMap,
      icon:GVar.flag_image,
      position:myLatLng,
      draggable: false,
      anchorPoint: new google.maps.Point(0, -29)
    });
}
function ViewPostMapRefresh() {
    setTimeout(function(){ 
        var center = PostViewMap.getCenter();
        google.maps.event.trigger(PostViewMap, "resize");
        PostViewMap.setCenter(center); 
     }, 500);
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

// function calldialog() {
//     cordova.dialogGPS();
// }

function calldialog() {
  cordova.dialogGPS("Your GPS is Disabled, this app needs to be enable to works.",//message
                    "Use GPS, with wifi or 3G.",//description
                    function(buttonIndex){//callback
                      switch(buttonIndex) {
                        case 0: 
                            GVar.l = 0;
                        break;//cancel

                        case 1:
                            GVar.l = 0;
                        break;//cancel
                        case 2:
                            $('#lw4').addClass('hide');
                            setTimeout(function(){ 
                                GVar.l = 0; 
                            }, 7000);
                            
                        break;//cancel
                      }},
                      "Please Turn on GPS",//title
                      ["Cancel","Later","Go"]);//buttons
}
function getloc(controlDiv, map) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.setAttribute("id", "curlocqp");
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '3px';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginRight = '3px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '23px';
    controlText.style.lineHeight = '33px';
    controlText.style.width = '33px';
    controlText.style.paddingLeft = '0';
    controlText.style.paddingRight = '0';
    controlText.innerHTML = '<i class="fa fa-crosshairs" aria-hidden="true"></i>';
    controlUI.appendChild(controlText);
}

function OpenWazeAppOrMarket(){
    var lat = parseFloat($(document).find('#waze-drive-to').attr('lat'));
    var lng = parseFloat($(document).find('#waze-drive-to').attr('lng'));
    if(device.platform === 'iOS') {
        var scheme = 'waze';
        launchnavigator.navigate([lat, lng]);
    }
    else if(device.platform === 'Android') {
        var scheme = 'com.waze';
        launchnavigator.navigate([lat, lng]);
    }  
    // appAvailability.check(
    //     scheme,       // URI Scheme or Package Name 
    //     function() {  // Success callback 
    //         window.location.href = "waze://?ll="+$(document).find('#waze-drive-to').attr('lat')+","+$(document).find('#waze-drive-to').attr('lng')+"&navigate=yes";
    //     },
    //     function() {
    //         if(device.platform === 'iOS') {
    //             cordova.plugins.market.open('waze');
    //         }
    //         else if(device.platform === 'Android') {
    //             cordova.plugins.market.open('com.waze');
    //         }  
    //     }
    // );

}
function GetGPSLocation(){
    $('#lw3').removeClass('hide');
    CheckGPS.check(function win(){
        $('#lw3').addClass('hide');
        var onSuccess = function(position) {
            LandingUpdate(position.coords.latitude,position.coords.longitude);
        };
        function onError(error) {
            calldialog();
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
      },
      function fail(){
        $('#lw3').addClass('hide');
        calldialog();
      });
}
function GetGPSLocationNoZoom(){
    $('#lw3').removeClass('hide');
    CheckGPS.check(function win(){
        $('#lw3').addClass('hide');
        var onSuccess = function(position) {
            LandingUpdateNoZoom(position.coords.latitude,position.coords.longitude);
        };
        function onError(error) {
            calldialog();
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
      },
      function fail(){
        $('#lw3').addClass('hide');
        calldialog();
      });
}
function autogpson(){
    cordova.plugins.locationAccuracy.canRequest(function(canRequest){
        if(canRequest){
            cordova.plugins.locationAccuracy.request(function(){
                GVar.l = 0;
            }, function (error){
                if(error){
                    // // Android only
                    // console.error("error code="+error.code+"; error message="+error.message);
                    // if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){

                    // }
                    if(error.code == cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
                        GVar.l = 0;
                    }
                }
            }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
            );
        }
    });    
}