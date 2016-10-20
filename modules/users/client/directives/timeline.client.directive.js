/**
 * Created by Hope on 2/10/2016.
 */
'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('timeline', ['d3Service', 'moment', '$window', function (d3Service, moment,$window) {
    // define constants and helpers used for the directive
    // ...

    return {
        restrict: 'EA', // the directive can be invoked only by using <my-directive> tag in the template
        scope: { // attributes bound to the scope of the directive
            data: '=',
            options:'=',
            specials:'='
        },
        link: function (scope, element, attrs) {
            d3Service.d3().then(function (d3) {
                //var margin = parseInt(attrs.margin) || 20,
                //    barHeight = parseInt(attrs.barHeight) || 20,
                //    barPadding = parseInt(attrs.barPadding) || 5;

                //var svg = d3.select(element[0])
                //    .append('svg')
                //    .style('width', '100%');

                //// Browser onresize event
                //window.onresize = function() {
                //    scope.$apply();
                //};
                //// Watch for resize event
                //scope.$watch(function() {
                //    console.log(angular.element($window)[0].innerWidth);
                //    return angular.element($window)[0].innerWidth;
                //}, function() {
                //    scope.render(scope.data);
                //});
                //
                //===================================================== MARK BETWEEN ^BARCHART AND vTIMEKNOT ===========

                var events = scope.data !== '=' ? scope.data : [{name: "Wake up", date: "2012-09-28T06:00:00"},
                    {name: "Breakfast", date: "2012-09-28T06:30:00"},
                    {name: "Leave kids at school", date: "2012-09-28T07:45:00"},
                    {name: "Check email", date: "2012-09-28T08:00:00"},
                    {name: "Lunch", date: "2012-09-28T11:30:00"},
                    {name: "Send report", date: "2012-09-28T13:15:00"},
                    {name: "Pick kids", date: "2012-09-28T17:16:00"},
                    {name: "Dinner", date: "2012-09-28T18:13:00"},
                    {name: "Watch a movie", date: "2012-09-28T20:16:00"},
                    {name: "Go to sleep", date: "2012-09-28T23:00:00"}
                ];
                var options = scope.options !== undefined ? scope.options : {
                    horizontalLayout: false,
                    color: "55acee",
                    height: 600,
                    width: 60,
                    showLabels: true,
                    labelFormat: "%I:%M"
                };

                var cfg = {
                    width: 600,
                    height: 200,
                    radius: 15,
                    lineWidth: 3,
                    color: "#999",
                    background: "#FFF",
                    dateFormat: "%I:%M , %m/%d/%Y",
                    horizontalLayout: true,
                    showLabels: false,
                    labelFormat: "%I:%M , %m/%d/%Y",
                    addNow: false,
                    addNowLabel: "Now",
                    seriesColor: d3.scale.category20(),
                    dateDimension: true
                };


                if ( events.length == 1) {
                    options.width = 50;
                }
                //default configuration override
                if (options !== undefined) {
                    for (var i in options) {
                        cfg[i] = options[i];
                    }
                }


                if (cfg.addNow !== false) {
                    events.push({date: new Date(), name: cfg.addNowLabel || "Today"});
                }
                //// d3 is the raw d3 object
                //// initialization, done once per my-directive tag in template. If my-directive is within an
                //// ng-repeat-ed template then it will be called every time ngRepeat creates a new copy of the template.

                //.style("opacity", 0)
                //.style("position", "relative")
                //.style("z-index", 1)
                //.style("font-family", "Helvetica Neue")
                //.style("font-weight", "300")
                //.style("background","rgba(0,0,0,1)")
                //.style("color", "white")
                //.style("padding", "5px 10px 5px 10px")
                //.style("-moz-border-radius", "8px 8px")
                //.style("border-radius", "8px 8px");
                var svg = d3.select(element[0])
                    .append('svg')
                    .attr("width", cfg.width)
                    .attr("height", cfg.height)
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .classed("svg-content-responsive", true);
                var tip = d3.select(element[0])
                    .append('div');
                    //.style("opacity", 0)
                    //.style("position", "absolute")
                    //.style("font-family", "Helvetica Neue")
                    //.style("font-weight", "300")
                    //.style("background","rgba(0,0,0,0.5)")
                    ////.style("color", "white")
                    //.style("padding", "5px 10px 5px 10px")
                    //.style("-moz-border-radius", "8px 8px")
                    //.style("border-radius", "8px 8px");;
                //.attr("ng-if", "viewall");
                var clicked = [];
                var colors=[];
                for (var i = 0; i < events.length; i++) {
                    clicked[i] = false;
                    if (events[i].name.substr(0,2) == ".@"){
                        colors[i] = "#1B95E0";
                        events[i].color = "#1B95E0";
                    }
                    else if (events[i].name.substr(0,2) == "RT") {
                        colors[i] = "#19cf86";
                        events[i].color = "#19cf86";
                    }
                    else {
                        colors[i] = "#D3D3D3";
                        events[i].color = "#D3D3D3";
                    }
                }

                //
                scope.tweetLink = function (link) {
                    $window.location.href = link;
                    console.log("attempted to go to: "  + link);
                };

                scope.render = function (events, configoptions) {

                    options = configoptions !== undefined ? configoptions : {
                        horizontalLayout: false,
                        color: "55acee",
                        height: 600,
                        width: 60,
                        showLabels: true,
                        labelFormat: "%I:%M"
                    };


                    if (options.horizontalLayout)
                    options.width = $window.innerWidth * .6;

                    if (scope.specials =="inline") {
                        //options.width = options.width * .6;
                    } else if (scope.specials == undefined) {
                        //options.width = options.width * .6;
                    }

                    if ( events.length == 1) {
                        options.width = 50;
                    }

                    //default configuration overrid
                    if (options !== undefined) {
                        for (var i in options) {
                            cfg[i] = options[i];
                        }
                    }

                    //console.log(cfg, options, configoptions);
                    if (cfg.addNow !== false) {
                        events.push({date: new Date(), name: cfg.addNowLabel || "Today"});
                    }
                    //// d3 is the raw d3 object
                    //// initialization, done once per my-directive tag in template. If my-directive is within an
                    //// ng-repeat-ed template then it will be called every time ngRepeat creates a new copy of the template.

                    if (options != configoptions)
                    events = events.reverse();

                    var svg = d3.select(element[0]).append('svg').attr("width", cfg.width).attr("height", cfg.height);
                    var tip = d3.select(element[0])
                        .append('div')
                        //.style("opacity", 0)
                        //.style("position", "absolute");
                        //.style("font-family", "Helvetica Neue")
                        //.style("font-weight", "300")
                        //.style("background","rgba(0,0,0,0.5)")
                        ////.style("color", "white")
                        //.style("padding", "5px 10px 5px 10px")
                        //.style("-moz-border-radius", "8px 8px")
                        //.style("border-radius", "8px 8px");;
                    //console.log(svg, tip);
                    //.attr("ng-if", "viewall");
                    var clicked = [];
                    var currentClick = null;
                    var colors=[];
                    for (var i = 0; i < events.length; i++) {
                        clicked[i] = false;
                        if (events[i].name.substr(0,2) == ".@" || events[i].name.substr(0,1) == "@"){
                            colors[i] = "#1B95E0";
                            events[i].color = "#1B95E0";
                        }
                        else if (events[i].name.substr(0,2) == "RT") {
                            colors[i] = "#19cf86";
                            events[i].color = "#19cf86";
                        }
                        else {
                            colors[i] = "#D3D3D3";
                            events[i].color = "#D3D3D3";
                        }
                    }
                    var maxValue, minValue, timestamps;
                    //Calculate times in terms of timestamps
                    if (!cfg.dateDimension) {
                        timestamps = events.map(function (d) {
                            return d.value;
                        });
                        //new Date(d.date).getTime()});
                        minValue = d3.max(timestamps);
                        maxValue = d3.min(timestamps);
                    } else {
                        timestamps = events.map(function (d) {
                            return Date.parse(d.date);
                        });
                        //new Date(d.date).getTime()});
                        minValue = d3.max(timestamps);
                        maxValue = d3.min(timestamps);
                    }
                    var margin = (d3.max(events.map(function (d) {
                            return d.radius;
                        })) || cfg.radius) * 1.5 + cfg.lineWidth;
                    var step = (cfg.horizontalLayout) ? ((cfg.width - 2 * margin) / (maxValue - minValue)) : ((cfg.height - 2 * margin) / (maxValue - minValue));
                    var series = [];
                    if (maxValue === minValue) {
                        step = 0;
                        if (cfg.horizontalLayout) {
                            margin = cfg.width / 2;
                        } else {
                            margin = cfg.height / 2;
                        }
                    }

                    var linePrevious = {
                        x1: null,
                        x2: null,
                        y1: null,
                        y2: null
                    };

                    svg.selectAll("line")
                        .data(events).enter().append("line")
                        .attr("class", "timeline-line")
                        .attr("x1", function (d) {
                            var ret;
                            if (cfg.horizontalLayout) {
                                var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                                ret = Math.floor(step * (datum - minValue) + margin);
                            }
                            else {
                                ret = Math.floor(cfg.width / 2);
                            }
                            linePrevious.x1 = ret;
                            return ret;
                        })
                        .attr("x2", function (d) {
                            if (linePrevious.x1 !== null) {
                                return linePrevious.x1;
                            }
                            if (cfg.horizontalLayout) {
                                var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                                var ret = Math.floor(step * (datum - minValue ));
                            }
                            return Math.floor(cfg.width / 2);
                        })
                        .attr("y1", function (d) {
                            var ret;
                            if (cfg.horizontalLayout) {
                                ret = Math.floor(cfg.height / 2);
                            }
                            else {
                                var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                                ret = Math.floor(step * (datum - minValue)) + margin;
                            }
                            linePrevious.y1 = ret;
                            return ret;
                        })
                        .attr("y2", function (d) {
                            if (linePrevious.y1 !== null) {
                                return linePrevious.y1;
                            }
                            if (cfg.horizontalLayout) {
                                return Math.floor(cfg.height / 2);
                            }
                            var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                            return Math.floor(step * (datum - minValue));
                        })
                        .style("stroke", function (d) {
                            if (d.color !== undefined) {
                                return d.color;
                            }
                            if (d.series !== undefined) {
                                if (series.indexOf(d.series) < 0) {
                                    series.push(d.series);
                                }
                                return cfg.seriesColor(series.indexOf(d.series));
                            }
                            return cfg.color;
                        })
                        .style("stroke-width", cfg.lineWidth);


                    if (events.length > 1) {
                        svg.selectAll("circle")
                            .data(events).enter()
                            .append("circle")
                            .attr("class", "timeline-event")
                            .attr("r", function (d) {
                                if (d.radius !== undefined) {
                                    return d.radius;
                                }
                                return cfg.radius;
                            })
                            .style("stroke", function (d) {
                                    if (d.color !== undefined) {
                                        return d.color;
                                    }
                                    if (d.series !== undefined) {
                                        if (series.indexOf(d.series) < 0) {
                                            series.push(d.series);
                                        }
                                        //console.log(d.series, series, series.indexOf(d.series));
                                        return cfg.seriesColor(series.indexOf(d.series));
                                    }
                                    return cfg.color;
                                }
                            )
                            .style("stroke-width", function (d) {
                                if (d.lineWidth !== undefined) {
                                    return d.lineWidth;
                                }
                                return cfg.lineWidth;
                            })
                            .style("fill", function (d, i) {
                                var color;
                                if (d.background !== undefined) {
                                    console.log(d);
                                    return d.background;
                                }
                                //if (d.name.substr(0, 2) == ".@"){
                                //    color = "#1B95E0";
                                //    return color;
                                //}
                                //else if (d.name.substr(0, 2) == "RT") {
                                //    color = "#19cf86";
                                //    return color;
                                //}
                                return colors[i];
                            })
                            .attr("cy", function (d) {
                                if (cfg.horizontalLayout) {
                                    return Math.floor(cfg.height / 2);
                                }
                                var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                                return Math.floor(step * (datum - minValue) + margin);
                            })
                            .attr("cx", function (d, i) {
                                if (cfg.horizontalLayout) {
                                    var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                                    //console.log("cx: ",Math.floor(step * (datum - minValue) + margin));
                                    //console.log("cx: ",Math.floor(step * (datum - minValue) + margin));
                                    return Math.floor(step * (datum - minValue) + margin);
                                }
                                return Math.floor(cfg.width / 2);
                            })
                            .on("mouseover", function (d) {

                                if (clicked[i] == undefined) {
                                    clicked[i] = false;
                                }
                                console.log("mouseover", clicked[i], i, options.width *.75 + "px", margin, step);
                                if (clicked[i] == false && cfg.horizontalLayout) {
                                    var format, datetime, dateValue;
                                    if (cfg.dateDimension) {
                                        format = d3.time.format(cfg.dateFormat);
                                        datetime = format(new Date(d.date));
                                        dateValue = (datetime !== "") ? ("<div>" + d.name + "</div>" + " <div>" + datetime + "</div>") : d.name;
                                    } else {
                                        format = function (d) {
                                            return d;
                                        }; // TODO
                                        datetime = d.value;
                                        dateValue = "<div>" + d.name + "</div>" + " <div>" + d.value + "</div>";
                                    }
                                    d3.select(this)
                                        .style("fill", function (d) {
                                            if (d.color !== undefined) {
                                                return d.color;
                                            }
                                            return cfg.color;
                                        }).transition()
                                        .duration(100).attr("r", function (d) {
                                        if (d.radius !== undefined) {
                                            return Math.floor(d.radius * 1.5);
                                        }
                                        return Math.floor(cfg.radius * 1.5);
                                    });
                                    tip.html("");
                                    if (d.img !== undefined) {
                                        tip.append("img").style("float", "left").style("margin-right", "4px").attr("src", d.img).attr("width", "50px").style("z-index", "100").style("position", "relative");
                                        d3.select(element[0])
                                    }
                                    tip.append("md-card").html(dateValue)
                                        .style("width", options.width *.75 + "px")
                                        .style("position", "relative")
                                        .style("margin-top","10px")
                                        .style("font-size","large")
                                        .style("background", "whitesmoke")
                                        .attr("href", function (d) {
                                            return "https://www.google.com";
                                        });
                                    tip.transition()
                                        .duration(100)
                                        .style("opacity", 1).style("display", "block");
                                }
                            })
                            .on("mouseout", function (d, i) {
                                console.log("mouseout", clicked[i], i, options.width *.75 + "px");
                                if (clicked[i] == false) {
                                    d3.select(this)
                                        .style("fill", function (d) {
                                            if (d.background !== undefined) {
                                                return d.background;
                                            }
                                            return cfg.background;
                                        }).transition()
                                        .duration(100).attr("r", function (d) {
                                        if (d.radius !== undefined) {
                                            return d.radius;
                                        }
                                        return cfg.radius;
                                    });
                                    tip.transition()
                                        .duration(100)
                                        .style("opacity", 0).style("display", "none");
                                } else {
                                    var format, datetime, dateValue;
                                    if (cfg.dateDimension) {
                                        format = d3.time.format(cfg.dateFormat);
                                        datetime = format(new Date(d.date));
                                        dateValue = (datetime !== "") ? ("<div>" + d.name + "</div>" + " <div>" + datetime + "</div>") : d.name;
                                    } else {
                                        format = function (d) {
                                            return d;
                                        }; // TODO
                                        datetime = d.value;
                                        dateValue = "<div>" + d.name + "</div>" + " <div>" + datetime + "</div>";
                                    }
                                    d3.select(this)
                                        .style("fill", function (d) {
                                            if (d.color !== undefined) {
                                                return d.color;
                                            }
                                            return cfg.color;
                                        }).transition()
                                        .duration(100).attr("r", function (d) {
                                        if (d.radius !== undefined) {
                                            return Math.floor(d.radius * 1.5);
                                        }
                                        return Math.floor(cfg.radius * 1.5);
                                    });
                                    tip.html("");
                                    if (d.img !== undefined) {
                                        tip.append("img").style("float", "left").style("margin-right", "4px").attr("src", d.img).attr("width", "50px").style("z-index", "100").style("position", "relative");
                                        d3.select(element[0])
                                    }
                                    tip.append("md-card").style("width", options.width *.75 + "px")
                                        .html(dateValue)
                                        .style("position", "relative")
                                        .style("margin-top","10px")
                                        .style("font-size","large")
                                        .style("background", "whitesmoke")
                                        .attr("ng-click", function (d) {
                                            return "tweetLink('https://www.google.com')";
                                        });
                                    //scope.tweetLink('https://www.google.com');
                                    tip.transition()
                                        .duration(100)
                                        .style("opacity", 1).style("display", "block")
                                        .style("width", options.width *.75 + "px");

                                }

                            })
                            .on("click", function (d, i) {

                                if (clicked[i] == true) {
                                    d3.select(this)
                                        .style("fill", function (d) {
                                            if (d.background !== undefined) {
                                                return d.background;
                                            }
                                            return cfg.background;
                                        }).transition()
                                        .duration(100).attr("r", function (d) {
                                        if (d.radius !== undefined) {
                                            return d.radius;
                                        }
                                        return cfg.radius;
                                    });
                                    tip.transition()
                                        .duration(100)
                                        .style("opacity", 0).style("display", "none");
                                    clicked[i] = false;
                                    currentClick = null;

                                } else {
                                    if (currentClick != null) {
                                        d3.select(currentClick)
                                            .style("fill", function (d) {
                                                if (d.background !== undefined) {
                                                    return d.background;
                                                }
                                                return cfg.background;
                                            }).transition()
                                            .duration(100).attr("r", function (d) {
                                            if (d.radius !== undefined) {
                                                return d.radius;
                                            }
                                            return cfg.radius;
                                        });
                                        tip.transition()
                                            .duration(100)
                                            .style("opacity", 0).style("display", "none");
                                        console.log(this, "Remove clickedpoints");
                                    }
                                    currentClick = this;
                                    var format, datetime, dateValue;
                                    if (cfg.dateDimension) {
                                        format = d3.time.format(cfg.dateFormat);
                                        datetime = format(new Date(d.date));
                                        dateValue = (datetime !== "") ? ("<div>" + d.name + "</div>" + " <div>" + datetime + "</div>") : d.name;
                                    } else {
                                        format = function (d) {
                                            return d;
                                        }; // TODO
                                        datetime = d.value;
                                        dateValue = "<div>" + d.name + "</div>" + " <div>" + datetime + "</div>";
                                    }
                                    d3.select(this)
                                        .style("fill", function (d) {
                                            if (d.color !== undefined) {
                                                return d.color;
                                            }
                                            return cfg.color;
                                        }).transition()
                                        .duration(100).attr("r", function (d) {
                                        if (d.radius !== undefined) {
                                            return Math.floor(d.radius * 1.5);
                                        }
                                        return Math.floor(cfg.radius * 1.5);
                                    });
                                    tip.html("");
                                    if (d.img !== undefined) {
                                        tip.append("img").style("float", "left").style("margin-right", "4px").attr("src", d.img).attr("width", "50px").style("z-index", "100").style("position", "relative");
                                        d3.select(element[0])
                                    }
                                    tip.append("md-card").html(dateValue)
                                        .style("width", options.width *.75 + "px")
                                        .style("position", "relative")
                                        .style("margin-top","10px")
                                        .style("font-size","large")
                                        .style("background", "whitesmoke")
                                        .attr("href", function (d) {
                                            return "https://www.google.com";
                                        });
                                    tip.transition()
                                        .duration(100)
                                        .style("opacity", 1).style("display", "block");
                                    clicked[i] = true;
                                }
                                console.log("clicked", clicked[i], i, options.width *.75 + "px");
                            });
                    }
                    else {
                        options.width= 50;
                        cfg.width = 50;
                        svg.selectAll("circle")
                            .data(events).enter()
                            .append("circle")
                            .attr("class", "timeline-event")
                            .attr("r", function (d) {
                                if (d.radius !== undefined) {
                                    return d.radius;
                                }
                                return cfg.radius;
                            })
                            .style("stroke", function (d) {
                                    if (d.color !== undefined) {
                                        return d.color;
                                    }
                                    if (d.series !== undefined) {
                                        if (series.indexOf(d.series) < 0) {
                                            series.push(d.series);
                                        }
                                        //console.log(d.series, series, series.indexOf(d.series));
                                        return cfg.seriesColor(series.indexOf(d.series));
                                    }
                                    return cfg.color;
                                }
                            )
                            .style("stroke-width", function (d) {
                                if (d.lineWidth !== undefined) {
                                    return d.lineWidth;
                                }
                                return cfg.lineWidth;
                            })
                            .style("fill", function (d, i) {
                                var color;
                                if (d.background !== undefined) {
                                    console.log(d);
                                    return d.background;
                                }
                                //if (d.name.substr(0, 2) == ".@"){
                                //    color = "#1B95E0";
                                //    return color;
                                //}
                                //else if (d.name.substr(0, 2) == "RT") {
                                //    color = "#19cf86";
                                //    return color;
                                //}
                                return colors[i];
                            })
                            .attr("cy", function (d) {
                                if (cfg.horizontalLayout) {
                                    return Math.floor(cfg.height / 2);
                                }
                                var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                                return Math.floor(step * (datum - minValue) + margin);
                            })
                            .attr("cx", function (d, i) {
                                if (cfg.horizontalLayout) {
                                    var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                                    //console.log("cx: ",Math.floor(step * (datum - minValue) + margin));
                                    //console.log("cx: ",Math.floor(step * (datum - minValue) + margin));
                                    return Math.floor(step * (datum - minValue) + margin);
                                }
                                return Math.floor(cfg.width / 2);
                            })
                    }

                    if (cfg.horizontalLayout == false) {

                        //tip.append("div").style("float", "left").html(dateValue );
                        //tip.transition()
                        //    .duration(100)
                        //    .style("opacity", .9);
                    }

                    //Adding start and end labels
                    if (cfg.showLabels !== false) {
                        var format, startString, endString;
                        if (cfg.dateDimension) {
                            format = d3.time.format(cfg.labelFormat);
                            startString = format(new Date(minValue));
                            endString = format(new Date(maxValue));
                        } else {
                            format = function (d) {
                                return d;
                            }; //Should I do something else?
                            startString = minValue;
                            endString = maxValue;
                        }
                        svg.append("text")
                            .text(startString).style("font-size", "95%")
                            .attr("x", function (d) {
                                if (cfg.horizontalLayout) {
                                    return d3.max([0, (margin - this.getBBox().width / 2)]);
                                }
                                return Math.floor(this.getBBox().width / 2);
                            })
                            .attr("y", function (d) {
                                if (cfg.horizontalLayout) {
                                    return Math.floor(cfg.height / 2 + (margin + this.getBBox().height));
                                }
                                return margin + this.getBBox().height / 2;
                            })
                            .classed("md-title",true);


                        if(startString != endString)
                        {
                            //console.log(startString,endString);
                        svg.append("text")
                            .text(endString).style("font-size", "95%")
                            .attr("x", function (d) {
                                if (cfg.horizontalLayout) {
                                    return cfg.width - d3.max([this.getBBox().width, (margin + this.getBBox().width / 2)]);
                                }
                                return Math.floor(this.getBBox().width / 2);
                            })
                            .attr("y", function (d) {
                                if (cfg.horizontalLayout) {
                                    return Math.floor(cfg.height / 2 + (margin + this.getBBox().height));
                                }
                                return cfg.height - margin + this.getBBox().height / 2;
                            })
                            .classed("md-title",true);
                        }
                    }

                    svg.on("mousemove", function () {
                            var tipPixels = parseInt(tip.style("height").replace("px", ""));
                            return tip.style("top", (d3.event.pageY - tipPixels - margin) + "px").style("left", (d3.event.pageX + 20) + "px");
                        });
                        //.on("mouseout", function () {
                        //    return tip.style("opacity", 0).style("top", "0px").style("left", "0px");
                        //});
                };
                //scope.render(events);

                scope.$watch(function() {
                    return angular.element($window)[0].innerWidth;
                }, function(newVals, oldVals) {
                    if (newVals != oldVals) {
                        d3.select(element[0]).selectAll("*").remove();
                        scope.render(events, options);
                    }
                });

                //// whenever the bound 'exp' expression changes, execute this
                scope.$watch('data', function (newVals, oldVals) {
                    if (JSON.stringify(newVals) === JSON.stringify(oldVals) ) {
                        //console.log(JSON.stringify(newVals),JSON.stringify(oldVals));
                        d3.select(element[0]).selectAll("*").remove();
                        return scope.render(newVals, options);
                    }
                });
                scope.$watch('options', function (newVals, oldVals) {
                    if (newVals != oldVals){
                        d3.select(element[0]).selectAll("*").remove();
                        return scope.render(events,newVals);
                    }
                });
            });
        }
    };
}])
    .directive('joystick', function() {

        function joystickController ($scope) {

        }

        return {
            restrict : 'E',
            controller : ['$scope', function ($scope) {
                return joystickController($scope);
            }],
            scope : {
                // Using primitives here did not work, so we use an Object, see: http://stackoverflow.com/questions/14049480/what-are-the-nuances-of-scope-prototypal-prototypical-inheritance-in-angularjs
                position : '='
            },
            template : '<canvas class="joystickCanvas"></canvas>',
            link : function(scope, element) {

                var joystickHeight = 100;
                var joystickWidth  = 100;

                var center = {
                    x : joystickHeight / 2,
                    y : joystickWidth / 2
                };

                var radiusCircle = 17.5;
                var radiusBound = 25;

                // Canvas and context element
                var container = element[0];
                var canvas = container.children[0];
                var ctx = canvas.getContext('2d');

                // Id of the touch on the cursor
                var cursorTouchId = -1;
                var cursorTouch = {
                    x : center.x,
                    y : center.y
                };

                function resetCanvas() {
                    canvas.height = joystickHeight;
                    canvas.width = joystickWidth;
                }

                function onTouchStart(event) {
                    var touch = event.targetTouches[0];
                    console.log(touch);
                    cursorTouchId = touch.identifier;
                    cursorTouch = {
                        x : touch.pageX - touch.target.offsetLeft,
                        y : touch.pageY - touch.target.offsetTop
                    };
                }

                function onTouchMove(event) {
                    // Prevent the browser from doing its default thing (scroll, zoom)
                    event.preventDefault();
                    for(var i = 0; i < event.changedTouches.length; i++){
                        var touch = event.changedTouches[i];

                        if(cursorTouchId === touch.identifier)
                        {
                            cursorTouch = {
                                x : touch.pageX - touch.target.offsetLeft,
                                y : touch.pageY - touch.target.offsetTop
                            };

                            var scaleX = radiusBound / (cursorTouch.x - center.x);
                            var scaleY = radiusBound / (cursorTouch.y - center.y);

                            if(Math.abs(scaleX) < 1) {
                                cursorTouch.x = Math.abs(cursorTouch.x - center.x) * scaleX + center.x;
                            }

                            if (Math.abs(scaleY) < 1) {
                                cursorTouch.y = Math.abs(cursorTouch.y - center.y) * scaleY + center.y;
                            }

                            scope.$apply(
                                scope.position = {
                                    x : Math.round(((cursorTouch.x - center.x)/radiusBound) * 100),
                                    y : Math.round(((cursorTouch.y - center.y)/radiusBound) * -100)
                                }
                            );

                            break;
                        }
                    }

                }

                function onTouchEnd() {

                    cursorTouchId = -1;

                    scope.$apply(
                        scope.position = {
                            x : 0,
                            y : 0
                        }
                    );

                    cursorTouch.x = center.x;
                    cursorTouch.y = center.y;
                }

                function draw() {
                    // Clear the canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    ctx.beginPath();
                    ctx.strokeStyle = 'cyan';
                    ctx.lineWidth = 5;
                    ctx.arc(center.x, center.y, radiusCircle, 0, Math.PI*2, true);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.strokeStyle = 'cyan';
                    ctx.lineWidth = 2;
                    ctx.arc(center.x, center.y, radiusBound, 0, Math.PI*2, true);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.strokeStyle = 'cyan';
                    ctx.lineWidth = 2;
                    ctx.arc(cursorTouch.x, cursorTouch.y, radiusCircle, 0, Math.PI*2, true);
                    ctx.stroke();

                    requestAnimFrame(draw);
                }

                // Check if touch is enabled
                var touchable = true;

                if(touchable) {
                    canvas.addEventListener( 'touchstart', onTouchStart, false );
                    canvas.addEventListener( 'touchmove', onTouchMove, false );
                    canvas.addEventListener( 'touchend', onTouchEnd, false );

                    window.onorientationchange = resetCanvas;
                    window.onresize = resetCanvas;
                }

                // Bind to the values from outside as well
                scope.$watch('position', function(newval) {
                    cursorTouch = {
                        x : ((newval.x * radiusBound) / 100) + center.x,
                        y : ((newval.y * radiusBound) / -100) + center.y
                    };
                });

                resetCanvas();
                draw();

            }

        };

    })
    .directive('script', function() {
        return {
            restrict: 'E',
            scope: false,
            link: function(scope, elem, attr)
            {
                if (attr.type==='text/javascript-lazy')
                {
                    var s = document.createElement("script");
                    s.type = "text/javascript";
                    var src = elem.attr('src');
                    if(src!==undefined)
                    {
                        s.src = src;
                    }
                    else
                    {
                        var code = elem.text();
                        s.text = code;
                    }
                    s.setAttribute('data-maitre', '');
                    s.setAttribute('async','');
                   var parent = elem.parent();
                    console.log(s);
                    parent.append(s);
                    elem.remove();
                }
            }
        };
    });
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();
