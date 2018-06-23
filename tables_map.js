// File: tables_map.js
// Module representing of seats and chairs on the map

const PRICE_1 = 100, PRICE_2 = 50, PRICE_3 = 10, PRICE_4 = 5;
const NUM_SEATS_1 = 6, NUM_SEATS_2 = 10;
const tables_info = {
    "high_class": [PRICE_1, "#88001B"],
    "middle_class": [PRICE_2, "#482124"],
    "low_class": [PRICE_3, "#810100"]
};

class Furniture {
    constructor(x, y, color, id, radius) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.id = id;
        this.radius = radius;
    }
}

class Table extends Furniture {
    constructor(x, y, id, class_type, color, radius = 20) {
        super(x, y, color, id, radius);
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
        // assert that 0 < seats number < 12
        let alpha = Math.PI * 2 / seats_number;
        let table = paper.circle(this.x * this.radius,
            this.y * this.radius, this.radius).attr({stroke: "none", fill: this.color, opacity: 1});

        let coef = 10;
        let x = (1 + 0.2 * coef / this.x) * this.x;

        let y = this.y;

        for (let i = 0; i < seats_number; i++) {
            const seat = new Seat(x, y, i + 1, tables_info[this.class_type][0]);
            const radius_coef = this.radius / seat.radius;
            let seat_raphael = paper.circle(seat.x * radius_coef * seat.radius,
                seat.y * radius_coef * seat.radius, seat.radius).attr({stroke: "none", fill: seat.color, opacity: 0.8});

            seat_raphael.mouseover(function () {
                this.attr("opacity", .4);
            });

            seat_raphael.mouseout(function () {
                this.attr("opacity", .8);
            });

            seat_raphael.click(function () {
                if (this.attrs.fill === "#8E8E86") {
                    this.attr("fill", seat.color);
                }
                else {
                    this.attr("fill", "#8E8E86");
                }
                document.getElementById('selectedSeat').innerHTML = 'Seat selected at ' + this.attrs.cx + ',' + this.attrs.cy;
            });

            let points = this.find_point(x, y, alpha);
            x = points[0];
            y = points[1];
        }
    }
}

class Seat extends Furniture {
    constructor(x, y, id, price, color = "#C16864", radius = 5) {
        super(x, y, color, id, radius, status);
        this.price = price;
        this.raphael = null;
    }
}

window.onload = function () {
    let tables = [{"x": 8, "y": 22, "class_type": "high_class"},
        {"x": 20, "y": 10, "class_type": "middle_class"},
        {"x": 28, "y": 20, "class_type": "low_class"},
        {"x": 30, "y": 5, "class_type": "low_class"},
        {"x": 43, "y": 10, "class_type": "high_class"},
        {"x": 10, "y": 5, "class_type": "low_class"},
        {"x": 15, "y": 35, "class_type": "middle_class"},
        {"x": 30, "y": 35, "class_type": "low_class"},
        {"x": 43, "y": 25, "class_type": "high_class"},
        {"x": 50, "y": 33, "class_type": "middle_class"}];  //coordinates of tables

    // Creates canvas 500 � 500 at 50, 30
    let paper = Raphael(50, 90, 10000, 10000);

    for (let i = 0; i < tables.length; i++) {
        let info = tables_info[tables[i].class_type];

        let table = new Table(tables[i].x, tables[i].y, i + 1, tables[i].class_type, info[1]);
        table.draw_seats(NUM_SEATS_2, paper);
    }
};