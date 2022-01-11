let inVehicle = false
let phoneOpen = false
let updatedCashCount = 0

window.addEventListener('message', (event) => {
    if (event.data.type == "hudmenu" ){
        $(".hud-menu-container").css("display", "flex");
    } else if (event.data.type == "salty") {
        const state = event.data.state
        const element = $(".salty-error")
        if (state == 2) {
            element.fadeOut()
        } else if (state == -1 ) {
            element.fadeIn()
            element.html("TS3 Kapalı Lütfen TS3'ü Açınız!")
        } else if (state == 0) { 
            element.fadeIn()
            element.html("TS3 Sunucumuza Bağlı Değilsiniz Lütfen TS3 Sunucumuza Bağlanınız!")
        } else {
            element.fadeIn()
            element.html("Lütfen TS3'ü Yeniden Başlatınız!")
        }
    } else if (event.data.type == "phone") {
        //$('.voice').attr("style", "");
        phoneOpen = event.data.phoneOpen
        if (phoneOpen) {
            $(".voice").animate({
                bottom: "92%"
            }, 500);
        }

        if (inVehicle) {
            if (phoneOpen) {
                $(".car-hud").fadeOut()
            } else {
                $(".car-hud").fadeIn()
                $(".voice").animate({
                    right: "40px",
                    bottom: "235px"
                }, 500);
            }
        } else {
            if (!phoneOpen) {
                $(".voice").animate({
                    bottom: "2%"
                }, 500);
            }
        }
    } else if (event.data.type == "ui") {
        if (event.data.show) {
            $(".container").fadeIn();
            if (inVehicle && !phoneOpen) {
                $(".voice").animate({
                    bottom: "235px"
                }, 500);
            }
        } else {
            $(".container").fadeOut();
            if (inVehicle && !phoneOpen) {
                $(".voice").animate({
                    bottom: "2%"
                }, 500);
            }
        }
    } else if (event.data.type == 'updateStatus') {
        
        for(let prop in event.data.data){
            var val = event.data.data[prop]
            $("#"+prop).css("width", val+"%")
            if (prop == "yemek" || prop == "su" ) {
                $("#car-"+prop).css("width", val+"%")
            }
        }
    } else if (event.data.type == 'tick') {
        $("#heal").css("width", event.data.heal+"%")
        $("#zirh").css("width", event.data.zirh+"%")
        if (!inVehicle) {
            let oxyVal = event.data.oxy * 2.5
            if (oxyVal > 100 ) { oxyVal = 100 }
            if (oxyVal < 100) {
                $("#oxy").css("width", oxyVal+"%")
                $("#stamina-bar").fadeOut()
                $("#oxy-bar").fadeIn()
            } else {
                $("#stamina").css("width", event.data.stamina+"%")
                $("#stamina-bar").fadeIn()
                $("#oxy-bar").fadeOut()
            }    
        }
        
    } else if (event.data.type == "carHud") {
        $(".street-text-text").html(event.data.street)
        $(".street-text-compass").html(event.data.compass)
        $(".status-hud-clock-text").html(event.data.time)
        $(".fuel-bar-inside").css("width", event.data.fuel+"%")
        carHudMiniIconOnOff("doors", event.data.doors)
        carHudMiniIconOnOff("engine", event.data.engine)
        carHudMiniIconOnOff("light", event.data.light)
        carHudMiniIconOnOff("belt", event.data.belt)
        carHudMiniIconOnOff("trunk", event.data.trunk)
        carHudMiniIconOnOff("cruise", event.data.cruise)
        if (event.data.seatbeltmod) {
            $("#beltColor path").css("fill", "orange")
        } else {
            $("#beltColor path").css("fill", "white")
        }
        if (event.data.engineHealth < 500) {
            $("#engineColor path").css("fill", "orange")
        } else {
            $("#engineColor path").css("fill", "white")
        }
    } else if (event.data.type == "vehSpeed") {
        $(".kmh-number").html(event.data.speed)
        $(".strela").css("transform", "rotate("+event.data.speed+"deg)")
    } else if (event.data.type == "inVeh") {
        if (event.data.data) {
            inVehicle = true
            $(".mapoutline").fadeIn(50);
            $("#stamina-bar").animate({"opacity":"0"},300)
            $("#oxy-bar").animate({"opacity":"0"},300)

            $(".status-hud").animate({
                left: "2.6vh",
                width: "28.7vh"
            }, 500, function() {
                $(".icon").animate({"width":".8em"},300)
                $(".short .icon").animate({"width":".6em"},300)

                
                $(".status-hud").animate({"bottom":".6%"},300)


                $(".long").animate({"width":"100px","height":"25px"},300)
                $(".short").animate({"width":"30px","height":"25px"},300)
            });

            if (!phoneOpen) {
                $(".voice").animate({
                    bottom: "235px"
                }, 500, function() {
                });
            }


            $(".street-text").animate({
                left: "28.5vh",
                bottom: ".6vh",
            }, 500);
            $(".street-text-compass").animate({"height":"25px"})
        } else {
            inVehicle = false
            $(".mapoutline").fadeOut(50);

            $(".icon").animate({"width":"1em"},300)
            $(".short .icon").animate({"width":"1em"},300)
            
            $(".status-hud").animate({"bottom":"2%"},300)

            $(".long").animate({"width":"130px","height":"30px"},300)
            $(".short").animate({"width":"30px","height":"30px"},300, () => {
                $(".status-hud").animate({
                    left: "1%",
                    width: "32vh"
                }, 500, () => $("#stamina-bar").animate({"opacity":"1"},300));
                
            })

            $("#hunger-bar").fadeIn()
            $("#water-bar").fadeIn()
            $("#stamina-bar").fadeIn()
            //$("#oxy-bar").fadeIn()
            if (!phoneOpen) {
                $(".car-hud").fadeOut(500, function() {
                    $(".voice").animate({
                        bottom: "2vh"
                    }, 500);
                });
            }

            $(".street-text").animate({
                left: "1.8vh",
                bottom: "6vh"
            }, 500);
            $(".street-text-compass").animate({"height":"30px"})
         
        }
        $(".status-hud-clock-text").html(event.data.time)
    } else if (event.data.type == "clockStreet") {
        $(".status-hud-clock-text").html(event.data.time)
        $(".street-text-text").html(event.data.street)
        $(".street-text-compass").html(event.data.compass)
    } else if (event.data.type == "voice") {
        $(".voice-elipse").html(event.data.lvl)
    } else if (event.data.type == "money") {
        $("#cash").html(setCurrency(event.data.money))
        if (event.data.show) {
            $(".money-cash").animate({opacity: "1.0"}, 100);
        } else {
            $(".money-cash").animate({opacity: "0.0"}, 100);
        }
    } else if (event.data.type == "moneyUpdate") {
        updatedCashCount++
        $("#cash").html(setCurrency(event.data.newCashAmount))
        if (event.data.isMinus) {plusOrMinus = "-"} else {plusOrMinus = "+"}
        $(".money-cash").animate({opacity: "1.0"}, 100);
        if (updatedCashCount == 1) {
            $("#addCashValue").html(plusOrMinus+setCurrency(event.data.money))
            $("#addCash").animate({opacity: "1.0"}, 100);
        } else {
            $("#addCash").animate({opacity: "0.0"}, 100, function(){
                $("#addCashValue").html(plusOrMinus+setCurrency(event.data.money))
                $("#addCash").animate({opacity: "1.0"}, 100);
            });
        }
        setTimeout(() => {
            updatedCashCount--
            if (updatedCashCount == 0) {
                $(".money-cash").animate({opacity: "0.0"}, 100);
                $("#addCash").animate({opacity: "0.0"}, 100);
            }
        }, 2000);
    } else if (event.data.type == "speak") {
        if (event.data.active) {
            $(".circle-ripple").fadeIn(150)
        } else {
            $(".circle-ripple").fadeOut(150)
        }
    }
});

