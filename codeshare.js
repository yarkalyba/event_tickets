// File: seatmap.js
// Module representing location of seats and chairs on the map

const PRICE_1 = 100, PRICE_2 = 50, PRICE_3 = 10, PRICE_4 = 5;
const NUM_SEATS_1 = 6, NUM_SEATS_2 = 4;
const tables_info = {
    "high_class": [PRICE_1, "#FAFF37"],
    "middle_class": [PRICE_2, "#FF7097"],
    "low_class": [PRICE_3, "#7671FF"],
    "test_class": [PRICE_4, "#26FF49"]
};

class Furniture {
    constructor(x, y, color, id, radius, status) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.id = id;
        this.radius = radius;
        this._status = status;
    }

    get status() {
        return this._status
    }
}

class Table extends Furniture {
    constructor(x, y, id, class_type, color, radius = 25, status = "unavailable") {
        super(x, y, color, id, radius, status);
        this.class_type = class_type;
    }

    find_point(x0, y0, alpha) {
        let rx = x0 - this.x,
            ry = y0 - this.y;
        let c = Math.cos(alpha),
            s = Math.sin(alpha);
        let x1 = this.x + rx * c - ry * s,
            y1 = this.y + rx * s + ry * c;
        return [x1, y1]
    }

    draw_seats(seats_number, paper) {
        // todo: assert that 0 < seats number < 12
        let alpha = Math.PI * 2 / seats_number;
        let table = paper.circle(this.x * this.radius,
            this.y * this.radius, this.radius).attr({stroke: "none", fill: this.color, opacity: .4});

        // radius of first seat is counted as Table.x + 2*Table.radius
        var x = 1.2*this.x;
        var y = this.y;
        // identify coordinates for 1 seat and cos for shift

        for (let i = 0; i < seats_number; i++) {
            //alert(x);
            //alert(y);
            var seat = new Seat(x, y, i+1, tables_info[this.class_type][0]);
            seat.raphael = paper.circle(seat.x*2.5*seat.radius,
                seat.y*2.5*seat.radius, seat.radius).attr({stroke: "none", fill: this.color, opacity: .4});
            let points = this.find_point(x, y, alpha);
            x = points[0];
            y = points[1];
        }
    }
}

class Seat extends Furniture {
    constructor(x, y, id, price, color = "#FF0000", radius = 10, status = "available") {
        super(x, y, color, id, radius, status);
        this.price = price;
        this.raphael = null;
    }

    mouseover() {
        this.raphael.attr("opacity", 1);
    }

    mouseout() {
        this.raphael.attr("opacity", .4);
    }

    click() {
        {
        }

    }
}

window.onload = function () {
    let tables = [{"x": 10, "y": 10, "class_type": "high_class"},
        {"x": 20, "y": 10, "class_type": "test_class"},
        {"x": 10, "y": 20, "class_type": "middle_class"},
        {"x": 20, "y": 20, "class_type": "low_class"}];  //coordinates of tables

    // Creates canvas 500 � 500 at 50, 30
    let paper = Raphael(50, 90, 10000, 10000);

    for (let i = 0; i < tables.length; i++) {
        let info = tables_info[tables[i].class_type];

        let table = new Table(tables[i].x, tables[i].y, i+1, tables[i].class_type, info[1]);
        table.draw_seats(12, paper);
    }
};