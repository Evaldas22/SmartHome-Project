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
            var li = ``;
            var a = ``;
            $("[class*='light']").off("click");
            $.each(data, function (key, val) {

                var activeLight = '';

                if (val.value === "ON") {
                    activeLight = ' activeLight';
                    $("[class*='" + val.name + "']").addClass("activeLight");
                }

                li += `
                <li class="lights`+ val.name + ` ` + val.id + activeLight + `">
                    <a href="javascript:;">
                        <i class="fa fa-lightbulb-o"></i>`+ val.name + `
                    </a>
                </li>`;

                a += `<a href="javascript:;" class="lights` + val.name + ` ` + val.id + activeLight + `"><i class="fa fa-lightbulb-o"></i>` + val.name + `</a>`;
            })

            $('ul #sensors1').html(li);
            $('div.groupLights').html(a);

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
            var li = ``;
            var a = ``;
            $.each(data, function (key, val) {
               
                val.name = val.name.replace(' ', '');

            if(val.value === 'ON' || val.value === 'OFF'){
                a += `<a href='javascript:;' class="sensors` + val.name + ` ` + val.id + `" style="cursor:default;"><i class="fa fa-rss"></i>` + val.name + `: ` + val.value;
                a += `<label class="switch"><input type="checkbox"`
                if(val.value === 'ON')  a+=`checked`
                a +=`><span class="slider round"></span></label>`+ `</a>`;
            }
            else
                a += `<a href='javascript:;' class="sensors` + val.name + ` ` + val.id + `" style="cursor:default;"><i class="fa fa-rss"></i>` + val.name + `: ` + val.value + `</a>`;
                
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

            $('ul #sensors2').html(li);
            $('div.groupSensors').html(a);

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