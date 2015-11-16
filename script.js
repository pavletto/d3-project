(function() {
    console.log(window)
    Ext.define("d3.widgets.Treeview", {
        extend: 'Ext.Panel',
        alias: 'widget.d3_treeview',
        tree: '',
        svg: '',
        duration: 500,
        diagonal: '',
        i: 0,
        me: null,
        distBetweenLayer: '',
        distBetweenNode: '',

        constructor: function(config) {
            this.callParent([config]);
            me = this;
        },

        initComponent: function() {

            console.log('2) Tree View initComponent called');
            this.on('afterRender', function() {
                this.loadScript(this.onD3Loaded, this);
            }, this);
            this.callParent(arguments);
        },
        loadScript: function(callback, scope) {
            Ext.Loader.injectScriptElement('http://d3js.org/d3.v3.js', this.onLoad, this.onError, this);

        },
        onError: function() {
            console.log('Treeview On Error');
        },
        onLoad1: function() {
            console.log('Treeview On onLoad1');
        },
        onD3Loaded: function() {
            console.log('Treeview onD3Loaded - D3 script load callback');
        },

        onLoad: function() {
            var me = this;
            console.log('Tree View Store --------------------------- ');
            var treeData = [{
                "name": "Top Level",
                "data": [{
                    "command": "dialExten",
                    "commandId": 1
                }],
                "parent": "null",
                "children": [{
                    "name": "Level 2: A",
                    "data": [{
                        "command": "dialExten",
                        "commandId": 2
                    }],
                    "parent": "Top Level",
                    "children": [{
                        "name": "Son of A",
                        "data": [{
                            "command": "dialExten",
                            "commandId": 3
                        }],
                        "parent": "Level 2: A"
                    }, {
                        "name": "Daughter of A",
                        "data": [{
                            "command": "dialExten",
                            "commandId": 4
                        }],
                        "parent": "Level 2: A"
                    }]
                }, {
                    "name": "Level 2: B",
                    "data": [{
                        "command": "dialExten",
                        "commandId": 5
                    }],
                    "parent": "Top Level"
                }]
            }];

            // ************** Generate the tree diagram  *****************
            var margin = {
                    top: 40,
                    right: 120,
                    bottom: 20,
                    left: 120
                },
                width = window.innerWidth - margin.right - margin.left,
                height = window.innerHeight - margin.top - margin.bottom;

            i = 0;
            duration = this.duration;
            tree = d3.layout.tree()
                .size([height, width]);

            diagonal = d3.svg.diagonal()
                .projection(function(d) {
                    return [d.x, d.y];
                });

            svg = d3.select("body").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            root = treeData[0];
            this.update(root);

            d3.select(self.frameElement).style("height", "800px");



        },
        update: function(source) {

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function(d) {
                console.log(d);
                d.y = d.depth * 300;
            });

            // Update the nodes…
            var node = svg.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id || (d.id = ++i);
                });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr('id', function(d, i) {
                    return 'node-' + i;
                })
                // .attr("transform", function(d) {
                //     return "translate(" + source.y0 + "," + source.x0 + ")";
                // })
                // .on("click", function(d) {
                //     if (d.children) {
                //         d._children = d.children;
                //         d.children = null;
                //     } else {
                //         d.children = d._children;
                //         d._children = null;
                //     }
                //     me.update(d);
                // });

            nodeEnter.append("circle")
                .attr("r", 30)
                .attr("class", 'circle')
                .attr('id', function(d, i) {
                    return 'circle-' + i;
                })
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });



            d3.selectAll('.circle')
                .each(function(e, i) {
                    Ext.get('circle-' + i).on('click', function(e, t, eOpts) {
                        var win = Ext.create('widget.window', { // создание окна
                            title: 'Пример 1',
                            html: '<h1>Информация о узле:</h1><pre>' + Ext.JSON.encode(d3.select('#node-' + i).data()[0].data[0]) + '</pre>',
                            x: 400, // позиция относительно родительского окна.
                            y: 400, // - width: '30%',
                            // ширина. Строковое значение задается по стандарту
                            // - px,%, em и т.д.
                            autoHeight: true,
                            autoScroll: true, // скроллинг если текст не влезает.
                            maximizable: true, // значок «раскрыть окно на весь экран»
                            bodyCls: 'red', // установка класса для содержимого окна.
                            //Здесь .css1 {background:#fff;color:red;}
                            bodyPadding: '10px', // установка паддинга для содержимого.
                            // Лучше конечно через bodyCls
                            bodyStyle: 'background-color:#fff', // прямое указание стиля для содержимого окна
                            closeAction: 'hide', // !!! Важно. Указание на то, что окно при закрывании
                            // не удаляется вместе с содержимым,
                            /*  этот блок параметров лишний. Они и так выставлены
                            по умолчанию так как указано ниже  */

                            shadow: true, // тень
                            resizable: true, // возможность изменения размеров окна.
                            draggable: true, // возможность перетаскивания окна.
                            closable: true, // спрятать иконку закрытия окна в заголовке
                            modal: false, //  modal задает модальное окно.
                            // При открсытии делает недоступными все остальные окна
                            headerPosition: 'top', //  заголовок  и кнопку закрытия разместим
                            //справа {left, top, right, bottom}
                        });


                        d3.select('#circle-' + i)
                            .transition()
                            .duration(100)
                            .attr("transform", function(d) {
                                return "scale(1.2, 1.2)";
                            })
                            .transition()
                            .duration(100)
                            .attr("transform", function(d) {
                                return "scale(1, 1)";
                            });
                        r = 10;
                        if (!this.firstClick) {
                            if (!d3.select('#button-' + i)[0][0]) {
                                d3.select('#circle-' + i)
                                    .attr('class', 'selected');

                                d3.select('#node-' + i).append("circle")
                                    .attr("id", function(d) {
                                        return "button-" + i;
                                    })

                                .attr('r', r)
                                    .attr("transform", function(d) {
                                        return "translate(" + (50 + r + 5 + 10) + ", 0)";
                                    })
                                    .attr("opacity", 0)
                                    .transition()
                                    .duration(200)
                                    .attr("opacity", 1)
                                    .style("fill", function(d) {
                                        return d._children ? "lightsteelblue" : "#fff";
                                    });
                                this.firstClick = true;
                                Ext.get('button-' + i).on('click', function(e, t, eOpts) {
                                    d3.select('#button-' + i)
                                    d3.select('#button-' + i).transition()
                                        .duration(100)
                                        .attr("transform", function(d) {
                                            return "scale(1.2, 1.2)";
                                        })
                                        .transition()
                                        .duration(100)
                                        .attr("transform", function(d) {
                                            return "scale(1, 1)";
                                        });

                                    win.show();
                                });
                            }
                        } else {

                            d3.select('#circle-' + i)
                                .attr('class', 'unselected')

                            .attr('r', 30);
                            d3.select('#button-' + i)
                                .transition()
                                .duration(200)
                                .attr("opacity", 0)
                                .remove();
                            this.firstClick = null;
                        }
                    });
                    // Ext.get('circle-' + i).on('mouseout', function(e, t, eOpts) {
                    //
                    // });
                });

            this.node = nodeEnter;

            nodeEnter.append("text")
                .attr("x", function(d) {
                    return d.children || d._children ? -10 : 10;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) {
                    return d.name;
                })
                .style("fill-opacity", 1e-6);

            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            nodeUpdate.select("circle")
                .attr("r", 30)
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + source.x + "," + source.y + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 30);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);
            var link = svg.selectAll("path.link")
                .data(links, function(d) {
                    return d.target.id;
                });
            link.enter().insert("path", "g")
                .attr("class", "link")
                // .attr("d", function(d) {
                //     var o = {
                //         x: source.y0,
                //         y: source.x0
                //     };
                //     return diagonal({
                //         source: o,
                //         target: o
                //     });
                // });
            link.transition()
                .duration(duration)
                .attr("d", diagonal);
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {
                        x: source.y,
                        y: source.x
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                })
                .remove();
            nodes.forEach(function(d) {
                d.x0 = d.y;
                d.y0 = d.x;
            });
        },
        onRender: function(ct, position) {
            console.log('3) onRender called ');
            this.callParent(arguments);
        },
    });

})();

Ext.create('d3.widgets.Treeview', {
    renderTo: Ext.getBody()
});