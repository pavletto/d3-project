(function() {
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
            var ctl = this;
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            nodes.forEach(function(d) {
                console.log(d);
                d.y = d.depth * 300;
            });

            var node = svg.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id || (d.id = ++i);
                });

            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr('id', function(d, i) {
                    return 'node-' + i;
                })

            nodeEnter.append("circle")
                .attr("r", 30)
                .attr("class", 'circle')
                .attr('id', function(d, i) {
                    return 'circle-' + i;
                })
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            Ext.define('app.window', {
                extend: 'Ext.window.Window',
                alias: 'widget.win',
                itemId: 'win',
                title: 'Окошко',
                x:200,
                y:200,
                width: 300,
                height: 300,
                text: '',
                autoHeight: true,
                autoScroll: true,
                maximizable: true,
                closeAction: 'hide',
                shadow: true,
                resizable: true,
                draggable: true,
                closable: true,
                modal: false,
                items:[{xtype:'displayfield'}],
                headerPosition: 'top',renderTo: 'ext-zone'
            });
            win = Ext.create('app.window')
            d3.selectAll('.circle')
                .each(function(e, i) {
                    d3.select('#circle-' + i).on('click', function(e, t, eOpts) {
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
                        if (!this.pressed) {
                            if (!d3.select('#button-' + i)[0][0]) {
                                d3.select('#circle-' + i)
                                    .classed('unselected', false)
                                    .classed('selected', true)
                                this.pressed = true;
                                if (d3.selectAll('.selected').size() == 1)
                                    ctl.prevPressed = i;
                                if (d3.selectAll('.selected').size() > 1) {
                                    d3.select('#circle-' + ctl.prevPressed).classed('unselected', true).classed('selected', false).attr('r', 30).property('pressed', null);
                                    d3.select('#button-' + ctl.prevPressed).transition().duration(200).attr("opacity", 0).remove();
                                    ctl.prevPressed = i;
                                }
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
                                Ext.get('button-' + i).on('click', function(e, t, eOpts) {
                                    d3.select('#button-' + i).transition()
                                        .duration(100)
                                        .attr("transform", function(d) {
                                            return "translate(" + (50 + r + 5 + 10) + ", 0) scale(1.2, 1.2)";
                                        })
                                        .transition()
                                        .duration(100)
                                        .attr("transform", function(d) {
                                            return "translate(" + (50 + r + 5 + 10) + ", 0) scale(1, 1)";
                                        });
                                          win.show();
                                          win.down('displayfield').setValue(Ext.JSON.encode(d3.select('#node-' + i).data()[0].data[0]));
                                });
                            }
                        } else {
                            d3.select('#circle-' + i)
                                .classed('unselected', true)
                                .classed('selected', false)
                                .attr('r', 30);
                            d3.select('#button-' + i)
                                .transition()
                                .duration(200)
                                .attr("opacity", 0)
                                .remove();
                            this.pressed = null;
                        }
                    });
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
                .attr("class", "link");
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