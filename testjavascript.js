var one = new Vue({
    el: '#textInput',
    data: {
        userInput: null,
        stringArrays: [],
        cloudShape: null,
        topWords: 50,
        posColor: '#00ff00',
        negColor: '#ff0000',
        wordFont: "Arial",
        swissColor: "#000000",
        showWordList: null
    },
    computed: {
        splitUserInput: function () {
            var userInput = this.userInput;
            if (userInput != null) {
                return userInput.replace(
                    /[^A-Z0-9]+/ig, " ").trim().split(
                    ' ');
            }
            
        },
        textLength: function () {
            if (this.userInput != null) {
                return this.splitUserInput.length;
            }
        }
    },
    methods: {

        removePicture: function () {
            var parent = document.getElementById("textInput");
            var child = document.getElementById("cloudPicture");
            parent.removeChild(child);
        },
        
        parsingInput: function () {
            that = this;
            var splitUserInput = that.splitUserInput;
            var stringArrays = that.stringArrays;
            splitUserInput.forEach(function (element) {
                function matchString(wordFrequency) {
                    return wordFrequency==element;
                }
                function nomatchString(wordFrequency) {
                    return wordFrequency != element;
                }
                var matchedCount = splitUserInput.filter(matchString).length*10;
                splitUserInput = splitUserInput.filter(nomatchString);
                    stringArrays.push({
                    text: element,
                    size: matchedCount
                    
                })                    
            })
            //for (eachText in stringArrays) {
                //document.getElementById("stringArrayJSONString").innerHTML = (eachText, '= ', JSON.stringify(stringArrays[eachText]));
            //}
        },
        uniq: function (a, param) {
            return a.filter(function (item, pos, array) {
                return array.map(function (mapItem) {
                    return mapItem[param];
                }).indexOf(item[param]) ===
                    pos;
            })
        },
        createWordCloud: function () {
            var width = 500;
            var height = 500;
            var fill = d3.scale.category20();
            var wordFont = this.wordFont;

            d3.layout.cloud()
                .size([width, height])
                .words(this.stringArrays)
                .rotate(function () {
                    return ~~(Math.random() * 2);
                })
                .font(wordFont)
                .fontSize(function (d) {
                    return d.size;
                })
                .on("end", drawSkillCloud)
                .start();

            // Finally implement `drawSkillCloud`, which performs the D3 drawing:

            // apply D3.js drawing API
            function drawSkillCloud(words) {
                d3.select("#cloudPicture").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + ~~(
                        width / 2) + "," + ~~(height /
                            2) + ")")
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("font-size", function (d) {
                        return d.size + "px";
                    })
                    .style("user-select", "auto")
                    .style("cursor", "text")
                    .style("font-family", wordFont)
                    .style("fill", function (d, i) {
                        return fill(i);
                    })
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) {
                        return "translate(" + [d.x, d
                            .y
                        ] + ")rotate(" + d.rotate +
                            ")";
                    })
                    .text(function (d) {
                        return d.text;
                    });
            }

            // set the viewbox to content bounding box (zooming in on the content, effectively trimming whitespace)

            var svg = document.getElementsByTagName("svg")[
                0];
            var bbox = svg.getBBox();
            var viewBox = [bbox.x, bbox.y, bbox.width,
            bbox.height
            ].join(" ");
            svg.setAttribute("viewBox", viewBox);
        },
        clearCloudPicture: function () {
            $(document).ready(function () {
                $("button").click(function () {
                    $("#cloudPicture").empty();
                });
            });
        }
    }
});
