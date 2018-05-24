$(document).ready(function () {

    intervalTime = 10000;
    lightsIntervalTime = 5000;
    // Call functions
    getLights();
    getSensors();

    // ***********************LIGHTS*******************************
    function getLights() {
        // get lights list and display if ON
        $.getJSON("/lights", function (data) {
            var a = ``;
            $("[class*='light']").off("click");
            $.each(data, function (key, val) {

                var activeLight = '';

                if (val.value === "ON") {
                    activeLight = ' activeLight';
                    $("[class*='" + val.name + "']").addClass("activeLight");
                    $("[class*='lights" + val.name + "']").css('background-color', '27282A').addClass('lights' + val.name + ' ' + val.id);
                }
                else if (val.value === "OFF") {
                    $("[class*='lights" + val.name + "']").removeClass("activeLight");
                    $("[class*='lights" + val.name + "']").css('background-color', '27282A').addClass('lights' + val.name + ' ' + val.id);
                }
                else if(val.value === "Not responded") {
                    $("[class*='lights" + val.name + "']").css('background-color', 'red').removeClass('lights' + val.name + ' ' + val.id);
                    return true;
                }

                a += `<a href="javascript:;" class="lights` + val.name + ` ` + val.id + activeLight + `"><i class="fa fa-lightbulb-o"></i>` + val.name + `</a>`;
            })
            if(a.length !== 0)
            $('div.groupLights').html(a);

        }).fail( function(d, textStatus, error) {
            console.error("getJSON failed, status: " + textStatus + ", error: "+error)
        }).always(function () {
            // LIGHTS CONTROL
            //console.log('Lights response: ');
            
            $("[class*='lights']").click(function () {
                if (!$(this).hasClass("activeLight")) {
                    $(this).addClass("activeLight");
                    $('.' + this.classList[0]).addClass("activeLight");
                    console.log(this.classList[0] + " ON");
                    var update_on = $.post("/lights/update", { id: this.classList[1] });
                }
                else {
                    $(this).removeClass("activeLight");
                    $('.' + this.classList[0]).removeClass("activeLight");
                    console.log(this.classList[0] + " OFF");
                    var update_off = $.post("/lights/update", { id: this.classList[1] });
                }
            });


            timeout1 = setTimeout(getLights, lightsIntervalTime);
            // console.log(timeout1);
        });


    }

    // ***********************SENSORS*******************************
    function getSensors() {
        $.getJSON("/sensors", function (data) {

            var a = ``;
            
            $.each(data, function (key, val) {
               
                val.name = val.name.replace(' ', '');

            if(val.value === 'ON' || val.value === 'OFF'){
                a += `<a href='javascript:;' class="sensors` + val.name + ` ` + val.id + `" style="cursor:default;"><i class="fa fa-rss"></i><div class="valName">` + val.name + `: </div><div class="valValue">` + val.value;
                a += `</div><label class="switch"><input type="checkbox"`
                if(val.value === 'ON')  a+=`checked`
                a +=`><span class="slider round"></span></label>`+ `</a>`;
            }
            else if(val.name.includes('Temperature') || val.name.includes('temperature')) {
                if(val.value <= 20)
                        bgColor = "background-color: #F1C75A";
                    if(val.value < 30 && val.value > 20)
                        bgColor = "background-color: #F5814C";
                    if(val.value >= 30)
                        bgColor = "background-color: #EF5052";
                a += `<a href='javascript:;' class="sensors` + val.name + ` ` + val.id + `" style="cursor:default; `+bgColor+`"><i class="fa fa-rss"></i><div class="valName">` + val.name + `: </div><div class="valValue">` + val.value + `</div></a>`;
            }
            else if(val.name.includes('Humidity') || val.name.includes('humidity')) {
                if(val.value <= 40)
                        bgColor = "background-color: #4693C4";
                    if(val.value < 60 && val.value > 40)
                        bgColor = "background-color: #2660A6";
                    if(val.value >= 60)
                        bgColor = "background-color: #10539A";
                a += `<a href='javascript:;' class="sensors` + val.name + ` ` + val.id + `" style="cursor:default; `+bgColor+`"><i class="fa fa-rss"></i><div class="valName">` + val.name + `: </div><div class="valValue">` + val.value + `</div></a>`;
            }
            else
                a += `<a href='javascript:;' class="sensors` + val.name + ` ` + val.id + `" style="cursor:default;"><i class="fa fa-rss"></i><div class="valName">` + val.name + `: </div><div class="valValue">` + val.value + `</div></a>`;
                



                if(val.name === "Temperature"){
                    if(val.value < 20)
                        $('.temp').css('background-color', '#F1C75A');
                    if(val.value < 30 && val.value > 20)
                        $('.temp').css('background-color', '#F5814C');
                    if(val.value > 30)
                        $('.temp').css('background-color', '#EF5052');

                    $('#tempVal1').html(val.value);
                }
                if(val.name === "Humidity") {
                    if(val.value < 40)
                        $('.hum').css('background-color', '#4693C4');
                    if(val.value < 60 && val.value > 40)
                        $('.hum').css('background-color', '#2660A6');
                    if(val.value > 60)
                        $('.hum').css('background-color', '#10539A');

                    $('#humVal1').html(val.value);
                }
            })
            if(a.length !== 0)
            $('div.groupSensors').html(a);

        }).fail( function(d, textStatus, error) {
            console.error("getJSON failed, status: " + textStatus + ", error: "+error)
        }).always(function () {

            $("[class*='slider']").click(function () {
                if (!$(this).hasClass("activeSensor")) {
                    $(this).addClass("activeSensor");
                    console.log(this.classList[0] + " ON id:" + this.closest('a').classList[1]);
                    console.log($(this).closest('a').text());
                    var update_on = $.post("/sensors/update", { id: this.closest('a').classList[1] });
                    getSensors();
                }
                else {
                    $(this).removeClass("activeSensor");
                    console.log(this.classList[0] + " OFF id:" + this.closest('a').classList[1]);
                    var update_off = $.post("/sensors/update", { id: this.closest('a').classList[1] });
                    getSensors();
                }

            });


            timeout2 = setTimeout(getSensors, intervalTime);
            // console.log(timeout2);
        });
    }

});
