// File: tables_map.js
// Module representing of seats and chairs on the map

const PRICE_1 = 100, PRICE_2 = 50, PRICE_3 = 10, PRICE_4 = 5;
const NUM_SEATS_1 = 6, NUM_SEATS_2 = 7;
const tables_info = {
    "high_class": [PRICE_1, "#95b5f2"],
    "middle_class": [PRICE_2, "#db3d77"],
    "low_class": [PRICE_3, "#9edf02"]
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
    constructor(x, y, id, class_type, color, radius = 80) {
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
            this.y * this.radius, this.radius).attr({stroke: "none", fill: this.color, opacity: .4});

        // define coefficient
        let x = 1.2 * this.x;

        let y = this.y;

        for (let i = 0; i < seats_number; i++) {
            const seat = new Seat(x, y, i + 1, tables_info[this.class_type][0]);
            const radius_coef = this.radius / seat.radius;
            seat.raphael = paper.circle(seat.x*radius_coef*seat.radius,
                seat.y*radius_coef*seat.radius, seat.radius).attr({stroke: "none", fill: seat.color, opacity: .4});
            let points = this.find_point(x, y, alpha);
            x = points[0];
            y = points[1];
        }
    }
}

class Seat extends Furniture {
    constructor(x, y, id, price, color = "#6a0146", radius = 30) {
        super(x, y, color, id, radius, status);
        this.price = price;
        this.raphael = null;
    }
}

window.onload = function () {
    let tables = [{"x": 10, "y": 10, "class_type": "high_class"},
        {"x": 10, "y": 20, "class_type": "high_class"},
        {"x": 10, "y": 30, "class_type": "middle_class"},
        {"x": 10, "y": 40, "class_type": "low_class"}];  //coordinates of tables

    // Creates canvas 500 � 500 at 50, 30
    let paper = Raphael(50, 90, 10000, 10000);

    for (let i = 0; i < tables.length; i++) {
        let info = tables_info[tables[i].class_type];

        let table = new Table(tables[i].x, tables[i].y, i+1, tables[i].class_type, info[1]);
        table.draw_seats(NUM_SEATS_2, paper);
    }
};