function setCurrency(price) {
    return (price).toLocaleString('tr-TR', {style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0})
}

function carHudMiniIconOnOff(style, on) {
    if (on == "close") {
        $("#"+style).css("display", "none")
        $("#"+style+"-icon").css("display", "none")
    } else if (!on) {
        $("#"+style).css("display", "none")
        $("#"+style+"-icon").css("display", "block")
        $("#"+style+"-icon").css("opacity", "0.45")
    } else {
        $("#"+style).css("display", "block")
        $("#"+style+"-icon").css("display", "block")
        $("#"+style+"-icon").css("opacity", "1.0")
    }
}

$(".hud-menu-header-close").click(function() {
    $(".hud-menu-container").css("display", "none");
    $.post('https://red-hudv2/close-ayar-menu');
});

$("#hud").on( "click", function(e) {
    if (e.currentTarget.checked) {
        $.post('https://red-hudv2/hudkapa', JSON.stringify({onOff: e.currentTarget.checked}) );
    } else {
        $.post('https://red-hudv2/hudac', JSON.stringify({onOff: e.currentTarget.checked}) );
    };
});

$("#emotechat").on( "click", function(e) {
    if (e.currentTarget.checked) {
        $.post('https://red-hudv2/emotechat', JSON.stringify({onOff: e.currentTarget.checked}) );
    } else {
        $.post('https://red-hudv2/emotechat', JSON.stringify({onOff: e.currentTarget.checked}) );
    };
});

$("#blackbar").on( "click", function(e) {
    if (e.currentTarget.checked) {
        $(".blackbar-container").css("display", "flex")
    } else {
        $(".blackbar-container").css("display", "none")
    };
});

$("#imenu").on( "click", function(e) {
    $.post('https://red-hudv2/set-emotechat', JSON.stringify({status: e.currentTarget.checked}) );
});