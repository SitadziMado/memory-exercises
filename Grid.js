'use strict';

function Cell(td, x, y) {
    td.append('<div class="cell-content-wrapper">');
    var div = td.children();

    Object.defineProperties(
        this, {
            get td() {
                return td;
            },
            get contentWrapper() {
                return div;
            },
            get x() {
                return x;
            },
            get y() {
                return y;
            },
            text: {
                get: function () {
                    return span.html(); // td.html();
                },
                set: function (value) {
                    span.html(value.toString());
                }
            }
        }
    );
}

Cell.constructor = Cell;

Cell.prototype.toggleClass = function (className) {
    this.contentWrapper.toggleClass(className);
};

function Grid(parentId) {
    if (typeof parentId !== 'string') {
        throw new Error('ИД родителя должен быть строкой');
    }

    var self = this;
    var parent = $(parentId);
    var table;
    var grid = [];
    var isCreated = false;

    Object.defineProperties(
        this, {
            get width() {
                if (grid.length > 0) {
                    return grid[0].length;
                } else {
                    return 0;
                }
            },
            get height() {
                return grid.length;
            },
            get grid() {
                return grid;
            },
            get table() {
                return table;
            },
            get isCreated() {
                return isCreated;
            }
        }
    );

    this.createTable = function () {
        table = parent.append('<table>').children();
        isCreated = true;
    };

    this.clear = function () {
        if (isCreated) {
            isCreated = false;
            parent.empty();
            grid = [];
        }
    };
}

Grid.constructor = Grid;

Grid.prototype.generate = function (w, h) {
    if (!this.isCreated) {
        this.createTable();

        var self = this;
        var i;

        for (i = 0; i < h; ++i) {
            this.table.append('<tr class="grid-row">');
        }

        var trs = this.table.children();

        for (i = 0; i < w; ++i) {
            trs.append('<td class="grid-cell">');
        }

        var y = 0;

        trs.each(function () {
            var tr = $(this);
            self.grid.push([]);

            var x = 0;

            tr.children().each(function () {
                var td = $(this);
                self.grid[y].push(new Cell(td, x, y));
                ++x;
            });

            ++y;
        });
    }
};

Grid.prototype.rectangleSelection = function (x, y, w, h, f) {
    var i, j, yh = y + h, xw = x + w;

    for (i = y; i < yh; ++i) {
        for (j = x; j < xw; ++j) {
            f.apply(this.grid[i][j], []);
        }
    }
};

Grid.prototype.each = function (f) {
    this.rectangleSelection(
        0, 0, this.width, this.height, f
    );
};
