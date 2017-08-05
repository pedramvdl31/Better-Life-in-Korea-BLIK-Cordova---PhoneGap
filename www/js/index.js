// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

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
    'debug':'1',
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
    'lndinglat':36.5802466,
    'lndinglng':127.95776367,
    'utoken':0,
    'lmarkers':[],
    'admkrs':[],
    'qpmarkers':[],
    'pmmarkers':[],
    'viewaddmarker':[],
    'lcircle':[],
    'iswaze':0,
    'imgcounter':0,
    'totalimgcounter':0,
    'drad':15,
    'icont':0,
    'vaf':0,
    'curcat':0,
    'lmarkerinfo':[],
    'adsbuffer':null,
    'emailorfbid':0,
    'currentpost':0,
    'curadlat':0,
    'curadlng':0,
    'lzs':6,
    'lgns_f':0,//LOGIN-SESSION-FLAG:1 OR 0
    'lgns_d':'',//LOGIN-SESSION-DATA:CLASS OR ID NAME
    'got_loc':0,
    'obfuscate_email':'',
    'cur_user_no_posts':0,
    'cur_user_img': '',
    'post_tobe_deleted':0,
    'profile_tobe_viewd':0,
    'dash_take':0,
    'dash_skip':0,
    'dash_loaded':0,
    'dash_take_default':2,
    'cur_profile_no_posts':0,
    'current_profile_view8':0,
    'loader_flag':0
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
        LandingInit(36.5802466,127.95776367);
        setTimeout(function(){
            ViewAdInit(37.554084,126.949903);
        }, 500);
        setTimeout(function(){
            PostAdInit();
        }, 500);

        GVar.lndinglat = 36.5802466;
        GVar.lndinglng = 127.95776367;
        GVar.got_loc = 1;
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
            //PHONE
            if (GVar.debug == 0) {
                document.addEventListener("online", onOnline, false);
                document.addEventListener("offline", onOffline, false);
                var connection = checkConnection();
                if (connection==1) {
                } else {
                    alert('Please connect to the Internet to continue ');
                    $('#ovwrapper').removeClass('hide');
                }
                ManageLocation();  
            } else {
                $('#lw4').addClass('hide');
            }

        } else {
          //BROWSER
          $('#lw4').addClass('hide');
        }

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {}
};

app.initialize();

function PreLoadDom(){
}
function InitiateApp(){
    SetStates();
    // NavbarListener();
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
function ManageLocation(){
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
                        $('#wgl').css('color','#5cb85c');
                        setTimeout(function(){
                            $('#ctu').removeClass('hide');
                        }, 200);
                        var nll = GVar.ll;
                        if (nll == 0) {
                            ManageAuth(position);
                            GVar.lndinglat = position.coords.latitude;
                            GVar.lndinglng = position.coords.longitude;
                            GVar.got_loc = 1;
                        }
                        GVar.l = 0;

                    };
                    function onError(error) {
                        GVar.ll=0;
                        GVar.l = 9;
                        $('#lw4').removeClass('hide');
                        autogpson();
                    }
                    navigator.geolocation.getCurrentPosition(onSuccess, onError);
                  },
                  function fail(){
                    GVar.ll=0;
                    GVar.l = 9;
                    $('#lw4').removeClass('hide');
                    autogpson();
                  });
            }
        }, 2000);
    }, 1000);
}
function ManageAuth(position){
    if (typeof(Storage) !== "undefined") {
        var auth_token = localStorage.getItem("auth_token");
        if (!$.isBlank(auth_token)) {
            CheckToken(auth_token,position);
        } else {
            $('#ctu').css('color','#f0ad4e');
            setTimeout(function(){
                $('#lw4').addClass('hide');
                ViewCurrentLoc(position);
            }, 1000);
            GVar.auth=0;
            SetStatusBtn();
        }
    } else {
        $('#ctu').css('color','#f0ad4e');
        setTimeout(function(){
            $('#lw4').addClass('hide');
            ViewCurrentLoc(position);
        }, 1000);
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
function ViewCurrentLoc(position){
    GVar.ll=1;
    LandingUpdate(position.coords.latitude,position.coords.longitude);
    qkpmUpdate(position.coords.latitude,position.coords.longitude);
}
function CheckToken(a_t,position){
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
            $('#ctu').css('color','#5cb85c');
            SetStatusBtn();
            setTimeout(function(){
                $('#lw4').addClass('hide');
                ViewCurrentLoc(position);
            }, 1000);
            get_profile_info();
        },
        error: function (xhr, ajaxOptions, thrownError) {

            $('#ctu').css('color','#5cb85c');
            setTimeout(function(){
                $('#lw4').addClass('hide');
                ViewCurrentLoc(position);
            }, 1000);
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
    tpr('#_rt','#_pr','#_drp');

    var fruits = ('Bar & Pub,Car Dealership,Coffee Shop,Entertainment,Food,Gas Station,Hotel,Medical Center,Movie Theater,Nightlife Spot,Outdoors & Recreation,Parking,Pharmacy,Real Estate,Supermarket,Taxi,Transport,Travel Agency,Cosmetic,Pet-Shop,Event,Mall,Institution,Sightseeing,Subway-Station,Government,Museum,Temple,Church,Kids,Beach,Nail-Shop,Convenient-Store,Health-Center,Acupuncture').split(',');
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
                case 'Cosmetic':
                    GVar.curcat = 19;
                break;
                case 'Pet-Shop':
                    GVar.curcat = 20;
                break;
                case 'Event':
                    GVar.curcat = 21;
                break;
                case 'Mall':
                    GVar.curcat = 22;
                break;
                case 'Institution':
                    GVar.curcat = 23;
                break;
                case 'Sightseeing':
                    GVar.curcat = 24;
                break;
                case 'Subway-Station':
                    GVar.curcat = 25;
                break;
                case 'Government':
                    GVar.curcat = 26;
                break;
                case 'Museum':
                    GVar.curcat = 27;
                break;
                case 'Temple':
                    GVar.curcat = 28;
                break;
                case 'Church':
                    GVar.curcat = 39;
                break;
                case 'Kids':
                    GVar.curcat = 30;
                break;
                case 'Beach':
                    GVar.curcat = 31;
                break;
                case 'Nail-Shop':
                    GVar.curcat = 32;
                break;
                case 'Convenient-Store':
                    GVar.curcat = 33;
                break;
                case 'Health-Center':
                    GVar.curcat = 34;
                break;
                case 'Acupuncture':
                    GVar.curcat = 35;
                break;
                default:
                    alert('Somthing Went Wrong!');
            }
        }
    });
