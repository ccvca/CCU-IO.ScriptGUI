/**
 * Created by Schorling on 14.11.13.
 */


var SGI = {

    zoom: 1,
    theme: "",
    counter: 0,
    str_theme: "ScriptGUI_Theme",
    str_settings: "ScriptGUI_Settings",
    str_prog: "ScriptGUI_Programm",

    Setup: function () {
        console.log("Start_Setup");


        // Lade Theme XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        theme = storage.get(SGI.str_theme);
        if (theme == undefined) {
            theme = "dark-hive"
        }
        $("head").append('<link id="theme_css" rel="stylesheet" href="css/' + theme + '/jquery-ui-1.10.3.custom.min.css"/>');


        // slider XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        SGI.scrollbar_h("init", $(".scroll-pane"), $(".scroll-content"), $("#scroll_bar_h"), 50);
        SGI.scrollbar_v("init", $(".scroll-pane"), $(".scroll-content"), $("#scroll_bar_v"), 50);
        SGI.scrollbar_v("init", $("#toolbox_body"), $(".toolbox"), $("#scroll_bar_toolbox"), 100);

        var key = "";
        $(document).keydown(function (event) {
            key = String.fromCharCode(event.keyCode);
        });

        $(document).keyup(function () {
            key = "";
        });

        $('#prg_body').on('mousewheel', function (event, delta, deltaX, deltaY) {

            if (key.toString() == "Y") {
                var ist = $("#scroll_bar_h").slider("option", "value");
                if (ist > 100) {
                    $("#scroll_bar_h").slider("option", "value", 100)
                } else if (ist < 0) {
                    $("#scroll_bar_h").slider("option", "value", 0)
                } else {
                    $("#scroll_bar_h").slider("option", "value", ist + delta * 3)
                }

            } else {
                var ist = $("#scroll_bar_v").slider("option", "value");
                if (ist > 100) {
                    $("#scroll_bar_v").slider("option", "value", 100)
                } else if (ist < 0) {
                    $("#scroll_bar_v").slider("option", "value", 0)
                } else {
                    $("#scroll_bar_v").slider("option", "value", ist + delta * 3)
                }
            }
        });

        // Toolbox XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        $(".toolbox").hide();
        $("#toolbox_logic").show();


        // Make btn Toolboxauswahl
        $("#toolbox_select").multiselect({
            multiple: false,
            header: false,
            noneSelectedText: false,
            selectedList: 1,
            minWidth: 140,
            height: 200
        });

        // Toolboxauswahl
        $("#toolbox_select").change(function () {
            $(".toolbox").hide();
            $("#toolbox_" + $(this).val()).show();
        });

        // Toolboxauswahl Style
        $("#main").find("button.ui-multiselect").addClass("multiselect_toolbox")

        console.log("Finish_Setup");

        SGI.Main();
        SGI.menu_iconbar();
        SGI.context_menu();
    },

    scrollbar_h: function (init, scrollPane_h, scroll_content, scroll_bar_h, value) {

        //scrollpane parts
        var scrollPane = scrollPane_h,
            scrollContent = scroll_content;
        //build slider
        if (init != "init") {
            var scrollbar = scroll_bar_h
        } else {
            var scrollbar = scroll_bar_h.slider({
                slide: function (event, ui) {
                    if (scrollContent.width() > scrollPane.width()) {
                        scrollContent.css("margin-left", Math.round(
                            ui.value / 100 * ( scrollPane.width() - scrollContent.width() )
                        ) + "px");
                    } else {
                        scrollContent.css("margin-left", 0);
                    }
                },
                change: function (event, ui) {
                    if (scrollContent.width() > scrollPane.width()) {
                        scrollContent.css("margin-left", Math.round(
                            ui.value / 100 * ( scrollPane.width() - scrollContent.width() )
                        ) + "px");
                    } else {
                        scrollContent.css("margin-left", 0);
                    }
                }
            });

            //append icon to handle
            var handleHelper = scrollbar.find(".ui-slider-handle")
                .mousedown(function () {
                    scrollbar.width(handleHelper.width());
                })
                .mouseup(function () {
//                    scrollbar.width("100%");
                })
                .append("<span class='ui-icon ui-icon-grip-dotted-vertical'></span>")
                .wrap("<div class='ui-handle-helper-parent'></div>").parent();
            //change overflow to hidden now that slider handles the scrolling
            scrollPane.css("overflow", "hidden");

        }

        //size scrollbar and handle proportionally to scroll distance
        function sizeScrollbar_h() {
            var remainder = scrollContent.width() - scrollPane.width();
            var proportion = remainder / scrollContent.width();
            var handleSize = scrollPane.width() - ( proportion * scrollPane.width() );
            scrollbar.find(".ui-slider-handle").css({
                width: handleSize,
                height: "10px",
                "margin-left": (-handleSize / 2) + 2,
                "margin-top": 0

            });


            $(scroll_bar_h).width(parseInt($(scrollbar.parent()).width() - handleSize - 4));
            $(scroll_bar_h).css({left: parseInt(handleSize / 2) + "px"});
        }

        //reset slider value based on scroll content position
        function resetValue_h() {
            var remainder = scrollPane.width() - scrollContent.width();
            var leftVal = scrollContent.css("margin-left") === "auto" ? 0 :
                parseInt(scrollContent.css("margin-left"));
            var percentage = Math.round(leftVal / remainder * 100);
            scrollbar.slider("value", percentage);
        }

        //if the slider is 100% and window gets larger, reveal content
        function reflowContent_h() {
            var showing = scrollContent.width() + parseInt(scrollContent.css("margin-left"), 10);
            var gap = scrollPane.width() - showing;
            if (gap > 0) {
                scrollContent.css("margin-left", parseInt(scrollContent.css("margin-left"), 10) + gap);
            }
        }

        //change handle position on window resize
        $(window).resize(function () {

            setTimeout(function () {             // TODO Timout wegen der Maximate dauer
                resetValue_h();
                sizeScrollbar_h();
                reflowContent_h();

            }, 300);
        });


        //init scrollbar size
        setTimeout(sizeScrollbar_h, 100);//safari wants a timeout

        if (init == "init") {
            $(scroll_bar_h).slider("value", value);
            console.log("Finish_Scrollbar_H init");
        } else {
            console.log("Finish_Scrollbar_H");
        }

    },

    scrollbar_v: function (init, scrollPane_v, scroll_content, scroll_bar_v, value) {

        //scrollpane parts
        var scrollPane = scrollPane_v,
            scrollContent = scroll_content;
        //build slider
        if (init != "init") {
            var scrollbar = scroll_bar_v
        } else {
            var scrollbar = scroll_bar_v.slider({
                orientation: "vertical",
                slide: function (event, ui) {
                    if (scrollContent.height() > scrollPane.height()) {
                        scrollContent.css("margin-top", Math.round(
                            (100 - ui.value) / 100 * ( scrollPane.height() - scrollContent.height() )
                        ) + "px");

                    } else {
                        scrollContent.css("margin-top", 0);

                    }
                },
                change: function (event, ui) {
                    if (scrollContent.height() > scrollPane.height()) {
                        scrollContent.css("margin-top", Math.round(
                            (100 - ui.value) / 100 * ( scrollPane.height() - scrollContent.height() )
                        ) + "px");

                    } else {
                        scrollContent.css("margin-top", 0);

                    }
                }
            });

            //append icon to handle
            var handleHelper = scrollbar.find(".ui-slider-handle")
                .mousedown(function () {
                    scrollbar.height(handleHelper.height());
                })
                .mouseup(function () {
                    scrollbar.height(handleHelper.height());
                })
                .append("<span class='ui-icon ui-icon-grip-dotted-vertical'></span>")
                .wrap("<div class='ui-handle-helper-parent'></div>").parent();
            //change overflow to hidden now that slider handles the scrolling
            scrollPane.css("overflow", "hidden");
        }
        //size scrollbar and handle proportionally to scroll distance
        function sizeScrollbar_v() {

            var remainder = scrollContent.height() - scrollPane.height();
            var proportion = remainder / scrollContent.height();
            var handleSize = scrollPane.height() - ( proportion * scrollPane.height() );

            scrollbar.find(".ui-slider-handle").css({

                height: handleSize,
                width: "10px",
                "margin-bottom": (-handleSize / 2) - 4,
                "margin-left": "-6.5px"
            });

            $(scroll_bar_v).height(parseInt($(scrollbar.parent()).height() - handleSize - 4));
            $(scroll_bar_v).css({top: parseInt(handleSize / 2) + "px"});
            $(scroll_bar_v).find(".ui-icon").css({top: parseInt(handleSize / 2) - 8 + "px"});

        }

        //reset slider value based on scroll content position
        function resetValue_v() {

            var remainder = scrollPane.height() - scrollContent.height();
            var topVal = scrollContent.css("margin-top") === "auto" ? 0 :
                parseInt(scrollContent.css("margin-top"));

            var percentage = Math.round(topVal / remainder * 100);
            scrollbar.slider("value", 100 - percentage);
        }

        //if the slider is 100% and window gets larger, reveal content
        function reflowContent_v() {
            var showing = scrollContent.height() + parseInt(scrollContent.css("margin-top"), 10);
            var gap = scrollPane.height() - showing;
            if (gap > 0) {
                scrollContent.css("margin-top", parseInt(scrollContent.css("margin-top"), 10) + gap);
            }
        }

        //change handle position on window resize
        $(window).resize(function () {
            $(scroll_bar_v).find("a").css({"background-image": "url(css/" + theme + "/images/scrollbar_r.png",
                backgroundRepeat: "repeat"});

            setTimeout(function () {             // TODO Timout wegen der Maximate dauer
                resetValue_v();
                sizeScrollbar_v();
                reflowContent_v();

            }, 300);
        });


        //init scrollbar size
        setTimeout(sizeScrollbar_v, 100);//safari wants a timeout


        $(scroll_bar_v).find(".ui-icon").css({
            "transform": "rotate(90deg)",
            "-ms-transform": "rotate(90deg)",
            "-webkit-transform": "rotate(90deg)",
            left: "-2px"
        });


        $(scroll_bar_v).find("a").css({"background-image": "url(css/" + theme + "/images/scrollbar_r.png)",
            backgroundRepeat: "repeat"});

        if (init == "init") {
            $(scroll_bar_v).slider("value", value);
            console.log("Finish_Scrollbar_V init");
        } else {
            console.log("Finish_Scrollbar_V");
        }

    },

    Main: function () {
        console.log("Start_Main");

        // Aufzeigen der Default mit XXX gekennzeichnet wurde geändert
        jsPlumb.Defaults = {
            Anchor: "BottomCenter",
            Anchors: [ null, null ],
            ConnectionsDetachable: true,
            ConnectionOverlays: [],
            Connector: "Bezier",
            Container: $("#prg_panel"),                             //xxx
            DoNotThrowErrors: false,
            DragOptions: { },
            DropOptions: {tolerance: "touch" },
            Endpoint: "Dot",
            Endpoints: [ null, null ],
            EndpointOverlays: [ ],
            EndpointStyle: { fillStyle: "#456" },
            EndpointStyles: [ null, null ],
            EndpointHoverStyle: null,
            EndpointHoverStyles: [ null, null ],
            HoverPaintStyle: null,
            LabelStyle: { color: "black" },
            LogEnabled: false,
            Overlays: [ ],
            MaxConnections: 1,
            PaintStyle: { lineWidth: 4, strokeStyle: "blue" },      //xxx
            ReattachConnections: false,
            RenderMode: "svg",
            Scope: "jsPlumb_DefaultScope"
        };

        jsPlumb.bind("click", function (conn) {
            jsPlumb.detach(conn);

        });


//        Make element draggable
        var active_toolbox;
        $(".fbs").draggable({
            helper: "clone",
            zIndex: -1,
            revert: true,
            revertDuration: 0,
            containment: '#main',

            start: function (e, ui) {
                active_toolbox = $(e.currentTarget).parent();
                var add = $(this).clone();
                $(add).attr("id", "helper");
                $(add).addClass("helper");
                $(add).appendTo(".main");
            },
            drag: function (e, ui) {
                $(".main").find("#helper").css({
                    left: ui.position.left,
                    top: (ui.offset.top) - 35
                })
            },
            stop: function (e, ui) {
                $("#helper").remove()
            }

        });

        //Make element droppable
        $(".prg_panel").droppable({
            drop: function (ev, ui) {


                var type = $(ui["draggable"][0]).attr("id");
                var top = (ui["offset"]["top"] - $("#prg_panel").offset().top + 35) / SGI.zoom;
                var left = (ui["offset"]["left"] - $("#prg_panel").offset().left) / SGI.zoom;

                SGI.add_fbs_element(type, top, left);
                SGI.make_fbs_drag();

                SGI.counter++;

            }
        });


        // Select FBS
        $("#prg_panel").on("click", ".fbs_element", function (e) {
            if ($(e.target).is(".btn_add_input") || $(e.target).is(".btn_input_ch")) {
            } else {
                $(this).toggleClass("fbs_selected");
            }
        });

        // None select FBS
        $('#prg_panel').click(function (e) {
            if ($(e.target).is("#prg_panel")) {
                $(".fbs_element").removeClass("fbs_selected");
            }
        });


        console.log("Finish_Main");
    },

    add_fbs_element: function (type, top, left) {


        if (type == "und") {

            $("#prg_panel").append('\
                             <div id="und_' + SGI.counter + '" class="fbs_element fbs_element_varinput">\
                                <div id="head_' + SGI.counter + '"  class="div_head" style="background-color: green">\
                                    <a class="head_font">' + type + '</a>\
                                </div>\
                                <div id="left_' + SGI.counter + '" class="div_left">\
                                    <div id="und_' + SGI.counter + '_in1"  class="div_input und_' + SGI.counter + '_in"><a class="input_font">IN 1</a></div>\
                                    <div id="und_' + SGI.counter + '_in2"  class="div_input und_' + SGI.counter + '_in"><a class="input_font">IN 2</a></div>\
                                </div>\
                                <div id="right_' + SGI.counter + '" class="div_right">\
                                    <div id="und_' + SGI.counter + '_out1" class="div_output1 und_' + SGI.counter + '_out"><a class="output_font">OUT</a></div>\
                                </div>\
                            </div>');
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (type == "oder") {
            $("#prg_panel").append('\
                             <div id="oder_' + SGI.counter + '" class="fbs_element fbs_element_varinput">\
                                <div id="head_' + SGI.counter + '"  class="div_head" style="background-color: green">\
                                    <a class="head_font">' + type + '</a>\
                                </div>\
                                <div id="left_' + SGI.counter + '" class="div_left">\
                                    <div id="oder_' + SGI.counter + '_in1"  class="div_input oder_' + SGI.counter + '_in"><a class="input_font">IN 1</a></div>\
                                    <div id="oder_' + SGI.counter + '_in2"  class="div_input oder_' + SGI.counter + '_in"><a class="input_font">IN 2</a></div>\
                                </div>\
                                <div id="right_' + SGI.counter + '" class="div_right">\
                                    <div id="oder_' + SGI.counter + '_out1" class="div_output1 oder_' + SGI.counter + '_out"><a class="output_font">OUT</a></div>\
                                </div>\
                             </div>');
        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (type == "input") {
            $("#prg_panel").append('\
                        <div id="input_' + SGI.counter + '" class="fbs_element fbs_element_io">\
                            <div id="head_' + SGI.counter + '"  class="div_head" style="background-color: yellow">\
                                    <p class="head_font">Input</p>\
                            </div>\
                            <div id="left_' + SGI.counter + '" class="div_left"></div>\
                            <div id="right_' + SGI.counter + '" class="div_right">\
                                <div style="height: 30px; margin-top:-15px" id="input_' + SGI.counter + '_out1" class="div_output1 input_' + SGI.counter + '_out"></div>\
                            </div>\
                        </div>');

        }
        //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        if (type == "output") {
            $("#prg_panel").append('\
                        <div id="output_' + SGI.counter + '" class="fbs_element">\
                        <div id="head_' + SGI.counter + '"  class="div_head" style="background-color: red">\
                                    <p class="head_font">Output</p>\
                            </div>\
                            <div id="left_' + SGI.counter + '" class="div_left">\
                               <div style="height: 30px; margin-top:-15px" id="output_' + SGI.counter + '_in1"  class="div_input output_' + SGI.counter + '_in"></div>\
                            </div>\
                                <div id="right_' + SGI.counter + '" class="div_right">\
                            </div>\
                        </div>');


        }

        $("#" + type + "_" + SGI.counter).css({"top": top + "px", "left": left + "px"});

        var _in = $('.' + type + '_' + SGI.counter + '_in');
        $.each(_in, function () {
            var id = $(this).attr("id");
            SGI.add_endpoint(id, "input");
        });

        var _out = $('.' + type + '_' + SGI.counter + '_out');
        $.each(_out, function () {
            var id = $(this).attr("id");
            SGI.add_endpoint(id, "output");
        });
    },

    add_endpoint: function (id, type) {

        if (type == "input") {
            var endpointStyle = {fillStyle: "green"};
            jsPlumb.addEndpoint(id, { uuid: id }, {
                anchor: "Left",
                isTarget: true,
                connector: "Flowchart",
                paintStyle: endpointStyle,
                endpoint: [ "Rectangle", { width: 30, height: 10} ]
            });
        }
        if (type == "output") {
            var endpointStyle = {fillStyle: "orange"};
            jsPlumb.addEndpoint(id, { uuid: id }, {
                uuid: $(id).attr("id"),
                anchor: "Right",
                isSource: true,
                maxConnections: -1,
                connector: "Flowchart",
                paintStyle: endpointStyle,
                endpoint: [ "Rectangle", { width: 30, height: 10} ]
            });
        }
    },

    make_fbs_drag: function () {
        //Todo SGI.zoom faktor mit berücksichtigen
        $(".fbs_element").draggable({
            distance: 5,
            alsoDrag: ".fbs_selected",
//            snap: true,
            start: function (event, ui) {
                ui.position.left = 0;
                ui.position.top = 0;
            },

            drag: function (event, ui) {
                var changeLeft = ui.position.left - ui.originalPosition.left; // find change in left
                var newLeft = ui.originalPosition.left + changeLeft / SGI.zoom; // adjust new left by our zoomScale

                var changeTop = ui.position.top - ui.originalPosition.top; // find change in top
                var newTop = ui.originalPosition.top + changeTop / SGI.zoom; // adjust new top by our zoomScale

                ui.position.left = newLeft;
                ui.position.top = newTop;

                jsPlumb.repaintEverything(); //TODO es muss nur ein repaint gemacht werden wenn mehrere selected sind
            }


        });


    },

    make_savedata: function () {
        console.log("Start_Make_Savedata");

        var data = {
            blocks: [],
            connections: []
        };


        $("#prg_panel .fbs_element").each(function (idx, elem) {
            var $elem = $(elem);
            data.blocks.push({
                blockId: $elem.attr('id'),
                positionX: parseInt($elem.css("left"), 10),
                positionY: parseInt($elem.css("top"), 10)
            });
        });


        $.each(jsPlumb.getConnections(), function (idx, connection) {
            data.connections.push({
                connectionId: connection.id,
                pageSourceId: connection.sourceId,
                pageTargetId: connection.targetId
            });
        });

        console.log(data);
        return data;
    },

    make_struc: function () {
        console.log("Start_Make_Struk");

        var blocks = [];
        $("#prg_panel .fbs_element").each(function (idx, elem) {
            var $elem = $(elem);
            blocks.push({
                blockId: $elem.attr('id'),
                positionX: parseInt($elem.css("left"), 10),
                positionY: parseInt($elem.css("top"), 10)
            });
        });
        console.log(blocks);


        var connections = [];
        $.each(jsPlumb.getConnections(), function (idx, connection) {
            connections.push({
                connectionId: connection.id,
                pageSourceId: connection.sourceId,
                pageTargetId: connection.targetId
            });
        });
        console.log(connections);


        function SortByName(a, b) {

            var aName = a.positionX;
            var bName = b.positionX;
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        }

        blocks.sort(SortByName);

        // Erstelle Scrip Stucktur
        var struck = []
        $.each(blocks, function () {
            var id = this["blockId"];
            var data = {
                type: "",
                input: [],
                output: []

            };

            data.type = this["blockId"].split("_")[0];

            $.each(connections, function () {
                var add = [];
                input = this["pageTargetId"].split("_");
                input_name = (input[0] + "_" + input[1]);

                output = this["pageSourceId"].split("_");
                output_name = (output[0] + "_" + output[1]);

                if (input_name == id) {

                    add.push(input[2]);
                    add.push(this.pageSourceId);
                    data.input.push(add)
                }

                if (output_name == id) {
                    var add = [];
                    add.push(output[2]);
                    add.push(this.pageTargetId);
                    data.output.push(add)
                }

            });

            struck.push(data);
        });
        console.log(struck)
        console.log("Finish_Make_Struk");

    }

};


(function () {
    $(document).ready(function () {


        SGI.Setup();
        $("body").disableSelection();


    });
})(jQuery);