var cats = ('Bar & Pub,Car Dealership,Coffee Shop,Entertainment,Food,Gas Station,Hotel,Medical Center,Movie Theater,Nightlife Spot,Outdoors & Recreation,Parking,Pharmacy,Real Estate,Supermarket,Taxi,Transport,Travel Agency,Cosmetic,Pet-Shop,Event,Mall,Institution,Sightseeing,Subway-Station,Government,Museum,Temple,Church,Kids,Beach,Nail-Shop,Convenient-Store,Health-Center,Acupuncture').split(',');
var autocompleteDropdownExpand = myApp.autocomplete({
    input: '#csb',
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
        for (var i = 0; i < cats.length; i++) {
            if (cats[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(cats[i]);
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
            case 'Cosmetic':
                GVar.curcat = 19;
            break;
            case 'Pet-Shop':
                GVar.curcat = 20;
            break;
            case 'Event':
                GVar.curcat = 21;
            break;
            case 'Mall':
                GVar.curcat = 22;
            break;
            case 'Institution':
                GVar.curcat = 23;
            break;
            case 'Sightseeing':
                GVar.curcat = 24;
            break;
            case 'Subway-Station':
                GVar.curcat = 25;
            break;
            case 'Government':
                GVar.curcat = 26;
            break;
            case 'Museum':
                GVar.curcat = 27;
            break;
            case 'Temple':
                GVar.curcat = 28;
            break;
            case 'Church':
                GVar.curcat = 39;
            break;
            case 'Kids':
                GVar.curcat = 30;
            break;
            case 'Beach':
                GVar.curcat = 31;
            break;
            case 'Nail-Shop':
                GVar.curcat = 32;
            break;
            case 'Convenient-Store':
                GVar.curcat = 33;
            break;
            case 'Health-Center':
                GVar.curcat = 34;
            break;
            case 'Acupuncture':
                GVar.curcat = 35;
            break;
            default:
                alert('Somthing Went Wrong!');
            }
            setTimeout(function(){
                myApp.closePanel('left');
            }, 100);
            setTimeout(function(){
                if (GVar.vaf==0) {
                    VAOM(GVar.lndinglat,GVar.lndinglng,GVar.curcat,GVar.drad);
                }
                GVar.vaf = 1;
            }, 500);
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
    $(document).on('touchstart','.addPicture',function(){
        $imagesDiv = $(document).find("#images");
        var imcount = $(document).find('.uimg').length;
        window.mxupld = 10 - imcount;
        window.imagePicker.getPictures(
            function(results) {
                if (results.length!=0) {
                    $(document).find('#qk-post-btn').attr('disabled','1');
                    $(document).find('#_upp').removeClass('hide');
                }
                GVar.icont = GVar.icont + results.length;
                for (var i = 0; i < results.length; i++) {
                    var auth_token = localStorage.getItem("auth_token");
                    if (!$.isBlank(auth_token)) {
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
                                $(document).find(".addPicture").attr('disabled','disabled');
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
                                $(document).find('#qk-post-btn').removeAttr('disabled');
                            }

                        }, function(error){
                            alert('E122. Error.');
                            $(document).find('#_upp').addClass('hide');
                            GVar.icont = GVar.icont - 1;
                            if (GVar.icont==0) {
                                $(document).find('#_upp').addClass('hide');
                            }
                            $(document).find('#qk-post-btn').removeAttr('disabled');
                            $(document).find('#qppl').addClass('hide');
                            console.log(JSON.stringify(error));
                        }, options);

                    } else {
                        $(document).find('#qk-post-btn').removeAttr('disabled');
                        alert('Please Try to Login Again.')
                    }

                    GVar.imgcounter = 0;
                }

            }, function (error) {
                $(document).find('#qk-post-btn').removeAttr('disabled');
                console.log('Error: ' + error);
            }, {
                maximumImagesCount: mxupld,
                quality:50
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
    $("#lma").on('touchstart', function() {
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
function Events() {

    $("#p7c").swipe( {
    swipeStatus:function(event, ph, di, d, duration, fingers, fingerData, currentDirection)
    {
        var p = $('#p7c').scrollTop();
        if (p == 0) {
            if (di=='down') {
                var pt = $('.ptrwrap');
                if (d<300){
                    if (pt.hasClass('hide')) {
                        pt.removeClass('hide');
                    }
                    var t = (d/300).toFixed(2);
                    var c = pt.css('opacity');
                    if (t<=1&&t>c) {
                        pt.css('opacity',t); 
                    }
                }
                if (ph=="cancel"){
                    pt.css('opacity',0);
                    pt.addClass('hide');
                }
                if (ph=="end"){
                    if (d>=300){
                        AllAdsReload();
                        pt.css('opacity',1);
                    }
                    setTimeout(function(){
                        pt.css('opacity',0);  
                        pt.addClass('hide');
                    }, 2000);
                }
            }
        }
    },
        threshold:300,
        maxTimeThreshold:5000,
        fingers:'all', 
        allowPageScroll:"auto"
    });

    $("#v6pc").swipe( {
    swipeStatus:function(event, ph, di, d, duration, fingers, fingerData, currentDirection)
    {
        var p = $('#v6pc').scrollTop();
        if (p == 0) {
            if (di=='down') {
                var pt = $('.ptrwrapa');
                if (d<300){
                    if (pt.hasClass('hide')) {
                        pt.removeClass('hide');
                    }
                    var t = (d/300).toFixed(2);
                    var c = pt.css('opacity');
                    if (t<=1&&t>c) {
                        pt.css('opacity',t); 
                    }
                }
                if (ph=="cancel"){
                    pt.css('opacity',0);
                    pt.addClass('hide');
                }
                if (ph=="end"){
                    if (d>=300){
                        AllAdsReload();
                        pt.css('opacity',1);
                    }
                    setTimeout(function(){
                        pt.css('opacity',0);  
                        pt.addClass('hide');
                    }, 2000);
                }
            }
        }
    },
        threshold:300,
        maxTimeThreshold:5000,
        fingers:'all', 
        allowPageScroll:"auto"
    });

    $('.tab-link').on('touchstart', function() {
        $('.tab-link').removeClass('active');
        $(this).addClass('active');
    });

    // document.addEventListener("backbutton", onBackKeyDown, false);
    $('#qkpost-modal').on('hidden.bs.modal', function () {
        clear_qp_modal();
    });

    $(".fbloginbtn").on('touchstart', function(e) {
        facebookConnectPlugin.login(["email"], function(response) {
        if (response.authResponse) {
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

    $("#change-pro-img").on('touchstart', function(e) {

        window.imagePicker.getPictures(
            function(results) {
                for (var i = 0; i < results.length; i++) {
                    var auth_token = localStorage.getItem("auth_token");
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
                    ft.upload(imageURI, GVar.ajax_url+"/api/upload-profile-image", function(data){
                        var result = data['response'];
                        var parsed_result = JSON.parse(result);
                        var new_path = parsed_result['newpath'];
                        $('#user_image_dash').css("background-image", "url("+new_path+")"); 
                    }, function(error){
                        alert('E122. Error.');
                        console.log(JSON.stringify(error));
                    }, options);
                }

            }, function (error) {
                console.log('Error: ' + error);
            }, {
                maximumImagesCount: 1,
                quality:50
            }
        );

    });


    $(document).on('touchstart','#can_post',function(){
        CancelPost();
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
                    $(this).attr('revstar','999');
                    setTimeout(function(){
                        $('.sendcomment textarea').attr('placeholder','Write a Review');
                    }, 2000);
                }
            } else {
                GVar.lgns_f = 1;
                GVar.lgns_d = '.rvcom';
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

    $(document).on('touchstart','#dtl',function(){
        OpenGeoApps();
    });
    $(document).on('touchstart','.posdelete',function(){
        GVar.post_tobe_deleted = $(this).attr('this-id');
    });
    $(document).on('touchstart click','._vaprofile',function(){
        GVar.profile_tobe_viewd = $(this).attr('this-id');
    });
    $(document).on('touchstart click','#view-user-profile',function(){
        myApp.closeModal('.popover-viewprofile',1);
        ViewThisProfile(GVar.profile_tobe_viewd);
    });
    $(document).on('touchstart','#delete-post-f',function(){
        myApp.closeModal('.popover-delete',1);
        $('#confirm-delete').modal('show');
    });
    $(document).on('touchstart','#delete-post-ok',function(){
        $('#confirm-delete').modal('hide');
        DeleteProfilePostById(GVar.post_tobe_deleted);
    });

    $("#_rc").on('touchstart', function(e) {
        e.preventDefault();
        $(this).addClass('hide');
        LandingClearMarker();
    });

    $("#load-dash-ads").on('click', function(e) {
        e.preventDefault();
        ShowDashboardAdsLoadMore();
    });
    $("#load-profile-ads").on('click', function(e) {
        e.preventDefault();
        ViewThisProfileLoadMore();
    });

    $("#gobtn").on('touchstart', function(e) {
        // myApp.closePanel();
        var tiv = $('#hashtagsearch').val();
        if (!$.isBlank(tiv)) {
            var dv = parseInt(GVar.drad);
            if (!$.isBlank(dv) && dv!=0) {
                GVar.drad=dv;
            } else {
                GVar.drad=15;
            }
            setTimeout(function(){
                myApp.closePanel('left');
            }, 100);
            setTimeout(function(){
                if (GVar.vaf==0) {
                    VAOM(GVar.lndinglat,GVar.lndinglng,tiv,GVar.drad);
                }
                GVar.vaf = 1;
            }, 500);
        }

    });


    $( "#hashtagsearch" ).focus(function() {
        $(this).val() == '' ? $(this).val('#') : null ;
    });    

    $( "#hashtagsearch" ).blur(function() {
        $(this).val() == '#' ? $(this).val('') : null ;
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

    $('#vw1').on('touchstart', function() {
        setTimeout(function(){
            ResetLandingAndReasin();
        }, 500);
        setTimeout(function(){
            _ctpral();
        }, 100);
        GVar.curpg=1;
        myApp.showTab('#view-1');
    });
    $("#vw7").on('touchstart', function() {
        var _auth = parseInt($('#_auth').attr('data'));
        if (_auth == 1) {
            if (GVar.dash_loaded == 0) {
                GVar.dash_loaded = 1;
                ShowDashboardAds();
                setTimeout(function(){
                    get_profile_info();
                }, 100);
            }
            GVar.curpg=7;
            myApp.showTab('#view-7');
        } else {
            GVar.lgns_f = 1;
            GVar.lgns_d = '#vw7';
            $('#login-modal').modal('show');
        }
    });



    $('#vw4').on('touchstart', function() {
        GVar.curpg=4;
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

    $('#lform').submit(function(e){
        e.preventDefault();
        var reg_form = $('#lform').serialize();
        app_login(reg_form);
    });
    $(document).on('touchstart','.logout-btn',function(){
        $('#logout-modal').modal('show');
    });

    $(document).on('touchstart','#reg-btn',function(){
        $('#login-modal').modal('hide');
        $('#register-modal').modal('show');
    });
    $(document).on('touchstart','.m-vad',function(){
        var this_id = $(this).attr('data');
        $('#atwl-btn').attr('data',this_id);
        $('.fbc').html('');
        findAndViewAd(this_id);
    });
    $("#qbtn-wrap").on('touchstart', function(e) {
        var _auth = parseInt($('#_auth').attr('data'));
        if (_auth == 1) {
            myApp.showTab('#view-2');
            GVar.qkpost_map = 1;
            var center = postmap.getCenter();
            google.maps.event.trigger(postmap, "resize");
            postmap.setCenter(center);
        } else {
            GVar.lgns_f = 1;
            GVar.lgns_d = '#qbtn-wrap';
            $('#login-modal').modal('show');
        }
    });
    $(document).on('touchstart','.remove-ad-wl',function(){
        $t_id = $(this).attr('data');
        $('.modal-remove-btn').attr('data',$t_id);
        $('#warning-modal').modal('show');
    });

    $('.modal-remove-btn').on('touchstart', function() {
        $('#warning-modal').modal('hide');
        $t_id = $(this).attr('data');
        removeWishList($t_id);
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
        var nrx = parseFloat($('#rorp').val());
        var nr = $('#rorp').val().replace(/[^0-9.]/g, '');
        $('#rorp').val(nr);
        var flag = 0;
        if (isBlank(nr)) {
           alert('Radius cannot be zero or null');
           flag = 1;
        }
        else if (nr==0) {
            alert('Radius cannot be zero or null');
            flag = 1;
        }
        else if (nr>1000) {
            alert('Radius must be between 1 to 1000');
            flag = 1;
        }
        else if (flag==0) {
            GVar.drad = nr;
            myApp.closePanel('right');
        }
    });
    $('#submit-btn').on('touchstart', function() {
        var reg_form = $('#reg-form').serialize();
        form_validate(reg_form);
    });
    $(document).on('touchstart','#qk-post-btn',function(e){
        e.preventDefault();
        if ($(document).find('.uimg').length < 1) {
            alert('You must upload at least one image');
        } else {
            var _form = $('#pkpost-form').serialize();
            process_qkpost(_form,document.getElementById("cats").value);    
        }
    });
}
function tpr(did,pid,ndid){
    jQuery(document).on('focus click', did,  function(e){
        myApp.pickerModal(pid);
    });
    $$(pid).on('picker:opened', function () {
        $(ndid).focus();
    }).on('picker:close', function () {
        $(document).find(did).val($(document).find(ndid).val());
        $('#lw5').addClass('hide');
    }).on('picker:open', function () {
        $('#lw5').removeClass('hide');
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
            _ctpr();
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
                BeforeSession();
                setTimeout(function(){
                    // RefreshDashboardAds();
                }, 200);
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
                BeforeSession();
                setTimeout(function(){
                    // RefreshDashboardAds();
                }, 200);
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
                    var drd = GVar.drad;
                    var zoomnum = RadiusToZoom(drd);
                    var nz = zoomnum;
                    LandingMap.setCenter(olatlng);
                    LandingMap.setZoom(nz);
                    GVar.lzs = nz;
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
                                            '<p><span class="_atitl">'+va['title']+'</span>&nbsp;<span class="label label-success">'+va['dis']+'</span></p>'+
                                            '<p><span class="_ades">'+va['des']+'</p>'+
                                            '<p class="m-vad" data="'+va['id']+'">View Ad <i class="fa fa-angle-right" aria-hidden="true"></i></p>'+
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
                                            marker.addListener('mousedown', function() {
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
                        window.plugins.toast.showLongBottom("We couldn't find any results. Maybe you can try broaden search radius.");
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
    var nz =  GVar.lzs;
    var drd = GVar.drad;
    $('#fpmap').html('');
    $('#fpmap').css('height',($(window).height()-20));
    $(window).resize(function() {
        $('#fpmap').css('height',($(window).height()-20));
    });
    var myLatLng = {lat: lat, lng: lng};
    window.LandingMap = new google.maps.Map(document.getElementById('fpmap'), {
        center: myLatLng,
        zoom: nz,
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
        $('#_rc').removeClass('hide');
        var marker = new google.maps.Marker({
            position: location,
            map: LandingMap,
            draggable: true,
        });
        GVar.lndinglat = marker.getPosition().lat();
        GVar.lndinglng = marker.getPosition().lng();
        GVar.lmarkers.push(marker);
        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
            strokeColor: '#007aff',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#a0ccfb',
            fillOpacity: 0.15,
            map: LandingMap,
            center: location,
            radius: GVar.drad*1000
        });
        GVar.lcircle.push(cityCircle);

        google.maps.event.addListener(marker, 'dragend', function (event) {
            ClearCircles();
            GVar.lndinglat = this.getPosition().lat();
            GVar.lndinglng = this.getPosition().lng();
            var latlng = {lat: this.getPosition().lat(), lng: this.getPosition().lng()};
            var cityCircle = new google.maps.Circle({
                strokeColor: '#007aff',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: '#a0ccfb',
                fillOpacity: 0.15,
                map: LandingMap,
                center: latlng,
                radius: GVar.drad*1000
            });
            GVar.lcircle.push(cityCircle);
        });
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
                              draggable: false,
                              title: va['title']
                            });
                            marker.addListener('mousedown', function() {
                              infowindow.open(LandingMap, marker);
                            });
                            GVar.admkrs.push(marker);
                            GVar.lmarkerinfo.push(infowindow);
                        }
                }
            });
        }
    }
    GetGPSLocationNoZoom();
}

function vwad(data_id) {
    $('#lwgen').removeClass('hide');
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
                $("#view-5-cont").animate({"scrollTop": "0px"}, 10);

                myApp.showTab('#view-5');
                //init
                GVar.curadlat = ad_array['lat'];
                GVar.curadlng = ad_array['lng'];
                GVar.currentpost = data_id;
                var btnhtml = '';
                var lestgo = "Let's Go!";
                btnhtml = '<div class="btn-group-vertical" style="width: 100%;">'+
                      '<a id="dtl" href="#" class="btn btn-success btn-md"><strong>'+lestgo+'</strong></a>'+
                      '<a id="gshare" href="#" class="btn btn-primary btn-md">Share</a>'+
                      '</div>';
                document.getElementById('dbtn2').innerHTML = btnhtml;
                document.getElementById('postview-data').innerHTML = '';
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
                "<div class='form-group break_all hide' id='plo'><img width='200px' src='gif/ajax-loader4.gif'></div>"+
                "<div class='my-container' id='pi'></div>";
                document.getElementById('postview-data').innerHTML = new_html;
                document.getElementById('pt').innerHTML = ad_array['title'];
                document.getElementById('pd').innerHTML = ad_array['des'];
                var linksContainer = $('#pi');
                var title = ad_array['title_txt'];
                // Add the demo images as links with thumbnails to the page:
                var _con = 0;
                var _f = 1;
                var allimgs = '';
                var _images = [];
                $.each(photos, function (index, photo) {
                    _images.push(photo.src);
                });
                var _imlen = _images.length;

                $('#pi').imagesGrid({
                    images: _images,
                    align: true,
                    nextOnClick: 0,
                    cells: 5,
                    getViewAllText: function(imgsCount) { return 'View all' }
                });

                //REFRESH MAP
                ViewPostMapRefreshAndSet(ad_array['lat'],ad_array['lng']);
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
                //RENDER REVIEWS
                setTimeout(function(){
                    $('#pv').css('opacity','1');
                }, 500);
                $('#lwgen').addClass('hide');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText); // <- same here, your own div, p, span, whatever you wish to use
        }
    });
}
function process_qkpost(_form,cat_id) {
    $('#lwgen').removeClass('hide');
    $('._required').css('color','inherit');
    $('#lwposting').removeClass('hide');

    var data ={"_form":_form,"tkn":localStorage.getItem("auth_token")}

    $.ajax({
        url: GVar.ajax_url+'/api/process-qkpost',
        type: 'post',
        dataType: 'json',
        'data': data,
        success: function(data) {
            $('#lwposting').addClass('hide');
            var status = data.status;
            switch(status){
                case 200:
                    ResetView2();
                    window.plugins.toast.showLongBottom('Successfully Posted! Continue Exploring BLIK');
                    setTimeout(function(){
                        myApp.showTab('#view-1');
                    }, 200);
                    setTimeout(function(){
                        ResetLandingAndReasin();
                        _ctpd();
                    }, 300);
                break;

                case 400:
                    alert('please fill the required fields')
                    $('._required').css('color','red');
                break;
            }
            $('#lwgen').addClass('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#lwposting').addClass('hide');
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
    $(document).find('.uimg').remove();
    $('#v2pc').html('<form class="" id="pkpost-form" style="float: left;width: 100%;"> <div class="list-block" id="lbx" style="margin-top: 0;"> <ul> <li class="align-top"> <div class="item-content" style="padding: 0"> <div class="item-inner"> <div class="item-input"> <input style="padding-left: 15px;" type="text" name="title" id="_qt" placeholder="Title"> </div></div></div></li><li class="align-top"> <div class="item-content" style="padding: 0"> <div class="item-inner"> <div class="item-input"> <textarea style="padding-left: 15px;" name="description" placeholder="Type your description here, you can use hashtags #example #restaurant #foodmarket" id="desqp"></textarea> </div></div></div></li><li> <a href="#" data-searchbar="true" data-searchbar-placeholder="Search Category" class="item-link smart-select" data-back-on-select="true"> <select name="cat" class="form-control qp-selects" id="cats"> <option value="1">Bar & Pub</option> <option value="2">Car Dealership</option> <option value="3">Coffee Shop</option> <option value="4">Entertainment</option> <option value="5">Food</option> <option value="6">Gas Station</option> <option value="29">Church</option> <option value="7">Hotel</option> <option value="8">Medical Center</option> <option value="9">Movie Theater</option> <option value="10">Nightlife Spot</option> <option value="23">Institution</option> <option value="11">Outdoors & Recreation</option> <option value="12">Parking</option> <option value="13">Pharmacy</option> <option value="14">Real Estate</option> <option value="28">Temple</option> <option value="15">Supermarket</option> <option value="16">Taxi</option> <option value="17">Transport</option> <option value="18">Travel Agency</option> <option value="19">Cosmetic</option> <option value="20">Pet-Shop</option> <option value="27">Museum</option> <option value="21">Event</option> <option value="22">Mall</option> <option value="24">Sightseeing</option> <option value="25">Subway-Station</option> <option value="26">Government</option> <option value="30">Kids</option> <option value="31">Beach</option> <option value="32">Nail-Shop</option> <option value="33">Convenient-Store</option> <option value="34">Health-Center</option> <option value="35">Acupuncture</option> </select> <div class="item-content"> <div class="item-inner"> <div class="item-title">Category</div><div class="item-after">Select</div></div></div></a> </li><li> <a href="#" data-searchbar="true" data-searchbar-placeholder="" class="item-link addPicture" data-back-on-select="true"> <div class="item-content"> <div class="item-inner"> <div class="item-title">Photos</div><div class="item-after">Browse</div></div></div></a> </li></ul> </div><div class="" style="float: left;width: 100%"> <div id="_upp" class="hide"> <p> Uploading... ( <span id="pco"></span> %) </p></div><div style="float: left;width: 100%;padding: 10px" id="images"> </div></div><div class="form-group" style="float:left;width: 100%;"> <input type="hidden" id="qkp-lat" name="lat"/> <input type="hidden" id="qkp-lng" name="long"/> <div id="qkpost-map-container" style="width:80%;margin:0 auto"> <div style="height:300px" id="postmap"></div></div></div><div id="file-div"></div></form> <div class="" style="float: right;width: 100%"> <div class="btn-group btn-block" style="width: 100%"> <a style="width: 50%" href="#" id="can_post" class="btn btn-danger">Cancel</a> <a style="width: 50%" href="#" id="qk-post-btn" class="btn btn-success">Post</a> </div></div>');
    setTimeout(function(){
        PostAdInit();
    }, 300);
}
function reg_submit(reg_form) {
    var data ={"reg_form":reg_form}
    $.ajax({
        url: GVar.ajax_url+'/api/users/register',
        type: 'post',
        dataType: 'json',
        'data': data,
        success: function(data) {
            var status = data.status;
            if (status==200) {
                localStorage.setItem("auth_token", data.tkn);
                GVar.auth=1;
                get_profile_info();
                $('#_auth').attr('data','1');
                $('#user-status').attr('value','1');
                $('#lginlbl').text('Logout');
                $('#register-modal').modal('hide');
            }
        }
    });
}
function get_profile_info() {
    var data ={"tkn":localStorage.getItem("auth_token")}
    $.ajax({
        url: GVar.ajax_url+'/api/get-profile-info',
        type: 'post',
        dataType: 'json',
        'data': data,
        success: function(data) {
            var status = data.status;
            if (status==200) {
                GVar.obfuscate_email=data.obf_email;
                GVar.cur_user_no_posts=data.num_posts;
                GVar.cur_user_img=data.user_avatar;
                SetupProfileDetails();
            }
        }
    });
}
function DeleteProfilePostById(ad_id) {
    var data ={"tkn":localStorage.getItem("auth_token"),"ad_id":ad_id}
    $.ajax({
        url: GVar.ajax_url+'/api/delete-post',
        type: 'post',
        dataType: 'json',
        'data': data,
        success: function(data) {
            var status = data.status;
            GVar.post_tobe_deleted = 0;
            if (status==200) {
                GVar.cur_user_no_posts=data.num_posts;
                ShowDashboardAds();
                SetupProfileDetails();
            } else {
                alert('Error '+status);
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

    $(".addPicture").removeAttr('disabled');

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
    var myLatLng = {lat: GVar.lndinglat, lng: GVar.lndinglng};
    document.getElementById('qkp-lat').value = myLatLng.lat;
    document.getElementById('qkp-lng').value = myLatLng.lng;
    window.postmap = new google.maps.Map(document.getElementById('postmap'), {
        center: myLatLng,
        zoom: 6,
        gestureHandling: 'cooperative',
        mapTypeControl: false,
        streetViewControl: false,
        disableDefaultUI: true,
        mapTypeId: 'roadmap'
    });

    google.maps.event.addListener(postmap, 'click', function(event) {
        qkpmClearMarker();
        placeMarkerpm(event.latLng);
    });
    //MARKER
    window.PostAdMarker = new google.maps.Marker({
      map: postmap,
      position:myLatLng,
      icon:GVar.flag_image,
      draggable: true,
      anchorPoint: new google.maps.Point(0, -29)
    });
    GVar.pmmarkers.push(PostAdMarker);
    function placeMarkerpm(location) {
        PostMapClearMarker();
        var marker = new google.maps.Marker({
            position: location,
            map: postmap,
            icon:GVar.flag_image,
            draggable: true,
            anchorPoint: new google.maps.Point(0, -29)
        });
        document.getElementById('qkp-lat').value = marker.getPosition().lat();
        document.getElementById('qkp-lng').value = marker.getPosition().lng();
        GVar.pmmarkers.push(marker);
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
    var htmlinput = '<input id="pac-input" class="controls" type="text" placeholder="Search Address">';
    $('#qkpost-map-container').append(htmlinput);

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
        qkpmClearMarker();
        PostMapClearMarker();
        //MARKER
        window.PostAdMarker2 = new google.maps.Marker({
          map: postmap,
          icon:GVar.flag_image,
          position: place.geometry.location,
          draggable: true
        });
        GVar.pmmarkers.push(PostAdMarker2);
        google.maps.event.addListener(PostAdMarker2, 'dragend', function (event) {
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
    PostMapClearMarker();
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
    //AFTER DRAG AND DROP SHOWS THE LAT AND LONG
    google.maps.event.addListener(marker, 'dragend', function (event) {
        document.getElementById('qkp-lat').value = this.getPosition().lat();
        document.getElementById('qkp-lng').value = this.getPosition().lng();
    });
    GVar.qpmarkers.push(marker);
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
        $('#_rc').removeClass('hide');
        var marker = new google.maps.Marker({
            position: location,
            map: LandingMap,
            draggable: true,
        });
        GVar.lndinglat = marker.getPosition().lat();
        GVar.lndinglng = marker.getPosition().lng();
        GVar.lmarkers.push(marker);
        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
            strokeColor: '#007aff',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#a0ccfb',
            fillOpacity: 0.15,
            map: LandingMap,
            center: location,
            radius: GVar.drad*1000
        });
        GVar.lcircle.push(cityCircle);

        google.maps.event.addListener(marker, 'dragend', function (event) {
            ClearCircles();
            GVar.lndinglat = this.getPosition().lat();
            GVar.lndinglng = this.getPosition().lng();
            var latlng = {lat: this.getPosition().lat(), lng: this.getPosition().lng()};
            var cityCircle = new google.maps.Circle({
                strokeColor: '#007aff',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: '#a0ccfb',
                fillOpacity: 0.15,
                map: LandingMap,
                center: latlng,
                radius: GVar.drad*1000
            });
            GVar.lcircle.push(cityCircle);
        });
    }
    //MARKER
    var infowindow = new google.maps.InfoWindow();
}
function LandingUpdate(lat,lng) {
    var tz = 15;
    GVar.lzs = tz;
    LandingClearMarker();
    var myLatLng = {lat: lat, lng: lng};
    GVar.lndinglat = lat;
    GVar.lndinglng = lng;
    LandingMap.setCenter(myLatLng);
    LandingMap.setZoom(tz);
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
function SetupProfileDetails(){
    $('#prof_obf_email').text(GVar.obfuscate_email);
    $('#prof_num_posts').text(GVar.cur_user_no_posts);
    $('#user_image_dash').css("background-image", "url("+GVar.baseurl+GVar.cur_user_img+")"); 
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
function ViewAdInit(lat,lng) {
    var myLatLng = {lat: lat, lng: lng};
    window.PostViewMap = new google.maps.Map(document.getElementById('map-post-view'), {
        center: myLatLng,
        zoom: 15,
        mapTypeControl: true,
        gestureHandling: 'cooperative',
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
    GVar.viewaddmarker.push(marker);
}
function ViewPostMapRefreshAndSet(lat,lng) {
    ViewMapClearMarker();
    setTimeout(function(){
        google.maps.event.trigger(PostViewMap, "resize");
        ViewAdUpdate(lat,lng);
     }, 200);
}
function ViewAdUpdate(lat,lng) {
    var latpf = parseFloat(lat);
    var lngpf = parseFloat(lng);
    var myLatLng = {lat: latpf, lng: lngpf};
    PostViewMap.setCenter(myLatLng);
    var marker = new google.maps.Marker({
      map: PostViewMap,
      icon:GVar.flag_image,
      position:myLatLng,
      draggable: false,
      anchorPoint: new google.maps.Point(0, -29)
    });
    GVar.viewaddmarker.push(marker);
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
function qkpmClearMarker() {
    for (var i = 0; i < GVar.qpmarkers.length; i++) {
      GVar.qpmarkers[i].setMap(null);
    }
}
function ViewMapClearMarker() {
    for (var i = 0; i < GVar.viewaddmarker.length; i++) {
      GVar.viewaddmarker[i].setMap(null);
    }
}

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
                      ["Cancel","Later","Go"]
                    );//buttons
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
function OpenGeoApps(){
    var lat = parseFloat(GVar.curadlat);
    var lng = parseFloat(GVar.curadlng);
    launchnavigator.navigate([lat, lng]);
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
function ClearCircles(){
    for (var j = 0; j < GVar.lcircle.length; j++) {
      GVar.lcircle[j].setMap(null);
    }
}
window.lastTimeBackPress=0;
window.timePeriodToExit=2000;
function onBackKeyDown(e) {
    e.preventDefault();
    e.stopPropagation();
    if(new Date().getTime() - lastTimeBackPress < timePeriodToExit){
        navigator.app.exitApp();
    }else{
        window.plugins.toast.showLongBottom('Press back again to leave');
        // window.timeout = setTimeout(function () { myApp.closeNotification(".notification-item"); }, 2000);
        lastTimeBackPress=new Date().getTime();
    }
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
function RadiusToZoom(rad){
    var radius = rad*0.62137;
    var zm = Math.round(14-Math.log(radius)/Math.LN2);
    return zm;
}
function _ctpral(){
    $("#_drp").val('');
    $("#_dp").val('');
}
function _ctpr(){
    $("#_drp").val('');
}
function _ctpd(){
    $("#_dp").val('');
}

function loadimage(imgsrc, change){
  var loadimage = new Image();
  loadimage.onload = changesrc(imgsrc, change);
  loadimage.src = imgsrc;
}

function changesrc(imgsrc, change) {
  change.src=imgsrc;
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function BeforeSession(){
    if (GVar.lgns_f == 1) {
        GVar.lgns_f = 0;
        setTimeout(function(){
            $(GVar.lgns_d).trigger('touchstart');
        }, 300);
        
    }
}
function CancelPost(){
    window.plugins.toast.showLongBottom('Post Canceled!');
    setTimeout(function(){
        myApp.showTab('#view-1');
        ResetView2();
    }, 100);
    setTimeout(function(){
        ResetLandingAndReasin();
        _ctpd();

    }, 300);
}
